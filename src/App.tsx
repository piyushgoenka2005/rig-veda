import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DeityNetwork from './pages/DeityNetwork';
import LandscapePage from './pages/Landscape';
import Onboarding from './components/Onboarding';
import SplashCursor from './components/SplashCursor'
import BackgroundVideo from './components/BackgroundVideo'
import QuickAccessToolbar from './components/QuickAccessToolbar'
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
        <Header />
        
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deities" element={<DeityNetwork />} />
            <Route path="/landscape" element={<LandscapePage />} />
          </Routes>
        </main>

        <QuickAccessToolbar />
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
