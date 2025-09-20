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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Video Streaming Hub</h1>
          <p className="text-gray-400">Watch predefined streams or add your own URL</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Add Custom Stream</h2>
          <form onSubmit={handleCustomStream} className="flex gap-4">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter video URL (MP4, M3U8, etc.)"
              className="flex-grow p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
            >
              Play
            </button>
          </form>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Available Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <Link 
                key={stream.id} 
                href={`/watch?url=${encodeURIComponent(stream.url)}`}
                className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{stream.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{stream.url}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
                }
