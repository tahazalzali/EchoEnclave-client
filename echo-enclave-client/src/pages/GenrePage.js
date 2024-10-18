import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function GenrePage() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const savedGenres = localStorage.getItem('genres');
    if (savedGenres) {
      setGenres(JSON.parse(savedGenres));
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/spotify/genres`)
        .then((response) => {
          setGenres(response.data);
          localStorage.setItem('genres', JSON.stringify(response.data));
        })
        .catch((error) => console.error(error));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pick a Genre</h1>
      <div className="bg-[#363636]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <Link to={`/artists/${genre}`} key={genre}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 text-center cursor-pointer">
              <p className="text-lg font-semibold capitalize">{genre}</p>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
}

export default GenrePage;
