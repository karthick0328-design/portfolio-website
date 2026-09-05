import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import MouseGlow from './components/ui/MouseGlow';
import AnimatedRoutes from './components/ui/AnimatedRoutes';
import { Toaster } from 'react-hot-toast';
import { VoiceAssistantProvider, VoiceAssistantWidget } from './features/voice';

function App() {
  return (
    <ThemeProvider>
      <VoiceAssistantProvider>
        <Router>
          <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
            <div className="bg-noise" />
            <div className="bg-grid absolute inset-0 z-0 opacity-40 pointer-events-none" />
            <MouseGlow />
            
            <Navbar />
            <ScrollToTop />
            
            <main className="flex-grow relative z-10">
              <AnimatedRoutes />
            </main>
            
            <Footer />
            
            {/* Realistic Human-Like Voice Assistant Widget */}
            <VoiceAssistantWidget />
          </div>
          
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          />
        </Router>
      </VoiceAssistantProvider>
    </ThemeProvider>
  );
}

export default App;
