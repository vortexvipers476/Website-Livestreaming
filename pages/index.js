import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [streams, setStreams] = useState([]);
  const [customUrl, setCustomUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load predefined streams
    fetch('/streams.json')
      .then(res => res.json())
      .then(data => setStreams(data.streams))
      .catch(err => console.error('Failed to load streams:', err));
  }, []);

  const handleCustomStream = (e) => {
    e.preventDefault();
    
    if (!customUrl) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(customUrl);
      window.location.href = `/watch?url=${encodeURIComponent(customUrl)}`;
    } catch {
      setError('Invalid URL format');
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background: linear-gradient(-45deg, #111827, #1f2937, #111827, #000000);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          color: #fff;
        }
        
        .gradient-text {
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .glass-effect {
          background: rgba(31, 41, 55, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(75, 85, 99, 0.3);
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .stream-card {
          transition: all 0.3s ease;
        }
        
        .stream-card:hover {
          border-color: rgba(96, 165, 250, 0.5);
          box-shadow: 0 0 15px rgba(96, 165, 250, 0.2);
        }
        
        .btn-primary {
          background: linear-gradient(90deg, #2563eb, #7e22ce);
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: linear-gradient(90deg, #1d4ed8, #6b21a8);
          transform: scale(1.05);
        }
        
        .btn-primary:active {
          transform: scale(0.98);
        }
        
        .logo-gradient {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }
        
        .thumbnail-placeholder {
          background: linear-gradient(45deg, #1e3a8a, #6d28d9);
          position: relative;
          overflow: hidden;
        }
        
        .thumbnail-placeholder::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #60a5fa, #a78bfa, #60a5fa);
          border-radius: 0.5rem;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s ease;
        }
        
        .stream-card:hover .thumbnail-placeholder::before {
          opacity: 0.7;
        }
      `}</style>
      
      <div className="min-h-screen">
        {/* Header with Logo */}
        <header className="py-6 px-8 border-b border-gray-800">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="w-10 h-10 logo-gradient rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold gradient-text">
                StreamHub
              </h1>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Explore</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="py-12 px-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-20">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="block">Stream Your Favorite</span>
                <span className="block gradient-text">Videos Anywhere</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Watch predefined streams or add your own URL. Experience seamless video streaming with our modern platform.
              </p>
              
              {/* Custom Stream Form */}
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleCustomStream} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="Enter video URL (MP4, M3U8, etc.)"
                    className="flex-grow p-4 rounded-xl glass-effect focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="submit"
                    className="btn-primary px-8 py-4 rounded-xl font-medium text-white shadow-lg"
                  >
                    Play Now
                  </button>
                </form>
                {error && <p className="text-red-400 mt-3">{error}</p>}
              </div>
            </section>

            {/* Available Streams Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Featured Streams</h2>
                <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors">
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {streams.map((stream) => (
                  <Link 
                    key={stream.id} 
                    href={`/watch?url=${encodeURIComponent(stream.url)}`}
                    className="group block"
                  >
                    <div className="stream-card glass-effect rounded-2xl overflow-hidden shadow-xl">
                      {/* Video Thumbnail Placeholder */}
                      <div className="h-48 thumbnail-placeholder flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">{stream.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                            Live
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm truncate mb-4">{stream.url}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            1.2K views
                          </div>
                          <button className="text-blue-400 hover:text-blue-300 transition-colors">
                            Watch
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12 px-8 border-t border-gray-800 mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-6 md:mb-0">
                <div className="w-8 h-8 logo-gradient rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">StreamHub</span>
              </div>
              
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="mt-8 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} StreamHub. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
                      }
