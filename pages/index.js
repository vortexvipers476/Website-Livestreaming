import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    className="w-10 h-10"
  >
    <defs>
      <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" stroke="url(#grad1)" strokeWidth="4" />
    <polygon
      points="26,20 46,32 26,44"
      fill="url(#grad1)"
      stroke="url(#grad1)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Home() {
  const [streams, setStreams] = useState([]);
  const [customUrl, setCustomUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load predefined streams
    fetch('/streams.json')
      .then((res) => res.json())
      .then((data) => setStreams(data.streams))
      .catch((err) => console.error('Failed to load streams:', err));
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
      <Head>
        <title>StreamHub - Stream Your Favorite Videos Anywhere</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
            sans-serif;
          background: linear-gradient(-45deg, #111827, #1f2937, #111827, #000000);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          color: #fff;
          margin: 0;
          padding: 0;
          position: relative;
          min-height: 100vh;
        }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          pointer-events: none;
          z-index: 0;
        }

        header {
          position: sticky;
          top: 0;
          background: rgba(31, 41, 55, 0.85);
          backdrop-filter: saturate(180%) blur(10px);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          z-index: 10;
        }

        .btn-primary {
          background: linear-gradient(90deg, #2563eb, #7e22ce);
          box-shadow: 0 4px 15px rgba(126, 34, 206, 0.5);
          transition: all 0.3s ease;
          font-weight: 600;
          color: white;
          border: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: linear-gradient(90deg, #1d4ed8, #6b21a8);
          transform: scale(1.07);
          box-shadow: 0 6px 20px rgba(107, 33, 168, 0.7);
        }

        .btn-primary:active {
          transform: scale(0.97);
        }

        .stream-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          border: 1px solid rgba(75, 85, 99, 0.3);
          background: rgba(31, 41, 55, 0.6);
          backdrop-filter: blur(12px);
          border-radius: 1rem;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 100%;
        }

        .stream-card:hover {
          border-color: #60a5fa;
          box-shadow: 0 10px 30px rgba(96, 165, 250, 0.5);
          transform: translateY(-8px) scale(1.03);
          z-index: 5;
        }

        .thumbnail-placeholder {
          background: linear-gradient(45deg, #1e3a8a, #6d28d9);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thumbnail-placeholder::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #60a5fa, #a78bfa, #60a5fa);
          border-radius: 1rem;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s ease;
        }

        .stream-card:hover .thumbnail-placeholder::before {
          opacity: 0.8;
        }

        input[type='url'] {
          border-radius: 1rem;
          border: 1.5px solid transparent;
          background: rgba(255 255 255 / 0.1);
          color: #fff;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          flex-grow: 1;
        }

        input[type='url']::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        input[type='url']:focus {
          outline: none;
          border-color: #2563eb;
          background: rgba(255 255 255 / 0.15);
          box-shadow: 0 0 8px #2563eb;
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(90deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
        }

        nav ul li a {
          font-weight: 500;
          font-size: 1rem;
        }

        nav ul li a:hover {
          color: #60a5fa;
        }

        /* Scrollbar for streams grid if needed */
        .streams-grid {
          max-height: 70vh;
          overflow-y: auto;
          padding-right: 8px;
        }

        .streams-grid::-webkit-scrollbar {
          width: 8px;
        }

        .streams-grid::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.5);
          border-radius: 4px;
        }
      `}</style>

      <div className="min-h-screen relative z-10 flex flex-col">
        {/* Header */}
        <header className="py-6 px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10">
                <Logo />
              </div>
              <h1 className="text-2xl font-bold gradient-text select-none">
                StreamHub
              </h1>
            </div>
            <nav>
              <ul className="flex space-x-6 text-gray-300">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Explore
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="py-12 px-8 flex-grow">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-20">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="block">Stream Your Favorite</span>
                <span className="block gradient-text">Videos Anywhere</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Watch predefined streams or add your own URL. Experience seamless
                video streaming with our modern platform.
              </p>

              {/* Custom Stream Form */}
              <div className="max-w-2xl mx-auto">
                <form
                  onSubmit={handleCustomStream}
                  className="flex flex-col sm:flex-row gap-4"
                  noValidate
                >
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => {
                      setCustomUrl(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter video URL (MP4, M3U8, etc.)"
                    className="flex-grow p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button type="submit" className="btn-primary px-8 py-4 rounded-xl font-medium shadow-lg">
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 streams-grid">
                {streams.map((stream) => (
                  <Link
                    key={stream.id}
                    href={`/watch?url=${encodeURIComponent(stream.url)}`}
                    className="group block"
                    passHref
                  >
                    <a className="stream-card rounded-2xl overflow-hidden shadow-xl flex flex-col">
                      {/* Video Thumbnail Placeholder */}
                      <div className="thumbnail-placeholder flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                            {stream.title}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 select-none">
                            Live
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm truncate mb-4 flex-grow">{stream.url}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500 select-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            1.2K views
                          </div>
                          <button className="text-blue-400 hover:text-blue-300 transition-colors select-none">
                            Watch
                          </button>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12 px-8 border-t border-gray-800 mt-12 bg-gray-900 bg-opacity-70 backdrop-blur-md">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-6 md:mb-0">
                <div className="w-8 h-8">
                  <Logo />
                </div>
                <span className="text-xl font-bold select-none">StreamHub</span>
              </div>

              <div className="flex space-x-6 text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </div>
            </div>

            <div className="mt-8 text-center text-gray-500 text-sm select-none">
              © {new Date().getFullYear()} StreamHub. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
