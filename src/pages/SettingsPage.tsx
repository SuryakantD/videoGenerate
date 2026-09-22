import { useState, useEffect } from 'react';
import { Key, CheckCircle, XCircle, Loader2, ExternalLink, Info } from 'lucide-react';
import { checkApiHealth } from '../services/pollinations';

export default function SettingsPage() {
  const [apiStatus, setApiStatus] = useState<{ text: boolean; image: boolean } | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    handleCheckHealth();
  }, []);

  const handleCheckHealth = async () => {
    setChecking(true);
    try {
      const status = await checkApiHealth();
      setApiStatus(status);
    } catch {
      setApiStatus({ text: false, image: false });
    }
    setChecking(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-1">AI Provider Configuration & Status</p>
      </div>

      <div className="space-y-6">
        {/* API Status */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Key size={16} className="text-violet-400" />
            AI Provider Status — Pollinations.ai
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            This app uses{' '}
            <a href="https://pollinations.ai" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline inline-flex items-center gap-1">
              Pollinations.ai <ExternalLink size={12} />
            </a>{' '}
            for free AI generation — text, images, and video. No API key required!
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">TXT</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Text Generation</p>
                  <p className="text-gray-500 text-xs">GPT-4o-mini via Pollinations</p>
                </div>
              </div>
              {checking ? (
                <Loader2 size={16} className="text-gray-400 animate-spin" />
              ) : apiStatus?.text ? (
                <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                  <CheckCircle size={14} /> Online
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400 text-xs font-medium">
                  <XCircle size={14} /> Offline
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-violet-400 text-xs font-bold">IMG</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Image Generation</p>
                  <p className="text-gray-500 text-xs">Flux model — Free, no key needed</p>
                </div>
              </div>
              {checking ? (
                <Loader2 size={16} className="text-gray-400 animate-spin" />
              ) : apiStatus?.image ? (
                <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                  <CheckCircle size={14} /> Online
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400 text-xs font-medium">
                  <XCircle size={14} /> Offline
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-fuchsia-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-fuchsia-400 text-xs font-bold">VID</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Video Generation</p>
                  <p className="text-gray-500 text-xs">WAN 2.6 via Pollinations</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
                <CheckCircle size={14} /> Available
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckHealth}
            disabled={checking}
            className="mt-4 px-4 py-2 bg-violet-500/20 text-violet-300 rounded-lg text-sm font-medium hover:bg-violet-500/30 transition-colors border border-violet-500/30"
          >
            {checking ? 'Checking...' : 'Recheck Status'}
          </button>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Info size={16} className="text-violet-400" />
            How It Works — 100% Free
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <p className="text-white text-sm font-medium">🎨 Image Generation</p>
              <p className="text-gray-400 text-xs mt-1">
                Uses Pollinations.ai free API. Images are generated using Flux model. No API key required.
                Direct URL: <code className="text-violet-300">gen.pollinations.ai/image/&#123;prompt&#125;</code>
              </p>
            </div>
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <p className="text-white text-sm font-medium">📝 Story & Characters</p>
              <p className="text-gray-400 text-xs mt-1">
                Uses GPT-4o-mini through Pollinations text API for story creation, character design, and scene planning.
              </p>
            </div>
            <div className="p-3 bg-gray-900/30 rounded-lg">
              <p className="text-white text-sm font-medium">🎬 Video Generation</p>
              <p className="text-gray-400 text-xs mt-1">
                Uses WAN 2.6 model via Pollinations. Each scene image is animated into a video clip.
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-green-500/5 rounded-xl border border-green-500/20 p-6">
          <h3 className="text-green-400 font-semibold mb-2">✅ 100% Free & Open</h3>
          <p className="text-gray-400 text-sm">
            This application uses Pollinations.ai which provides free AI generation.
            No credit card, no subscription, no hidden costs. Generate unlimited videos!
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20">Free Images</span>
            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20">Free Text</span>
            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20">Free Video</span>
            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20">No API Key Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
