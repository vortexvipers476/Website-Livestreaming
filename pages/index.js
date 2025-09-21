import { useState } from 'react';
import { useRouter } from 'next/router';
import { createGroup } from '../lib/groups';

export default function Home() {
  const [groupName, setGroupName] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const movies = [
    { id: 'movie1', title: 'Film Aksi', url: '/videos/movie1.mp4' },
    { id: 'movie2', title: 'Film Komedi', url: '/videos/movie2.mp4' },
    { id: 'movie3', title: 'Film Horor', url: '/videos/movie3.mp4' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const movieUrl = selectedMovie === 'custom' ? customUrl : 
                       movies.find(m => m.id === selectedMovie)?.url;
      
      const groupId = await createGroup({
        name: groupName,
        movieUrl,
      });
      
      router.push(`/group/${groupId}`);
    } catch (error) {
      console.error("Error creating group: ", error);
      alert("Gagal membuat grup: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Nonton Film Bareng</h1>
      <p>Buat grup publik untuk nonton film bersama teman-teman!</p>
      
      <form onSubmit={handleSubmit} className="group-form">
        <div className="form-group">
          <label>Nama Grup:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            placeholder="Contoh: Movie Night 2023"
          />
        </div>
        
        <div className="form-group">
          <label>Pilih Film:</label>
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            required
          >
            <option value="">-- Pilih Film --</option>
            {movies.map(movie => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
            <option value="custom">URL Kustom</option>
          </select>
        </div>
        
        {selectedMovie === 'custom' && (
          <div className="form-group">
            <label>URL Video:</label>
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              required
              placeholder="https://example.com/video.mp4"
            />
          </div>
        )}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Membuat Grup...' : 'Buat Grup Publik'}
        </button>
      </form>
    </div>
  );
        }
