import { useNavigate, useLocation } from 'react-router-dom';
import { Film, FolderOpen, Users, Image, Settings, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Sparkles, label: 'Create' },
    { path: '/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/characters', icon: Users, label: 'Characters' },
    { path: '/assets', icon: Image, label: 'Assets' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2 rounded-lg shadow-lg"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
            <Film size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">AI Video Studio</h1>
            <p className="text-gray-500 text-xs">15-Second Video Generator</p>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive(item.path)
                  ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-lg p-4 border border-violet-500/20 mb-3">
            <p className="text-violet-300 text-xs font-medium">AI Generation Credits</p>
            <p className="text-white text-lg font-bold mt-1">∞ Unlimited</p>
            <p className="text-gray-500 text-xs mt-1">Demo Mode Active</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-xs">AI Video Studio v1.0</p>
            <p className="text-gray-700 text-xs mt-0.5">Powered by Multi-Provider AI</p>
          </div>
        </div>
      </aside>
    </>
  );
}
