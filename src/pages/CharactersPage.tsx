import { User, Search } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function CharactersPage() {
  const { state } = useApp();

  const allCharacters = state.projects.flatMap((p) =>
    p.characters.map((c) => ({ ...c, projectName: p.title, projectId: p.id }))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Characters</h1>
          <p className="text-gray-500 mt-1">All AI-generated characters across projects</p>
        </div>
      </div>

      {allCharacters.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
            <User size={32} className="text-gray-600" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">No characters yet</h3>
          <p className="text-gray-500">Characters will appear here after creating a project</p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search characters..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCharacters.map((char) => (
              <div key={char.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center border border-violet-500/20">
                    <User size={20} className="text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{char.name}</h4>
                    <p className="text-gray-500 text-xs">{char.projectName}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-gray-400 text-xs"><span className="text-gray-500">Age:</span> {char.age} • {char.gender} • {char.ethnicity}</p>
                  <p className="text-gray-400 text-xs"><span className="text-gray-500">Hair:</span> {char.hair}</p>
                  <p className="text-gray-400 text-xs"><span className="text-gray-500">Clothing:</span> {char.clothing}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
