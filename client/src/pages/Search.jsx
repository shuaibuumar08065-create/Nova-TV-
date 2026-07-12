import React, { useState } from 'react';
import { useVideos } from '../hooks/useVideos';
import VideoCard from '../components/VideoCard';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchVideos } = useVideos();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetchVideos({ search: query });
      setResults(res);
    } catch (err) {
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Search Videos</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter title or description..."
          className="flex-1 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
      </form>
      {loading && <p>Searching...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map(video => <VideoCard key={video.id} video={video} />)}
      </div>
      {results.length === 0 && !loading && query && <p>No results.</p>}
    </div>
  );
}

export default Search;
