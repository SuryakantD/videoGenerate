// Pollinations.ai Image API - Actually works from browser!
// Docs: https://pollinations.ai

const POLLINATIONS_IMAGE_BASE = 'https://image.pollinations.ai';

// ============ TEXT GENERATION ============
// Uses Pollinations text API (OpenAI-compatible)
export async function generateText(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: 'openai',
        seed: Math.floor(Math.random() * 1000000),
      }),
    });

    if (!response.ok) {
      throw new Error(`Text generation failed: ${response.status}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Text generation error:', error);
    throw error;
  }
}

// ============ IMAGE GENERATION ============
// Returns a direct image URL that works immediately!
// This is a GET request that returns an actual image
export function generateImageUrl(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    model?: string;
    seed?: number;
    nologo?: boolean;
  } = {}
): string {
  const {
    width = 1024,
    height = 576,
    model = 'flux',
    seed = Math.floor(Math.random() * 1000000),
    nologo = true,
  } = options;

  const encodedPrompt = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    model,
    width: width.toString(),
    height: height.toString(),
    seed: seed.toString(),
    nologo: nologo.toString(),
  });

  // This URL returns an actual image when accessed!
  return `${POLLINATIONS_IMAGE_BASE}/prompt/${encodedPrompt}?${params.toString()}`;
}

// ============ VIDEO GENERATION (Client-Side) ============
// Creates a real video from images using Canvas + MediaRecorder
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

  console.log('[VideoGen] Starting video generation with', imageUrls.length, 'images');

  return new Promise(async (resolve, reject) => {
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not create canvas context');
      }

      // Setup MediaRecorder
      const stream = canvas.captureStream(30); // 30 FPS
      
      // Try different MIME types for better browser compatibility
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }
      
      console.log('[VideoGen] Using MIME type:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps for better compatibility
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('[VideoGen] Recording stopped, creating blob...');
        const blob = new Blob(chunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(blob);
        console.log('[VideoGen] Video URL created:', videoUrl.substring(0, 50) + '...');
        stream.getTracks().forEach(track => track.stop());
        resolve(videoUrl);
      };

      mediaRecorder.onerror = (e) => {
        console.error('[VideoGen] MediaRecorder error:', e);
        reject(new Error('MediaRecorder error'));
      };

      // Load images directly from URLs (no fetch/conversion needed!)
      console.log('[VideoGen] Loading images...');
      const images: HTMLImageElement[] = [];
      
      for (let i = 0; i < imageUrls.length; i++) {
        try {
          console.log(`[VideoGen] Loading image ${i + 1}/${imageUrls.length}: ${imageUrls[i].substring(0, 60)}...`);
          
          // Load image directly from URL (Pollinations URLs work directly!)
          const img = new Image();
          img.crossOrigin = 'anonymous'; // Enable CORS for canvas
          
          await new Promise<void>((resolveImg, rejectImg) => {
            img.onload = () => {
              console.log(`[VideoGen] Image ${i + 1} loaded successfully`);
              resolveImg();
            };
            img.onerror = (e) => {
              console.error(`[VideoGen] Failed to load image ${i + 1}:`, e);
              rejectImg(new Error(`Failed to load image ${i + 1}`));
            };
            img.src = imageUrls[i];
          });
          
          images.push(img);
          
          if (onProgress) {
            onProgress(((i + 1) / imageUrls.length) * 30); // 0-30% for loading
          }
        } catch (error) {
          console.error(`[VideoGen] Failed to load image ${i + 1}:`, error);
          // Create a placeholder image
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
            pCtx.fillText(`Scene ${i + 1}`, width / 2, height / 2);
          }
          const placeholderImg = new Image();
          placeholderImg.src = placeholder.toDataURL();
          images.push(placeholderImg);
        }
      }

      console.log('[VideoGen] All images loaded, starting recording...');

      // Start recording
      mediaRecorder.start();
      
      const totalDuration = images.length * durationPerImage * 1000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        
        if (onProgress) {
          onProgress(30 + progress * 70); // 30-100% for recording
        }

        // Calculate current scene
        const sceneIndex = Math.min(
          Math.floor(elapsed / (durationPerImage * 1000)),
          images.length - 1
        );
        
        const sceneProgress = (elapsed % (durationPerImage * 1000)) / (durationPerImage * 1000);
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Draw current image with Ken Burns effect
        const img = images[sceneIndex];
        if (img) {
          // Ken Burns: slow zoom in
          const scale = 1 + sceneProgress * 0.1; // Zoom from 1.0 to 1.1
          const imgWidth = width * scale;
          const imgHeight = height * scale;
          const offsetX = (width - imgWidth) / 2;
          const offsetY = (height - imgHeight) / 2;

          ctx.save();
          ctx.drawImage(img, offsetX, offsetY, imgWidth, imgHeight);
          ctx.restore();
        }

        // Transition effect (fade in/out)
        if (sceneProgress < transitionDuration / durationPerImage) {
          // Fade in
          const fadeProgress = sceneProgress / (transitionDuration / durationPerImage);
          ctx.fillStyle = `rgba(0, 0, 0, ${1 - fadeProgress})`;
          ctx.fillRect(0, 0, width, height);
        } else if (sceneProgress > 1 - transitionDuration / durationPerImage) {
          // Fade out
          const fadeProgress = (sceneProgress - (1 - transitionDuration / durationPerImage)) / (transitionDuration / durationPerImage);
          ctx.fillStyle = `rgba(0, 0, 0, ${fadeProgress})`;
          ctx.fillRect(0, 0, width, height);
        }

        if (elapsed < totalDuration) {
          requestAnimationFrame(animate);
        } else {
          console.log('[VideoGen] Animation complete, stopping recorder...');
          mediaRecorder.stop();
        }
      };

      animate();
    } catch (error) {
      console.error('[VideoGen] Error:', error);
      reject(error);
    }
  });
}

// ============ EXPORT FUNCTIONALITY ============
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

export async function downloadVideo(videoUrl: string, filename: string): Promise<void> {
  return downloadFile(videoUrl, filename);
}

export async function downloadImage(imageUrl: string, filename: string): Promise<void> {
  try {
    // For Pollinations URLs, fetch and convert to blob
    if (imageUrl.startsWith('http')) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } else {
      // Already a blob URL
      await downloadFile(imageUrl, filename);
    }
  } catch (error) {
    console.error('Download error:', error);
    // Fallback: open in new tab
    window.open(imageUrl, '_blank');
  }
}

// ============ HEALTH CHECK ============
export async function checkApiHealth(): Promise<{
  text: boolean;
  image: boolean;
}> {
  const result = { text: false, image: false };

  // Check image API
  try {
    const testUrl = generateImageUrl('test', { width: 64, height: 64 });
    const imgResponse = await fetch(testUrl, { method: 'HEAD' });
    result.image = imgResponse.ok;
  } catch {
    result.image = false;
  }

  // Check text API
  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'test' }],
        model: 'openai',
      }),
    });
    result.text = response.ok;
  } catch {
    result.text = false;
  }

  return result;
}

export const POLLINATIONS_SIGNUP_URL = 'https://pollinations.ai';
