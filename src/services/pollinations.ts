// Pollinations.ai API - Free, no API key needed, works from browser
// Docs: https://pollinations.ai

const POLLINATIONS_BASE = 'https://gen.pollinations.ai';

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
    const response = await fetch(`${POLLINATIONS_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai',
        messages,
        private: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Text generation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
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

  return `${POLLINATIONS_BASE}/image/${encodedPrompt}?${params.toString()}`;
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
  const { model = 'wan', duration = 4 } = options;
  const encodedPrompt = encodeURIComponent(prompt);
  return `${POLLINATIONS_BASE}/video/${encodedPrompt}?model=${model}&duration=${duration}`;
}

// ============ EXPORT FUNCTIONALITY ============
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
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
    const response = await fetch(`${POLLINATIONS_BASE}/v1/models`);
    result.text = response.ok;
  } catch {
    result.text = false;
  }

  return result;
}

export const POLLINATIONS_SIGNUP_URL = 'https://pollinations.ai';
