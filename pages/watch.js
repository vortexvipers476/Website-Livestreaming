import { useRouter } from 'next/router';
import VideoPlayer from '../components/VideoPlayer';
import { useState } from 'react';

export default function Watch() {
  const router = useRouter();
  const { url } = router.query;
  const [isValidUrl, setIsValidUrl] = useState(true);

  if (!url) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No URL Provided</h1>
          <a href="/" className="text-blue-400 hover:underline">Go back to home</a>
        </div>
      </div>
    );
  }

  // Validate URL
  try {
    new URL(decodeURIComponent(url));
  } catch {
    setIsValidUrl(false);
  }

  if (!isValidUrl) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Invalid URL</h1>
          <p className="mb-4">The provided URL is not valid</p>
          <a href="/" className="text-blue-400 hover:underline">Go back to home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <a href="/" className="text-blue-400 hover:underline flex items-center gap-2">
            ← Back to streams
          </a>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Now Playing</h1>
          <p className="text-gray-400 break-all">{decodeURIComponent(url)}</p>
        </div>

        <div className="flex justify-center">
          <VideoPlayer url={decodeURIComponent(url)} />
        </div>
      </div>
    </div>
  );
    }
