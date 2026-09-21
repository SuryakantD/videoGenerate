import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Sparkles,
  Clock,
  Monitor,
  Palette,
  Zap,
  ArrowRight,
  Film,
  DollarSign,
  User,
  Camera,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { generateProject, estimateCost } from '../utils/generationEngine';
import { VisualStyle, VideoQuality, AspectRatio, Project } from '../types';

const VISUAL_STYLES: VisualStyle[] = [
  'Cinematic',
  'Photorealistic',
  '3D Animation',
  'Pixar-style Animation',
  'Anime',
  'Cartoon',
  'Commercial',
  'Luxury Advertisement',
  'Documentary',
  'Sci-Fi',
  'Fantasy',
];

const ASPECT_RATIOS: AspectRatio[] = ['16:9', '9:16', '1:1'];

export default function CreatePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('Cinematic');
  const [quality, setQuality] = useState<VideoQuality>('High Quality');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const cost = estimateCost(4, quality);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setShowConfirm(true);
  };

  const confirmGenerate = async () => {
    setShowConfirm(false);
    setIsGenerating(true);

    const projectId = uuidv4();
    const now = new Date().toISOString();

    const newProject: Project = {
      id: projectId,
      title: 'Untitled Project',
      originalPrompt: prompt,
      duration: 15,
      aspectRatio,
      visualStyle,
      quality,
      status: 'Draft',
      story: '',
      characters: [],
      locations: [],
      scenes: [],
      musicStyle: 'Cinematic',
      voiceover: '',
      voiceGender: 'Male',
      voiceLanguage: 'English',
      createdAt: now,
      updatedAt: now,
    };

    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject });
    dispatch({ type: 'SET_GENERATING', payload: true });

    navigate(`/project/${projectId}`);

    const updateStep = (stepId: string, status: 'pending' | 'active' | 'completed' | 'failed', progress: number) => {
      dispatch({ type: 'UPDATE_GENERATION_STEP', payload: { stepId, status, progress } });
    };

    try {
      await generateProject(prompt, 15, aspectRatio, visualStyle, quality, dispatch, projectId, updateStep);
    } catch (error) {
      console.error('Generation failed:', error);
      dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id: projectId, status: 'Failed' } });
    }

    setIsGenerating(false);
    dispatch({ type: 'SET_GENERATING', payload: false });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-violet-500/20">
          <Sparkles size={14} />
          AI-Powered Video Generation
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
          Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">15-Second Video</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Describe your video idea and let AI handle the rest — from story and characters to final rendered video.
        </p>
      </div>

      {/* Main Input */}
      <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 p-6 lg:p-8 mb-6 backdrop-blur-sm">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          <Film size={14} className="inline mr-2" />
          Describe the video you want to create
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A luxury Emirates-style airplane flying over Dubai at sunset, with a businessman looking through the airplane window..."
          className="w-full h-32 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none text-base"
        />
        {/* Example prompts */}
        <div className="mt-4">
          <p className="text-gray-500 text-xs mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'A luxury airplane flying over Dubai at sunset',
              'A woman walking through a neon-lit Tokyo street at night',
              'A child discovering a magical forest with glowing butterflies',
              'A sports car driving through a mountain pass at dawn',
            ].map((example) => (
              <button
                key={example}
                onClick={() => setPrompt(example)}
                className="px-3 py-1.5 bg-gray-700/30 text-gray-400 rounded-lg text-xs hover:bg-gray-700/50 hover:text-gray-300 transition-colors border border-gray-700/50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Duration */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
            <Clock size={14} />
            Video Duration
          </label>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 px-3 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-lg text-sm font-medium">
              15 seconds
            </button>
            <button className="flex-1 py-2.5 px-3 bg-gray-700/30 text-gray-500 border border-gray-700 rounded-lg text-sm font-medium cursor-not-allowed" disabled>
              30s (soon)
            </button>
            <button className="flex-1 py-2.5 px-3 bg-gray-700/30 text-gray-500 border border-gray-700 rounded-lg text-sm font-medium cursor-not-allowed" disabled>
              60s (soon)
            </button>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
            <Monitor size={14} />
            Video Format
          </label>
          <div className="flex gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  aspectRatio === ratio
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'bg-gray-700/30 text-gray-400 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Style */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
            <Palette size={14} />
            Visual Style
          </label>
          <select
            value={visualStyle}
            onChange={(e) => setVisualStyle(e.target.value as VisualStyle)}
            className="w-full py-2.5 px-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            {VISUAL_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Quality */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
            <Zap size={14} />
            Video Quality
          </label>
          <div className="flex gap-2">
            {(['Standard', 'High Quality'] as VideoQuality[]).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  quality === q
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'bg-gray-700/30 text-gray-400 border border-gray-700 hover:border-gray-600'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="bg-green-500/5 rounded-xl border border-green-500/20 p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-green-400" />
            <span className="text-gray-300 text-sm">AI Generation Cost (Pollinations.ai):</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-bold text-lg">FREE</span>
          <span className="text-green-500/60 text-xs">∞ unlimited</span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 flex items-center justify-center gap-3"
      >
        <Sparkles size={20} />
        Create My Video
        <ArrowRight size={20} />
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-md w-full">
            <h3 className="text-white text-xl font-bold mb-3">Confirm Generation</h3>
            <p className="text-gray-400 text-sm mb-4">
              This will use Pollinations.ai to generate {cost.images} AI images and {cost.videos} AI video clips.
            </p>
            <div className="bg-gray-900/50 rounded-lg p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">AI Images (Flux):</span>
                <span className="text-white">{cost.images}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">AI Videos (WAN 2.6):</span>
                <span className="text-white">{cost.videos}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">AI Text (GPT-4o-mini):</span>
                <span className="text-white">Story + Characters + Scenes</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
                <span className="text-gray-400">Total cost:</span>
                <span className="text-green-400 font-bold">FREE ✨</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmGenerate}
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-bold hover:from-violet-500 hover:to-fuchsia-500 transition-all"
              >
                Start Generating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <RecentProjectsSection />

      {/* Features */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-5">
          <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center mb-3">
            <User size={18} className="text-violet-400" />
          </div>
          <h4 className="text-white font-semibold text-sm mb-1">Character Consistency</h4>
          <p className="text-gray-500 text-xs">AI maintains consistent character appearance across all scenes using character bibles.</p>
        </div>
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-5">
          <div className="w-10 h-10 bg-fuchsia-500/10 rounded-lg flex items-center justify-center mb-3">
            <Camera size={18} className="text-fuchsia-400" />
          </div>
          <h4 className="text-white font-semibold text-sm mb-1">Smart Storyboarding</h4>
          <p className="text-gray-500 text-xs">Automatically plans scenes with appropriate camera movements and transitions.</p>
        </div>
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-5">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
            <Film size={18} className="text-blue-400" />
          </div>
          <h4 className="text-white font-semibold text-sm mb-1">Full Pipeline</h4>
          <p className="text-gray-500 text-xs">From text to final video — story, characters, images, animation, music, and rendering.</p>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="mt-6 bg-gray-800/30 rounded-2xl border border-gray-700/30 p-6">
        <h3 className="text-white font-semibold text-sm mb-2 text-center">Real AI Generation Pipeline</h3>
        <p className="text-gray-500 text-xs text-center mb-4">Powered by Pollinations.ai — 100% Free</p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {[
            { label: 'Your Idea', color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
            { label: '→' },
            { label: 'GPT-4o-mini', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
            { label: '→' },
            { label: 'Characters', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
            { label: '→' },
            { label: 'Scenes', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
            { label: '→' },
            { label: 'Flux Images', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
            { label: '→' },
            { label: 'WAN Video', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
            { label: '→' },
            { label: 'Final Video', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30' },
          ].map((item, i) =>
            item.color ? (
              <span key={i} className={`px-2.5 py-1 rounded-full border font-medium ${item.color}`}>
                {item.label}
              </span>
            ) : (
              <span key={i} className="text-gray-600">{item.label}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function RecentProjectsSection() {
  const navigate = useNavigate();
  const { state } = useApp();
  const recentProjects = state.projects.slice(0, 3);

  if (recentProjects.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Recent Projects</h3>
        <button
          onClick={() => navigate('/projects')}
          className="text-violet-400 text-xs hover:text-violet-300 transition-colors"
        >
          View All →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recentProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => navigate(`/project/${project.id}`)}
            className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-3 text-left hover:border-gray-600 transition-all group"
          >
            <div className="aspect-video rounded-lg overflow-hidden mb-2 bg-gray-900">
              {project.scenes[0]?.generatedImage ? (
                <img
                  src={project.scenes[0].generatedImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film size={16} className="text-gray-700" />
                </div>
              )}
            </div>
            <p className="text-white text-xs font-medium truncate">{project.title}</p>
            <p className="text-gray-500 text-xs mt-0.5">{project.status} • {project.duration}s</p>
          </button>
        ))}
      </div>
    </div>
  );
}
