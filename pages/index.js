import { useState } from 'react';
import { useRouter } from 'next/router';
import { createGroup } from '../lib/groups';

export default function Home() {
  const [groupName, setGroupName] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const movies = [
    { id: 'movie1', title: 'Film Aksi', url: '/videos/movie1.mp4' },
    { id: 'movie2', title: 'Film Komedi', url: '/videos/movie2.mp4' },
    { id: 'movie3', title: 'Film Horor', url: '/videos/movie3.mp4' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log("Form submitted:", { groupName, selectedMovie, customUrl });
      
      // Validasi input
      if (!groupName.trim()) {
        throw new Error("Nama grup tidak boleh kosong");
      }
      
      if (!selectedMovie) {
        throw new Error("Pilih film atau masukkan URL kustom");
      }
      
      if (selectedMovie === 'custom' && !customUrl.trim()) {
        throw new Error("URL video tidak boleh kosong");
      }
      
      const movieUrl = selectedMovie === 'custom' ? customUrl : 
                       movies.find(m => m.id === selectedMovie)?.url;
      
      console.log("Movie URL:", movieUrl);
      
      const groupId = await createGroup({
        name: groupName,
        movieUrl,
      });
      
      console.log("Group created with ID:", groupId);
      
      if (!groupId) {
        throw new Error("Gagal membuat grup: ID tidak diterima");
      }
      
      router.push(`/group/${groupId}`);
    } catch (error) {
      console.error("Error creating group:", error);
      setError(error.message || "Gagal membuat grup. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Nonton Film Bareng</h1>
      <p>Buat grup publik untuk nonton film bersama teman-teman!</p>
      
      {error && (
        <div className="error-message" style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}
      
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
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h3>Tips:</h3>
        <ul>
          <li>Pastikan koneksi internet stabil</li>
          <li>Gunakan URL video yang valid (mp4, webm, ogg)</li>
          <li>Untuk video dari YouTube, gunakan format: https://www.youtube.com/watch?v=VIDEO_ID</li>
        </ul>
      </div>
    </div>
  );
        }
