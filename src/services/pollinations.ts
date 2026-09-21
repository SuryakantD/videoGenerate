// Pollinations.ai API Service
// Free AI generation API - https://pollinations.ai
// No API key required for basic image generation
// API key needed for video, audio, and advanced features

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
        model: 'openai/gpt-4o-mini',
        messages,
        temperature: 0.8,
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
// Returns a direct image URL - no API key needed!
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
// Returns a video URL
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

// ============ AUDIO/TTS GENERATION ============
export function generateAudioUrl(
  text: string,
  options: {
    voice?: string;
    model?: string;
  } = {}
): string {
  const { voice = 'nova' } = options;
  const encodedText = encodeURIComponent(text);
  return `${POLLINATIONS_BASE}/audio/${encodedText}?voice=${voice}`;
}

// ============ PREFLIGHT CHECK ============
export async function checkApiHealth(): Promise<{
  text: boolean;
  image: boolean;
}> {
  const result = { text: false, image: false };

  // Check image API (just verify URL is accessible)
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

// ============ AVAILABLE MODELS ============
export const IMAGE_MODELS = [
  { id: 'flux', name: 'Flux (Default)', quality: 'high' },
  { id: 'flux-realism', name: 'Flux Realism', quality: 'high' },
  { id: 'flux-anime', name: 'Flux Anime', quality: 'high' },
  { id: 'flux-3d', name: 'Flux 3D', quality: 'high' },
  { id: 'turbo', name: 'Turbo (Fast)', quality: 'medium' },
];

export const VIDEO_MODELS = [
  { id: 'wan', name: 'WAN 2.6 (Default)', duration: '4-5s' },
  { id: 'wan-audio', name: 'WAN Audio', duration: '4-5s' },
  { id: 'veo', name: 'Google Veo (Premium)', duration: '4-8s' },
];

export const VOICES = [
  'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer',
  'ash', 'ballad', 'coral', 'sage', 'verse',
];
