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
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8 capitalize">{genre} Artists</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {artists.map((artist) => (
          <Link to={`/chat/${artist.name}`} key={artist.id}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
              <img
                className="w-full h-48 object-cover rounded-t-lg"
                src={
                  artist.images[0]
                    ? artist.images[0].url
                    : 'https://via.placeholder.com/300x300.png?text=No+Image'
                }
                alt={artist.name}
              />
              <div className="p-4">
                <p className="text-lg font-semibold">{artist.name}</p>
                <p className="text-sm text-gray-600">Followers: {artist.followers.total.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Popularity: {artist.popularity}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ArtistPage;
