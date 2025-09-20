import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ url, isLive = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    if (url.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      }
    } else {
      video.src = url;
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      className="w-full max-w-4xl rounded-lg shadow-lg"
      style={{ maxHeight: '70vh' }}
    />
  );
}
