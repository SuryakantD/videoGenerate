import { useState } from 'react';
import { generateImageUrl, generateVideoFromImages } from './services/api';

interface Scene {
  id: number;
  description: string;
  imageUrl: string;
}

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const generateVideo = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setScenes([]);
    setVideoUrl('');
    setStatus('Generating scenes...');

    try {
      // Generate 4 scenes based on the prompt
      const sceneDescriptions = [
        `Opening scene: ${prompt}`,
        `Development: ${prompt} continues`,
        `Climax: ${prompt} at its peak`,
        `Conclusion: ${prompt} resolves`
      ];

      const newScenes: Scene[] = [];

      // Generate images for each scene
      for (let i = 0; i < 4; i++) {
        setStatus(`Generating scene ${i + 1} of 4...`);
        const imageUrl = generateImageUrl(sceneDescriptions[i], {
          width: 1024,
          height: 576,
          seed: Date.now() + i
        });

        newScenes.push({
          id: i + 1,
          description: sceneDescriptions[i],
          imageUrl: imageUrl
        });

        setScenes([...newScenes]);
        
        // Wait a bit between generations
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setStatus('Creating video...');

      // Generate video from images
      const imageUrls = newScenes.map(s => s.imageUrl);
      const video = await generateVideoFromImages(imageUrls, {
        durationPerImage: 3,
        transitionDuration: 0.5,
        width: 1024,
        height: 576,
        onProgress: (progress) => {
          setStatus(`Creating video... ${Math.round(progress)}%`);
        }
      });

      setVideoUrl(video);
      setStatus('Complete!');
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `video-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Video Generator
        </h1>

        {/* Input Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            Describe your video:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A luxury airplane flying over Dubai at sunset..."
            className="w-full h-32 bg-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isGenerating}
          />
          
          <button
            onClick={generateVideo}
            disabled={isGenerating || !prompt.trim()}
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            {isGenerating ? 'Generating...' : 'Generate Video'}
          </button>
        </div>

        {/* Status */}
        {status && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <p className="text-center">{status}</p>
          </div>
        )}

        {/* Scenes Preview */}
        {scenes.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Generated Scenes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenes.map((scene) => (
                <div key={scene.id} className="bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={scene.imageUrl}
                    alt={scene.description}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm text-gray-300">
                      Scene {scene.id}: {scene.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video Player */}
        {videoUrl && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Video</h2>
            <video
              src={videoUrl}
              controls
              className="w-full rounded-lg"
              autoPlay
              loop
            />
            <button
              onClick={downloadVideo}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Download Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
