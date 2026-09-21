// Hugging Face Inference API - Free tier, works from browser
// Docs: https://huggingface.co/docs/inference-api

const HF_BASE = 'https://api-inference.huggingface.co';

// ============ TEXT GENERATION ============
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
    const response = await fetch(`${HF_BASE}/models/mistralai/Mistral-7B-Instruct-v0.3`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Text generation failed: ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || '';
  } catch (error) {
    console.error('Text generation error:', error);
    throw error;
  }
}

// ============ IMAGE GENERATION ============
// Returns a direct image URL - works immediately!
export function generateImageUrl(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    model?: string;
    seed?: number;
  } = {}
): string {
  const {
    width = 1024,
    height = 576,
    seed = Math.floor(Math.random() * 1000000),
  } = options;

  // Use Hugging Face's free image generation
  const encodedPrompt = encodeURIComponent(prompt);
  return `${HF_BASE}/models/stabilityai/stable-diffusion-xl-base-1.0?inputs=${encodedPrompt}&width=${width}&height=${height}&seed=${seed}`;
}

// ============ VIDEO GENERATION ============
// Returns a direct video URL - works immediately!
export function generateVideoUrl(
  prompt: string,
  options: {
    model?: string;
    duration?: number;
  } = {}
): string {
  const { duration = 4 } = options;
  const encodedPrompt = encodeURIComponent(prompt);
  // Use a free video generation model
  return `${HF_BASE}/models/damo-vilab/text-to-video-ms-1.7b?inputs=${encodedPrompt}&num_frames=${duration * 8}`;
}

// ============ EXPORT FUNCTIONALITY ============
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    // Check if it's a blob URL (already in memory)
    if (url.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Otherwise fetch from remote
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
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
  return downloadFile(imageUrl, filename);
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
    const response = await fetch(`${HF_BASE}/models/mistralai/Mistral-7B-Instruct-v0.3`, {
      method: 'OPTIONS',
    });
    result.text = response.ok || response.status === 204;
  } catch {
    result.text = false;
  }

  return result;
}

export const POLLINATIONS_SIGNUP_URL = 'https://huggingface.co';
