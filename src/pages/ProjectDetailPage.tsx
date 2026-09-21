import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Circle,
  Loader2,
  XCircle,
  Play,
  RotateCcw,
  Edit3,
  Download,
  ArrowLeft,
  User,
  MapPin,
  Camera,
  Clock,
  Music,
  Mic,
  Film,
  Eye,
  RefreshCw,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Scene, Character } from '../types';
import { downloadVideo, downloadImage } from '../services/pollinations';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'story' | 'characters' | 'storyboard' | 'timeline' | 'final'>('story');
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [playingPreview, setPlayingPreview] = useState(false);

  const project = state.projects.find((p) => p.id === id) || state.currentProject;

  useEffect(() => {
    if (!project && id) {
      navigate('/');
    }
  }, [project, id, navigate]);

  if (!project) return null;

  const { generationSteps, isGenerating } = state;

  const tabs = [
    { id: 'story' as const, label: 'Story', icon: Film },
    { id: 'characters' as const, label: 'Characters', icon: User },
    { id: 'storyboard' as const, label: 'Storyboard', icon: Camera },
    { id: 'timeline' as const, label: 'Timeline', icon: Clock },
    { id: 'final' as const, label: 'Final Video', icon: Play },
  ];

  const completedSteps = generationSteps.filter((s) => s.status === 'completed').length;
  const totalSteps = generationSteps.length;
  const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-white">{project.title}</h1>
          <p className="text-gray-500 text-sm">{project.originalPrompt.slice(0, 80)}...</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
          project.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          project.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
          'bg-violet-500/10 text-violet-400 border border-violet-500/20'
        }`}>
          {project.status}
        </div>
      </div>

      {/* Progress Section */}
      {isGenerating && generationSteps.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-violet-400" />
              Generating Your Video
            </h3>
            <span className="text-violet-400 text-sm font-medium">{Math.round(overallProgress)}%</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {generationSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                {step.status === 'completed' && <CheckCircle size={16} className="text-green-400" />}
                {step.status === 'active' && <Loader2 size={16} className="text-violet-400 animate-spin" />}
                {step.status === 'failed' && <XCircle size={16} className="text-red-400" />}
                {step.status === 'pending' && <Circle size={16} className="text-gray-600" />}
                <span className={`text-sm ${
                  step.status === 'completed' ? 'text-green-400' :
                  step.status === 'active' ? 'text-violet-300' :
                  step.status === 'failed' ? 'text-red-400' :
                  'text-gray-600'
                }`}>
                  {step.label}
                </span>
                {step.status === 'active' && step.progress > 0 && (
                  <span className="text-xs text-gray-500 ml-auto">{Math.round(step.progress)}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'story' && (
          <StoryTab project={project} />
        )}
        {activeTab === 'characters' && (
          <CharactersTab characters={project.characters} />
        )}
        {activeTab === 'storyboard' && (
          <StoryboardTab
            scenes={project.scenes}
            selectedScene={selectedScene}
            onSelectScene={setSelectedScene}
            projectId={project.id}
          />
        )}
        {activeTab === 'timeline' && (
          <TimelineTab project={project} />
        )}
        {activeTab === 'final' && (
          <FinalVideoTab project={project} playing={playingPreview} setPlaying={setPlayingPreview} />
        )}
      </div>
    </div>
  );
}

function StoryTab({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Film size={16} className="text-violet-400" />
          Story
        </h3>
        <p className="text-gray-300 leading-relaxed">{project.story || 'Story will be generated...'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <p className="text-gray-500 text-xs mb-1">Duration</p>
          <p className="text-white font-bold text-lg">{project.duration}s</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <p className="text-gray-500 text-xs mb-1">Format</p>
          <p className="text-white font-bold text-lg">{project.aspectRatio}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <p className="text-gray-500 text-xs mb-1">Style</p>
          <p className="text-white font-bold text-lg">{project.visualStyle}</p>
        </div>
      </div>

      {project.locations.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-violet-400" />
            Locations
          </h3>
          <div className="space-y-3">
            {project.locations.map((loc: any) => (
              <div key={loc.id} className="flex items-start gap-3 p-3 bg-gray-900/30 rounded-lg">
                <MapPin size={14} className="text-fuchsia-400 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">{loc.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{loc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CharactersTab({ characters }: { characters: Character[] }) {
  if (characters.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User size={40} className="mx-auto mb-3 opacity-50" />
        <p>Characters will appear here after generation</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {characters.map((char) => (
        <div key={char.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center border border-violet-500/20">
              <User size={24} className="text-violet-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg">{char.name}</h4>
              <p className="text-gray-500 text-sm">{char.age} years old • {char.gender} • {char.ethnicity}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-900/30 rounded-lg p-2">
                <p className="text-gray-500 text-xs">Skin</p>
                <p className="text-gray-300 text-xs">{char.skinTone}</p>
              </div>
              <div className="bg-gray-900/30 rounded-lg p-2">
                <p className="text-gray-500 text-xs">Hair</p>
                <p className="text-gray-300 text-xs">{char.hair}</p>
              </div>
              <div className="bg-gray-900/30 rounded-lg p-2">
                <p className="text-gray-500 text-xs">Eyes</p>
                <p className="text-gray-300 text-xs">{char.eyes}</p>
              </div>
              <div className="bg-gray-900/30 rounded-lg p-2">
                <p className="text-gray-500 text-xs">Body</p>
                <p className="text-gray-300 text-xs">{char.body}</p>
              </div>
            </div>
            <div className="bg-gray-900/30 rounded-lg p-2">
              <p className="text-gray-500 text-xs">Clothing</p>
              <p className="text-gray-300 text-xs">{char.clothing}</p>
            </div>
            <div className="bg-gray-900/30 rounded-lg p-2">
              <p className="text-gray-500 text-xs">Personality</p>
              <p className="text-gray-300 text-xs">{char.personality}</p>
            </div>
          </div>

          {char.referenceImage && (
            <div className="mt-3">
              <img src={char.referenceImage} alt={char.name} className="w-full h-32 object-cover rounded-lg" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StoryboardTab({
  scenes,
  selectedScene,
  onSelectScene,
  projectId,
}: {
  scenes: Scene[];
  selectedScene: Scene | null;
  onSelectScene: (scene: Scene | null) => void;
  projectId: string;
}) {
  const { dispatch } = useApp();

  if (scenes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Camera size={40} className="mx-auto mb-3 opacity-50" />
        <p>Storyboard will appear here after generation</p>
      </div>
    );
  }

  const handleRegenerate = (scene: Scene) => {
    dispatch({
      type: 'UPDATE_SCENE',
      payload: {
        projectId,
        scene: { ...scene, status: 'generating' },
      },
    });
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_SCENE',
        payload: {
          projectId,
          scene: { ...scene, status: 'completed' },
        },
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Scene Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSelectScene(scene)}
            className={`bg-gray-800/50 rounded-xl border overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
              selectedScene?.id === scene.id
                ? 'border-violet-500/50 ring-2 ring-violet-500/20'
                : 'border-gray-700/50 hover:border-gray-600'
            }`}
          >
            <div className="relative aspect-video bg-gray-900">
              {scene.generatedImage ? (
                <img
                  src={scene.generatedImage}
                  alt={`Scene ${scene.sceneNumber}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {scene.status === 'generating' ? (
                    <Loader2 size={24} className="text-violet-400 animate-spin" />
                  ) : (
                    <Camera size={24} className="text-gray-600" />
                  )}
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Scene {scene.sceneNumber}
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                {scene.startTime}s - {scene.startTime + scene.duration}s
              </div>
              {scene.generatedImage && (
                <div className="absolute bottom-2 left-2 bg-black/60 text-green-400 text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-400 rounded-full" />
                  AI
                </div>
              )}
              {scene.status === 'completed' && (
                <div className="absolute bottom-2 right-2">
                  <CheckCircle size={16} className="text-green-400" />
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-white text-xs font-medium line-clamp-2">{scene.description}</p>
              <p className="text-gray-500 text-xs mt-1">{scene.cameraMovement}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scene Detail */}
      {selectedScene && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Scene {selectedScene.sceneNumber} Details</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleRegenerate(selectedScene)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-xs hover:bg-gray-600 transition-colors"
              >
                <RefreshCw size={12} />
                Regenerate
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/20 text-violet-300 rounded-lg text-xs hover:bg-violet-500/30 transition-colors">
                <Edit3 size={12} />
                Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-900/30 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1">Camera</p>
              <p className="text-white text-xs font-medium">{selectedScene.cameraMovement}</p>
            </div>
            <div className="bg-gray-900/30 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1">Angle</p>
              <p className="text-white text-xs font-medium">{selectedScene.cameraAngle}</p>
            </div>
            <div className="bg-gray-900/30 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1">Lighting</p>
              <p className="text-white text-xs font-medium">{selectedScene.lighting}</p>
            </div>
            <div className="bg-gray-900/30 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-1">Emotion</p>
              <p className="text-white text-xs font-medium">{selectedScene.emotion}</p>
            </div>
          </div>

          <div className="mt-3 bg-gray-900/30 rounded-lg p-3">
            <p className="text-gray-500 text-xs mb-1">Image Prompt</p>
            <p className="text-gray-300 text-xs">{selectedScene.imagePrompt}</p>
          </div>

          <div className="mt-2 bg-gray-900/30 rounded-lg p-3">
            <p className="text-gray-500 text-xs mb-1">Video Motion Prompt</p>
            <p className="text-gray-300 text-xs">{selectedScene.videoPrompt}</p>
          </div>

          {/* Video Preview */}
          {selectedScene.generatedVideo && (
            <div className="mt-3 bg-gray-900/30 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                <Film size={12} className="text-fuchsia-400" />
                AI Generated Video Clip
              </p>
              <video
                src={selectedScene.generatedVideo}
                className="w-full rounded-lg"
                controls
                muted
                playsInline
                style={{ maxHeight: '200px' }}
              />
              <p className="text-gray-600 text-xs mt-2">
                Generated by WAN 2.6 via Pollinations.ai
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TimelineTab({ project }: { project: any }) {
  const scenes: Scene[] = project.scenes || [];

  if (scenes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Clock size={40} className="mx-auto mb-3 opacity-50" />
        <p>Timeline will appear after scene generation</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visual Timeline */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4">Video Timeline</h3>
        
        {/* Time markers */}
        <div className="relative mb-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0s</span>
            <span>3s</span>
            <span>7s</span>
            <span>11s</span>
            <span>15s</span>
          </div>
          
          {/* Timeline bar */}
          <div className="h-12 bg-gray-900 rounded-lg overflow-hidden flex">
            {scenes.map((scene, i) => (
              <div
                key={scene.id}
                className="relative border-r border-gray-700 last:border-r-0 flex items-center justify-center"
                style={{ width: `${(scene.duration / 15) * 100}%` }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: scene.generatedImage ? `url(${scene.generatedImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <span className="relative text-xs text-white font-medium">
                  S{scene.sceneNumber}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transition indicators */}
        <div className="flex mt-2">
          {scenes.map((scene, i) => (
            <div
              key={scene.id}
              className="flex items-center justify-center text-xs text-gray-500"
              style={{ width: `${(scene.duration / 15) * 100}%` }}
            >
              {scene.transition}
            </div>
          ))}
        </div>
      </div>

      {/* Audio Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Music size={14} className="text-violet-400" />
            Background Music
          </h4>
          <select className="w-full py-2 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm">
            <option>Cinematic</option>
            <option>Emotional</option>
            <option>Corporate</option>
            <option>Luxury</option>
            <option>Epic</option>
            <option>Suspense</option>
            <option>Happy</option>
            <option>Inspirational</option>
            <option>No Music</option>
          </select>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Mic size={14} className="text-violet-400" />
            Voiceover
          </h4>
          <textarea
            placeholder="Enter voiceover text..."
            className="w-full h-20 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          />
          <div className="flex gap-2 mt-2">
            <select className="flex-1 py-1.5 px-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-xs">
              <option>Male</option>
              <option>Female</option>
            </select>
            <select className="flex-1 py-1.5 px-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-xs">
              <option>English</option>
              <option>Arabic</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scene List */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h4 className="text-white font-semibold mb-3">Scene Details</h4>
        <div className="space-y-2">
          {scenes.map((scene) => (
            <div key={scene.id} className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg">
              <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center text-violet-400 text-xs font-bold">
                {scene.sceneNumber}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{scene.description}</p>
                <p className="text-gray-500 text-xs">{scene.startTime}s - {scene.startTime + scene.duration}s • {scene.duration}s</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Camera size={12} />
                {scene.cameraMovement}
              </div>
              <ChevronRight size={14} className="text-gray-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinalVideoTab({ project, playing, setPlaying }: { project: any; playing: boolean; setPlaying: (v: boolean) => void }) {
  const isCompleted = project.status === 'Completed';
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [videoError, setVideoError] = useState<string | null>(null);

  // Check if we have a combined video or individual scene videos
  const hasCombinedVideo = project.finalVideo;
  const hasSceneVideos = project.scenes?.some((s: Scene) => s.generatedVideo);

  // Debug logging
  useEffect(() => {
    console.log('[FinalVideoTab] Project:', {
      hasCombinedVideo,
      hasSceneVideos,
      finalVideo: project.finalVideo?.substring(0, 50) + '...',
      scenesCount: project.scenes?.length,
      status: project.status,
    });
  }, [project, hasCombinedVideo, hasSceneVideos]);

  useEffect(() => {
    if (!playing || !project.scenes?.length) return;
    
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= project.duration) {
          setPlaying(false);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [playing, project.scenes, project.duration, setPlaying]);

  useEffect(() => {
    if (!project.scenes?.length) return;
    const scene = project.scenes.find(
      (s: Scene) => elapsed >= s.startTime && elapsed < s.startTime + s.duration
    );
    if (scene) {
      setCurrentSceneIndex(scene.sceneNumber - 1);
    }
  }, [elapsed, project.scenes]);

  const handlePlay = () => {
    setElapsed(0);
    setCurrentSceneIndex(0);
    setPlaying(true);
  };

  const handleExportAll = async () => {
    setExporting(true);
    setExportMessage('Preparing downloads...');
    
    try {
      // Download combined video if exists
      if (hasCombinedVideo) {
        setExportMessage('Downloading complete video...');
        await downloadVideo(project.finalVideo, `${project.title}-full-video.webm`);
        await new Promise(r => setTimeout(r, 500));
      }
      
      // Download all scene images
      for (let i = 0; i < project.scenes.length; i++) {
        const scene = project.scenes[i];
        if (scene.generatedImage) {
          setExportMessage(`Downloading scene ${i + 1} image...`);
          await downloadImage(scene.generatedImage, `${project.title}-scene-${i + 1}.png`);
          await new Promise(r => setTimeout(r, 500));
        }
      }
      
      setExportMessage('✅ All files downloaded!');
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportMessage('❌ Export failed. Try right-clicking to save manually.');
      setTimeout(() => setExportMessage(''), 5000);
    }
    
    setExporting(false);
  };

  const handleExportCurrentImage = async () => {
    const scene = project.scenes?.[currentSceneIndex];
    if (scene?.generatedImage) {
      try {
        await downloadImage(scene.generatedImage, `${project.title}-scene-${currentSceneIndex + 1}.png`);
      } catch (error) {
        // Fallback: open in new tab
        window.open(scene.generatedImage, '_blank');
      }
    }
  };

  const handleExportVideo = async () => {
    if (hasCombinedVideo) {
      try {
        await downloadVideo(project.finalVideo, `${project.title}-video.webm`);
      } catch (error) {
        window.open(project.finalVideo, '_blank');
      }
    }
  };

  const currentScene = project.scenes?.[currentSceneIndex];

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="relative bg-black flex items-center justify-center" style={{ aspectRatio: project.aspectRatio === '9:16' ? '9/16' : project.aspectRatio === '1:1' ? '1/1' : '16/9', maxHeight: '500px', margin: '0 auto' }}>
          {isCompleted && project.scenes?.length > 0 ? (
            <>
              {/* Video player - uses combined video or image slideshow */}
              <div className="relative w-full h-full overflow-hidden">
                {hasCombinedVideo ? (
                  // Play the combined video
                  <video
                    key={project.finalVideo}
                    src={project.finalVideo}
                    className="w-full h-full object-cover"
                    autoPlay={playing}
                    muted
                    playsInline
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => {
                      setPlaying(false);
                      setElapsed(0);
                    }}
                    onError={(e) => {
                      console.error('[VideoPlayer] Video error:', e);
                      setVideoError('Video failed to load. Showing slideshow instead.');
                    }}
                  />
                ) : videoError ? (
                  // Show error message and fallback to slideshow
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-4">
                    <Film size={48} className="text-yellow-500 mb-3" />
                    <p className="text-yellow-400 text-sm text-center mb-2">{videoError}</p>
                    {currentScene?.generatedImage && (
                      <img
                        src={currentScene.generatedImage}
                        alt={`Scene ${currentSceneIndex + 1}`}
                        className="max-w-full max-h-[60%] object-contain rounded-lg"
                      />
                    )}
                  </div>
                ) : currentScene?.generatedImage ? (
                  // Fallback to image slideshow
                  <img
                    src={currentScene.generatedImage}
                    alt={`Scene ${currentSceneIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{
                      transform: playing ? 'scale(1.03)' : 'scale(1)',
                      transition: 'transform 8s ease-in-out',
                    }}
                    onError={(e) => {
                      console.error('[ImagePlayer] Image error:', e);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <Film size={48} className="text-gray-600" />
                  </div>
                )}
                
                {/* Scene info overlay */}
                {playing && currentScene && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-sm font-medium">
                      Scene {currentSceneIndex + 1}: {currentScene.description}
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      {currentScene.cameraMovement} • {currentScene.lighting}
                    </p>
                  </div>
                )}
                
                {/* Play overlay */}
                {!playing && elapsed === 0 && !videoError && (
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors"
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-transform">
                      <Play size={28} className="text-white ml-1" />
                    </div>
                  </button>
                )}

                {/* AI Generated badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  AI Generated
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-12">
              <Film size={48} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">Video will be available after rendering completes</p>
              <p className="text-gray-600 text-sm mt-1">Status: {project.status}</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {isCompleted && (
          <div className="px-4 pt-3">
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-100"
                style={{ width: `${(elapsed / project.duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{elapsed.toFixed(1)}s</span>
              <span className="text-xs text-gray-500">{project.duration}s</span>
            </div>
            
            {/* Debug info */}
            {hasCombinedVideo && (
              <div className="mt-2 p-2 bg-gray-900/50 rounded text-xs">
                <p className="text-green-400">✓ Video generated successfully</p>
                <p className="text-gray-500 mt-1">Format: WebM | Duration: {project.duration}s</p>
              </div>
            )}
            {!hasCombinedVideo && !videoError && (
              <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-xs">
                <p className="text-yellow-400">⚠ Video generation skipped or failed</p>
                <p className="text-gray-500 mt-1">Showing scene images as slideshow</p>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        {isCompleted && (
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => playing ? setPlaying(false) : handlePlay()}
                  className="w-10 h-10 bg-violet-500/20 text-violet-400 rounded-full flex items-center justify-center hover:bg-violet-500/30 transition-colors"
                >
                  {playing ? (
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-violet-400 rounded" />
                      <div className="w-1 h-4 bg-violet-400 rounded" />
                    </div>
                  ) : (
                    <Play size={16} className="ml-0.5" />
                  )}
                </button>
                <span className="text-gray-400 text-sm">
                  {playing ? `Playing - Scene ${currentSceneIndex + 1}` : elapsed > 0 ? 'Paused' : 'Ready to play'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{project.duration}s</span>
                <span>•</span>
                <span>{project.aspectRatio}</span>
                <span>•</span>
                <span>{project.visualStyle}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export Message */}
      {exportMessage && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
          <p className="text-white text-sm">{exportMessage}</p>
        </div>
      )}

      {/* Export Buttons */}
      {isCompleted && (
        <div className="space-y-4">
          {/* Scene-specific exports */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-4">
            <h4 className="text-white font-semibold text-sm mb-3">Export Options</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportCurrentImage}
                disabled={!currentScene?.generatedImage}
                className="flex items-center justify-center gap-2 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                Export Scene Image
              </button>
              <button
                onClick={handleExportVideo}
                disabled={!hasCombinedVideo}
                className="flex items-center justify-center gap-2 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                Export Full Video
              </button>
            </div>
          </div>

          {/* Full project export */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 bg-gray-800 text-gray-300 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors text-sm font-medium">
              <RotateCcw size={14} />
              Regenerate
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-gray-800 text-gray-300 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors text-sm font-medium">
              <Edit3 size={14} />
              Edit Project
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-gray-800 text-gray-300 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors text-sm font-medium">
              <Sparkles size={14} />
              New Version
            </button>
            <button
              onClick={handleExportAll}
              disabled={exporting}
              className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold hover:from-violet-500 hover:to-fuchsia-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={14} />
                  Export All
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
