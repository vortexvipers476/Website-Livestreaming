import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { getGroup, subscribeToGroup, updateGroupState } from '../../lib/groups';

export default function GroupPage() {
  const router = useRouter();
  const { id } = router.query;
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const unsubscribeRef = useRef(null);

  // Setup real-time subscription
  useEffect(() => {
    if (!id) return;
    
    const fetchAndSubscribe = async () => {
      try {
        // Initial fetch
        const initialGroup = await getGroup(id);
        if (!initialGroup) {
          setError('Grup tidak ditemukan!');
          setLoading(false);
          return;
        }
        
        setGroup(initialGroup);
        setLoading(false);
        
        // Setup real-time listener
        unsubscribeRef.current = subscribeToGroup(id, (updatedGroup) => {
          setGroup(updatedGroup);
          
          // Sync video state
          if (videoRef.current) {
            const video = videoRef.current;
            
            // Sync play/pause state
            if (updatedGroup.isPlaying && video.paused) {
              video.play().catch(e => console.log("Play error:", e));
            } else if (!updatedGroup.isPlaying && !video.paused) {
              video.pause();
            }
            
            // Sync current time (with small tolerance)
            const timeDiff = Math.abs(video.currentTime - updatedGroup.currentTime);
            if (timeDiff > 1) { // If difference is more than 1 second
              video.currentTime = updatedGroup.currentTime;
            }
          }
        });
        
      } catch (err) {
        console.error("Error:", err);
        setError('Terjadi kesalahan: ' + err.message);
        setLoading(false);
      }
    };
    
    fetchAndSubscribe();
    
    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [id]);

  // Video event handlers
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      updateGroupState(id, { isPlaying: true });
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      updateGroupState(id, { isPlaying: false });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && group) {
      const currentTime = videoRef.current.currentTime;
      // Update every 2 seconds to avoid too many writes
      if (Math.abs(currentTime - group.currentTime) > 2) {
        updateGroupState(id, { currentTime });
      }
    }
  };

  const handleSeeked = () => {
    if (videoRef.current) {
      updateGroupState(id, { 
        currentTime: videoRef.current.currentTime 
      });
    }
  };

  if (loading) {
    return <div className="container">Memuat grup...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => router.push('/')}>Kembali ke Beranda</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{group.name}</h1>
      <div className="video-container">
        <video
          ref={videoRef}
          src={group.movieUrl}
          controls
          width="100%"
          height="auto"
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onSeeked={handleSeeked}
        />
      </div>
      
      <div className="controls">
        <button onClick={handlePlay} disabled={group.isPlaying}>
          Play
        </button>
        <button onClick={handlePause} disabled={!group.isPlaying}>
          Pause
        </button>
        <span>Penonton: {group.viewers}</span>
      </div>
      
      <div className="group-info">
        <p>Bagikan URL ini ke teman-teman:</p>
        <div className="url-box">
          <input 
            type="text" 
            value={typeof window !== 'undefined' ? window.location.href : ''} 
            readOnly 
          />
          <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
            Salin URL
          </button>
        </div>
      </div>
    </div>
  );
}
