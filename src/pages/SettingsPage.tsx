import { Settings as SettingsIcon, Key, Globe, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your AI providers and preferences</p>
      </div>

      <div className="space-y-6">
        {/* AI Provider Configuration */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Key size={16} className="text-violet-400" />
            AI Provider Configuration
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Configure your AI provider API keys. Keys are stored securely on the backend and never exposed in the frontend.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-gray-400 text-xs">Text Generation Provider</label>
                <input
                  type="password"
                  placeholder="OPENAI_API_KEY"
                  className="w-full mt-1 py-2 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-xs">Image Generation Provider</label>
                <input
                  type="password"
                  placeholder="IMAGE_PROVIDER_API_KEY"
                  className="w-full mt-1 py-2 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-gray-400 text-xs">Video Generation Provider</label>
                <input
                  type="password"
                  placeholder="VIDEO_PROVIDER_API_KEY"
                  className="w-full mt-1 py-2 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-xs">Text-to-Speech Provider</label>
                <input
                  type="password"
                  placeholder="TTS_PROVIDER_API_KEY"
                  className="w-full mt-1 py-2 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-gray-400 text-xs">Music Generation Provider</label>
                <input
                  type="password"
                  placeholder="MUSIC_PROVIDER_API_KEY"
                  className="w-full mt-1 py-2 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-xs">Fallback Image Provider</label>
                <input
                  type="password"
                  placeholder="FALLBACK_IMAGE_API_KEY"
                  className="w-full mt-1 py-2 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Provider Architecture */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Globe size={16} className="text-violet-400" />
            Provider Architecture
          </h3>
          <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-xs text-gray-400">
            <pre>{`AI Provider Abstraction Layer
├── Text Generation    → OpenAI / Anthropic / Gemini
├── Image Generation   → DALL-E / Midjourney / Stable Diffusion
├── Image-to-Video     → Runway / Pika / Kling
├── Text-to-Speech     → ElevenLabs / Azure TTS / Google TTS
├── Music Generation   → Suno / Udio / MusicGen
└── Sound Effects      → ElevenLabs SFX / AudioGen`}</pre>
          </div>
          <p className="text-gray-500 text-xs mt-3">
            Each provider is replaceable. The system uses environment variables for API keys and supports automatic fallback when a provider fails.
          </p>
        </div>

        {/* Security */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Shield size={16} className="text-violet-400" />
            Security Settings
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div>
                <p className="text-white text-sm">Rate Limiting</p>
                <p className="text-gray-500 text-xs">Limit API requests per minute</p>
              </div>
              <span className="text-green-400 text-xs font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div>
                <p className="text-white text-sm">Input Validation</p>
                <p className="text-gray-500 text-xs">Validate all user inputs</p>
              </div>
              <span className="text-green-400 text-xs font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div>
                <p className="text-white text-sm">User Authorization</p>
                <p className="text-gray-500 text-xs">Verify project ownership</p>
              </div>
              <span className="text-green-400 text-xs font-medium">Enabled</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Bell size={16} className="text-violet-400" />
            Notifications
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg cursor-pointer">
              <span className="text-white text-sm">Email on completion</span>
              <input type="checkbox" className="w-4 h-4 accent-violet-500" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg cursor-pointer">
              <span className="text-white text-sm">Error alerts</span>
              <input type="checkbox" className="w-4 h-4 accent-violet-500" defaultChecked />
            </label>
          </div>
        </div>

        <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all">
          Save Settings
        </button>
      </div>
    </div>
  );
}
