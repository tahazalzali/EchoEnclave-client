import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function ArtistPage() {
  const { genre } = useParams();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const savedArtists = localStorage.getItem(`artists-${genre}`);
    if (savedArtists) {
      setArtists(JSON.parse(savedArtists));
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/spotify/artists/${genre}`)
        .then((response) => {
          setArtists(response.data);
          localStorage.setItem(
            `artists-${genre}`,
            JSON.stringify(response.data)
          );
        })
        .catch((error) => console.error(error));
    }
  }, [genre]);

  return (
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-white capitalize">{`Genre / ${genre}`}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {artists.map((artist) => (
          <Link to={`/chat/${artist.id}`} key={artist.id}>
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow hover:shadow-xl transition cursor-pointer">
              <img
                className="w-full h-48 object-cover"
                src={
                  artist.images[0]
                    ? artist.images[0].url
                    : 'https://via.placeholder.com/300x300.png?text=No+Image'
                }
                alt={artist.name}
              />
              <div className="p-4">
                <p className="text-lg font-semibold text-white">{artist.name}</p>
              <div className="flex justify-between ">
                <p className="text-sm text-gray-400">{artist.followers.total.toLocaleString()} followers</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-m font-bold h-[38px] text-[#69D8F7] w-[45px] text-center px-2 relative rounded bottom-[-15px] bg-[#0D3D45]">
                    {artist.popularity}
                  </span>
                </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ArtistPage;
