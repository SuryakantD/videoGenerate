import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Film,
  Clock,
  MoreVertical,
  Trash2,
  Eye,
  Calendar,
  Video,
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Draft': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">My Projects</h1>
          <p className="text-gray-500 mt-1">Manage and review your AI-generated videos</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {state.projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
            <Film size={32} className="text-gray-600" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first AI-generated video to get started</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500/20 text-violet-300 rounded-xl font-medium border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
          >
            <Plus size={16} />
            Create First Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600 transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
                {project.scenes.length > 0 && project.scenes[0].generatedImage ? (
                  <img
                    src={project.scenes[0].generatedImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film size={32} className="text-gray-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-semibold text-sm truncate">{project.title}</h3>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                {project.status === 'Completed' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Eye size={20} className="text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-gray-400 text-xs line-clamp-2 mb-3">{project.originalPrompt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(project.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {project.duration}s
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video size={11} />
                    {project.aspectRatio}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700/50">
                  <button
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-violet-500/10 text-violet-400 rounded-lg text-xs font-medium hover:bg-violet-500/20 transition-colors"
                  >
                    <Eye size={12} />
                    Open
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this project?')) {
                        dispatch({ type: 'DELETE_PROJECT', payload: project.id });
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
