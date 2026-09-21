import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Sidebar from './components/Sidebar';
import CreatePage from './pages/CreatePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CharactersPage from './pages/CharactersPage';
import AssetsPage from './pages/AssetsPage';
import SettingsPage from './pages/SettingsPage';

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 lg:ml-0 min-h-screen">
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
