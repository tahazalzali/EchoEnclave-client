import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function GenrePage() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch genres from the server or local storage (caching mechanism)
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className=" bg-[#363636] p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Pick your genre</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <Link to={`/artists/${genre}`} key={genre}>
            <div className="bg-[#0D3D45] rounded-lg shadow hover:shadow-lg  hover:text-[#0D3D45] transition p-4 text-center cursor-pointer border border-[#69D8F7] hover:bg-[#69D8F7]">
            <p className="text-lg font-semibold capitalize text-[#69D8F7] hover:text-[#0D3D45]">{genre}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
  
}

export default GenrePage;
