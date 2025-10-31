import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import HymnViewer from './pages/HymnViewer';
import DeityNetwork from './pages/DeityNetwork';
import Concordance from './pages/Concordance';
import StudyMode from './pages/StudyMode';
import Onboarding from './components/Onboarding';
import Mandalas from './pages/Mandalas';
import MandalaDetail from './pages/MandalaDetail';
import SplashCursor from './components/SplashCursor'
import BackgroundVideo from './components/BackgroundVideo'
import QuickAccessToolbar from './components/QuickAccessToolbar'
import RecommendationsPanel from './components/RecommendationsPanel'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import { setupScrollReveal } from './utils/scrollAnimations';

function App() {
  const { showOnboarding, setShowOnboarding } = useAppStore();

  useEffect(() => {
    // Setup scroll animations
    setupScrollReveal();
    
    // Re-run on route changes
    const cleanup = () => {
      setTimeout(setupScrollReveal, 100);
    };
    window.addEventListener('popstate', cleanup);
    return () => window.removeEventListener('popstate', cleanup);
  }, []);

  return (
    <Router>
      <div className="min-h-screen text-vedic-light relative">
        {/* Global background video */}
        <BackgroundVideo />
        <SplashCursor />
        {/* Global dark overlay for readability across pages (slightly darker) */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-vedic-deep/98 via-vedic-deep/96 to-vedic-deep/94" />
        <Header />
        
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mandalas" element={<Mandalas />} />
            <Route path="/mandala/:mandalaId" element={<MandalaDetail />} />
            <Route path="/hymn/:hymnId" element={<HymnViewer />} />
            <Route path="/deities" element={<DeityNetwork />} />
            <Route path="/concordance" element={<Concordance />} />
            <Route path="/study" element={<StudyMode />} />
          </Routes>
        </main>

        <QuickAccessToolbar />
        <RecommendationsPanel />
        <KeyboardShortcuts />
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#2C1810',
              color: '#F5F5DC',
              border: '1px solid #D4AF37',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.2)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#2C1810',
              },
            },
            error: {
              iconTheme: {
                primary: '#DC143C',
                secondary: '#F5F5DC',
              },
            },
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
