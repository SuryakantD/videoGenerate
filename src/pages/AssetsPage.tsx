import { Image, Film, Music, FileText } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function AssetsPage() {
  const { state } = useApp();

  const allAssets = state.projects.flatMap((p) => [
    ...p.scenes.map((s) => ({
      type: 'image' as const,
      url: s.generatedImage,
      label: `Scene ${s.sceneNumber} - ${p.title}`,
      projectId: p.id,
    })),
  ]).filter((a) => a.url);

  const imageCount = allAssets.filter((a) => a.type === 'image').length;
  const videoCount = state.projects.filter((p) => p.status === 'Completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Assets</h1>
        <p className="text-gray-500 mt-1">All generated images, videos, and audio files</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image size={14} className="text-violet-400" />
            <span className="text-gray-500 text-xs">Images</span>
          </div>
          <p className="text-white text-2xl font-bold">{imageCount}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Film size={14} className="text-fuchsia-400" />
            <span className="text-gray-500 text-xs">Videos</span>
          </div>
          <p className="text-white text-2xl font-bold">{videoCount}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Music size={14} className="text-blue-400" />
            <span className="text-gray-500 text-xs">Audio</span>
          </div>
          <p className="text-white text-2xl font-bold">0</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-green-400" />
            <span className="text-gray-500 text-xs">Total Assets</span>
          </div>
          <p className="text-white text-2xl font-bold">{imageCount + videoCount}</p>
        </div>
      </div>

      {/* Assets Grid */}
      {allAssets.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
            <Image size={32} className="text-gray-600" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">No assets yet</h3>
          <p className="text-gray-500">Generated images and videos will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allAssets.map((asset, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden group">
              <div className="aspect-video relative">
                <img
                  src={asset.url}
                  alt={asset.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-white text-xs font-medium truncate">{asset.label}</p>
                <p className="text-gray-500 text-xs mt-0.5 capitalize">{asset.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
