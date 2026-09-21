import { useState, useEffect } from 'react';
import { Key, CheckCircle, XCircle, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { checkApiHealth, getApiKey, setApiKey, AGNES_API_SIGNUP_URL } from '../services/agnes';

export default function SettingsPage() {
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [apiStatus, setApiStatus] = useState<{ connected: boolean; message: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (apiKey) {
      handleCheckHealth();
    }
  }, []);

  const handleCheckHealth = async () => {
    setChecking(true);
    try {
      const status = await checkApiHealth(apiKey);
      setApiStatus(status);
    } catch {
      setApiStatus({ connected: false, message: 'Connection failed' });
    }
    setChecking(false);
  };

  const handleSaveKey = async () => {
    setSaving(true);
    setApiKey(apiKey);
    await handleCheckHealth();
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your Agnes AI API key</p>
      </div>

      <div className="space-y-6">
        {/* API Key Configuration */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Key size={16} className="text-violet-400" />
            Agnes AI API Key (Required)
          </h3>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-blue-300 text-sm font-medium mb-1">Get Your FREE API Key</p>
                <p className="text-gray-400 text-xs mb-2">
                  This app uses Agnes AI for video generation. Get a free API key at:
                </p>
                <a
                  href={AGNES_API_SIGNUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm font-medium"
                >
                  {AGNES_API_SIGNUP_URL} <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                placeholder="Enter your Agnes AI API key..."
                className="w-full py-2.5 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveKey}
                disabled={saving || !apiKey}
                className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-lg text-sm font-medium hover:bg-violet-500/30 transition-colors border border-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save & Test'}
              </button>
              
              {apiStatus && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  apiStatus.connected 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {checking ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : apiStatus.connected ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {apiStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4">How It Works</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <p className="text-white text-sm font-medium">📝 Story & Characters</p>
              <p className="text-gray-400 text-xs mt-1">
                Uses Agnes AI's text model (GPT-4 class) to create stories, characters, and scene plans.
              </p>
            </div>
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <p className="text-white text-sm font-medium">🎨 Image Generation</p>
              <p className="text-gray-400 text-xs mt-1">
                Uses Agnes Image 2.5 Flash to generate high-quality scene images from your prompts.
              </p>
            </div>
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <p className="text-white text-sm font-medium">🎬 Video Generation</p>
              <p className="text-gray-400 text-xs mt-1">
                Uses Agnes Video 2.5 Flash to animate each scene image into a 4-5 second video clip.
              </p>
            </div>
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <p className="text-white text-sm font-medium">⚡ Real-Time Progress</p>
              <p className="text-gray-400 text-xs mt-1">
                Video generation takes 2-5 minutes per clip. Progress is shown in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* API Info */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4">API Details</h3>
          <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-xs text-gray-400 overflow-x-auto">
            <pre>{`Agnes AI API (Free)
├── Base URL: https://apihub.agnes-ai.com
├── Text: POST /v1/chat/completions (OpenAI-compatible)
├── Image: POST /images/generations
├── Video: POST /videos (async with polling)
└── Models:
    ├── Text: agnes-3.0-flash, agnes-2.5-flash
    ├── Image: agnes-image-2.5-flash
    └── Video: agnes-video-2.5-flash`}</pre>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-6">
          <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
            <AlertCircle size={16} />
            Important Notes
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Video generation takes 2-5 minutes per scene. Be patient!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Your API key is stored locally in your browser only.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Agnes AI is completely free with generous rate limits.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>For best results, use detailed prompts with specific visual descriptions.</span>
            </li>
          </ul>
        </div>

        {/* Success Message */}
        {apiStatus?.connected && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
            <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
              <CheckCircle size={16} />
              Ready to Create!
            </h3>
            <p className="text-gray-400 text-sm">
              Your API key is working. Go to the Create page to generate your first AI video!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
