// Agnes AI API Service — Free AI Video Generation
// Get your FREE API key at: https://platform.agnes-ai.com
// Docs: https://github.com/lcy362/agnes-video-generator

const AGNES_BASE_URL = 'https://apihub.agnes-ai.com';

// Get API key from localStorage
export function getApiKey(): string {
  return localStorage.getItem('agnes_api_key') || '';
}

export function setApiKey(key: string): void {
  localStorage.setItem('agnes_api_key', key);
}

function authHeaders(): Record<string, string> {
  const key = getApiKey();
  if (!key) throw new Error('API key not set. Get a free key at https://platform.agnes-ai.com');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
  };
}

// ============ TEXT GENERATION (OpenAI-compatible) ============
export async function generateText(
  messages: { role: string; content: string }[],
  options: { model?: string; temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const { model = 'agnes-3.0-flash', temperature = 0.7 } = options;

  const response = await fetch(`${AGNES_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      model,
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Text generation failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ============ IMAGE GENERATION ============
export async function generateImage(
  prompt: string,
  options: {
    model?: string;
    size?: string;
    n?: number;
  } = {}
): Promise<string> {
  const { model = 'agnes-image-2.5-flash', size = '1024x576', n = 1 } = options;

  const response = await fetch(`${AGNES_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      model,
      prompt,
      n,
      size,
      extra_body: {
        response_format: 'url',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Image generation failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const imageUrl = data.data?.[0]?.url || data.data?.[0]?.b64_json;
  if (!imageUrl) throw new Error('No image URL in response');

  // If b64_json, convert to data URL
  if (imageUrl.startsWith('data:') || imageUrl.length > 500) {
    return imageUrl.startsWith('data:') ? imageUrl : `data:image/png;base64,${imageUrl}`;
  }
  return imageUrl;
}

// ============ VIDEO GENERATION ============
export interface VideoTask {
  videoId: string;
  status: string;
  progress: number;
  videoUrl?: string;
}

// Submit a video generation task
export async function submitVideo(
  prompt: string,
  options: {
    model?: string;
    duration?: number;
    aspectRatio?: string;
    referenceImage?: string;
  } = {}
): Promise<string> {
  const {
    model = 'agnes-video-2.5-flash',
    duration = 5,
    aspectRatio = '16:9',
    referenceImage,
  } = options;

  const seconds = String(Math.max(4, Math.min(duration, 12)));

  const payload: Record<string, unknown> = {
    model,
    prompt,
    mode: referenceImage ? 'reference' : 'text',
    seconds,
    size: '720P',
    aspect_ratio: aspectRatio,
  };

  if (referenceImage) {
    payload.images = [referenceImage];
  }

  const response = await fetch(`${AGNES_BASE_URL}/videos`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Video submit failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const videoId = data.video_id || data.task_id || data.id;
  if (!videoId) throw new Error('No video_id in response');
  return videoId;
}

// Poll for video task status
export async function pollVideoStatus(
  videoId: string,
  model: string = 'agnes-video-2.5-flash'
): Promise<VideoTask> {
  const modelParam = `&model_name=${model}`;
  const response = await fetch(
    `${AGNES_BASE_URL}/agnesapi?video_id=${videoId}${modelParam}`,
    { headers: authHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Poll failed (${response.status})`);
  }

  const data = await response.json();
  const status = data.status || '';
  const progress = data.progress || 0;
  const videoUrl = data.video_url || data.url || data.data?.video_url || data.data?.url;

  return {
    videoId,
    status: status.toLowerCase(),
    progress,
    videoUrl,
  };
}

// Wait for video completion with progress callback
export async function waitForVideo(
  videoId: string,
  onProgress?: (status: string, progress: number) => void,
  model: string = 'agnes-video-2.5-flash',
  timeoutMs: number = 600000 // 10 min
): Promise<string> {
  const startTime = Date.now();
  let pollCount = 0;

  while (Date.now() - startTime < timeoutMs) {
    const task = await pollVideoStatus(videoId, model);
    pollCount++;

    if (onProgress) {
      onProgress(task.status, task.progress);
    }

    if (task.status === 'completed' && task.videoUrl) {
      return task.videoUrl;
    }

    if (task.status === 'failed') {
      throw new Error('Video generation failed on server');
    }

    // Adaptive polling: 20s initially, then longer
    const delay = pollCount < 5 ? 20000 : pollCount < 15 ? 30000 : 45000;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error('Video generation timed out');
}

// ============ HEALTH CHECK ============
export async function checkApiHealth(apiKey?: string): Promise<{
  connected: boolean;
  message: string;
}> {
  const key = apiKey || getApiKey();
  if (!key) {
    return { connected: false, message: 'No API key set' };
  }

  try {
    const response = await fetch(`${AGNES_BASE_URL}/v1/models`, {
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { connected: true, message: 'Connected to Agnes AI' };
    }
    return { connected: false, message: `HTTP ${response.status}` };
  } catch (error) {
    return { connected: false, message: 'Connection failed' };
  }
}

export const AGNES_API_SIGNUP_URL = 'https://platform.agnes-ai.com';
export const AGNES_MODELS = {
  text: ['agnes-3.0-flash', 'agnes-2.5-flash'],
  image: ['agnes-image-2.5-flash', 'agnes-image-2.1-flash'],
  video: ['agnes-video-2.5-flash', 'agnes-video-v2.0'],
};
