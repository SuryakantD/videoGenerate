import { useState } from 'react';

interface Scene {
  id: number;
  prompt: string;
  imageUrl: string;
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateScenes = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setScenes([]);
    setCurrentScene(0);

    // Create 4 scene prompts based on the main prompt
    const scenePrompts = [
      `${prompt}, wide establishing shot, cinematic lighting`,
      `${prompt}, medium shot, detailed view`,
      `${prompt}, close-up, dramatic angle`,
      `${prompt}, final scene, resolution`
    ];

    const newScenes: Scene[] = scenePrompts.map((scenePrompt, index) => ({
      id: index + 1,
      prompt: scenePrompt,
      imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(scenePrompt)}?width=1024&height=576&seed=${Date.now() + index}&nologo=true`
    }));

    setScenes(newScenes);
    setIsGenerating(false);
  };

  const playSlideshow = () => {
    if (scenes.length === 0) return;
    
    setIsPlaying(true);
    setCurrentScene(0);

    let sceneIndex = 0;
    const interval = setInterval(() => {
      sceneIndex++;
      if (sceneIndex >= scenes.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentScene(0);
      } else {
        setCurrentScene(sceneIndex);
      }
    }, 3000); // 3 seconds per scene
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Video Generator
          </h1>
          <p className="text-xl text-gray-300">
            Create stunning videos from text prompts using AI
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <label className="block text-lg font-medium mb-3">
            Describe your video:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A luxury airplane flying over Dubai at sunset..."
            className="w-full h-32 bg-gray-900/50 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={isGenerating}
          />
          
          <button
            onClick={generateScenes}
            disabled={isGenerating || !prompt.trim()}
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:scale-100"
          >
            {isGenerating ? 'Generating...' : 'Generate Scenes'}
          </button>
        </div>

        {/* Scenes Grid */}
        {scenes.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Generated Scenes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenes.map((scene) => (
                <div 
                  key={scene.id} 
                  className={`bg-gray-900/50 rounded-xl overflow-hidden border-2 transition-all ${
                    currentScene === scene.id - 1 && isPlaying 
                      ? 'border-purple-500 scale-105' 
                      : 'border-gray-700'
                  }`}
                >
                  <div className="relative aspect-video bg-gray-900">
                    <img
                      src={scene.imageUrl}
                      alt={scene.prompt}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded-full text-sm font-bold">
                      Scene {scene.id}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {scene.prompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Play Button */}
            <button
              onClick={playSlideshow}
              disabled={isPlaying}
              className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              {isPlaying ? 'Playing...' : 'Play Slideshow'}
            </button>
          </div>
        )}

        {/* Instructions */}
        {scenes.length === 0 && (
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">How to Use</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>Enter a description of the video you want to create</li>
              <li>Click "Generate Scenes" to create 4 AI-generated scenes</li>
              <li>Wait for the images to load (takes 10-30 seconds)</li>
              <li>Click "Play Slideshow" to watch your video</li>
            </ol>
            
            <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
              <p className="text-sm text-purple-300">
                <strong>Example prompts:</strong>
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-400">
                <li>• "A luxury airplane flying over Dubai at sunset"</li>
                <li>• "A woman walking through a neon-lit Tokyo street at night"</li>
                <li>• "A child discovering a magical forest with glowing butterflies"</li>
                <li>• "A sports car driving through a mountain pass at dawn"</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
