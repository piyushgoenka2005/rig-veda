import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/appStore';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import HymnViewer from './pages/HymnViewer';
import DeityNetwork from './pages/DeityNetwork';
import ThemeExplorer from './pages/ThemeExplorer';
import Concordance from './pages/Concordance';
import StudyMode from './pages/StudyMode';
import PlaylistBuilder from './pages/PlaylistBuilder';
import Onboarding from './components/Onboarding';

function App() {
  const { showOnboarding, setShowOnboarding } = useAppStore();

  return (
    <Router>
      <div className="min-h-screen bg-vedic-deep text-vedic-light">
        <Header />
        
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hymn/:hymnId" element={<HymnViewer />} />
            <Route path="/deities" element={<DeityNetwork />} />
            <Route path="/themes" element={<ThemeExplorer />} />
            <Route path="/concordance" element={<Concordance />} />
            <Route path="/study" element={<StudyMode />} />
            <Route path="/playlists" element={<PlaylistBuilder />} />
          </Routes>
        </main>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#2C1810',
              color: '#F5F5DC',
              border: '1px solid #D4AF37'
            }
          }}
        />
        
        {showOnboarding && (
          <Onboarding onClose={() => setShowOnboarding(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;
