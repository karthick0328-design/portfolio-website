import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import MouseGlow from './components/ui/MouseGlow';
import AnimatedRoutes from './components/ui/AnimatedRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
          <div className="bg-noise" />
          <div className="bg-grid absolute inset-0 z-0 opacity-40 pointer-events-none" />
          <MouseGlow />
          
          <Navbar />
          <ScrollToTop />
          
          <main className="flex-grow relative z-10">
            <AnimatedRoutes />
          </main>
          
          <Footer />
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
    </ThemeProvider>
  );
}

export default App;
