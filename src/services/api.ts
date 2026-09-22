// Pollinations API Service

export async function generateAndLoadImage(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    seed?: number;
  } = {}
): Promise<string> {
  const { width = 1024, height = 576, seed = Date.now() } = options;
  const encodedPrompt = encodeURIComponent(prompt);
  
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;
  
  // Fetch the image and convert to blob URL to avoid CORS issues
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    return blobUrl;
  } catch (error) {
    console.error('Error loading image:', error);
    throw error;
  }
}

export async function generateVideoFromImages(
  imageUrls: string[],
  options: {
    durationPerImage?: number;
    transitionDuration?: number;
    width?: number;
    height?: number;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<string> {
  const {
    durationPerImage = 3,
    transitionDuration = 0.5,
    width = 1024,
    height = 576,
    onProgress,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not create canvas context'));
      return;
    }

    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 2500000,
    });

    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      stream.getTracks().forEach(track => track.stop());
      resolve(videoUrl);
    };

    mediaRecorder.onerror = () => {
      reject(new Error('MediaRecorder error'));
    };

    // Load images
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const loadImage = (index: number) => {
      if (index >= imageUrls.length) {
        startRecording();
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        images[index] = img;
        loadedCount++;
        if (onProgress) {
          onProgress((loadedCount / imageUrls.length) * 50);
        }
        loadImage(index + 1);
      };
      
      img.onerror = () => {
        console.error(`Failed to load image ${index}`);
        // Create placeholder
        const placeholder = document.createElement('canvas');
        placeholder.width = width;
        placeholder.height = height;
        const pCtx = placeholder.getContext('2d');
        if (pCtx) {
          pCtx.fillStyle = '#1a1a1a';
          pCtx.fillRect(0, 0, width, height);
          pCtx.fillStyle = '#ffffff';
          pCtx.font = '30px Arial';
          pCtx.textAlign = 'center';
          pCtx.fillText(`Scene ${index + 1}`, width / 2, height / 2);
        }
        const placeholderImg = new Image();
        placeholderImg.src = placeholder.toDataURL();
        images[index] = placeholderImg;
        loadedCount++;
        loadImage(index + 1);
      };
      
      img.src = imageUrls[index];
    };

    const startRecording = () => {
      mediaRecorder.start();
      
      const totalDuration = images.length * durationPerImage * 1000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        
        if (onProgress) {
          onProgress(50 + progress * 50);
        }

        const sceneIndex = Math.min(
          Math.floor(elapsed / (durationPerImage * 1000)),
          images.length - 1
        );
        
        const sceneProgress = (elapsed % (durationPerImage * 1000)) / (durationPerImage * 1000);
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Draw current image
        const img = images[sceneIndex];
        if (img) {
          const scale = 1 + sceneProgress * 0.1;
          const imgWidth = width * scale;
          const imgHeight = height * scale;
          const offsetX = (width - imgWidth) / 2;
          const offsetY = (height - imgHeight) / 2;

          ctx.save();
          ctx.drawImage(img, offsetX, offsetY, imgWidth, imgHeight);
          ctx.restore();
        }

        // Fade transitions
        if (sceneProgress < transitionDuration / durationPerImage) {
          const fadeProgress = sceneProgress / (transitionDuration / durationPerImage);
          ctx.fillStyle = `rgba(0, 0, 0, ${1 - fadeProgress})`;
          ctx.fillRect(0, 0, width, height);
        } else if (sceneProgress > 1 - transitionDuration / durationPerImage) {
          const fadeProgress = (sceneProgress - (1 - transitionDuration / durationPerImage)) / (transitionDuration / durationPerImage);
          ctx.fillStyle = `rgba(0, 0, 0, ${fadeProgress})`;
          ctx.fillRect(0, 0, width, height);
        }

        if (elapsed < totalDuration) {
          requestAnimationFrame(animate);
        } else {
          mediaRecorder.stop();
        }
      };

      animate();
    };

    loadImage(0);
  });
}
