import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'; 
import GenrePage from './pages/GenrePage';
import ArtistPage from './pages/ArtistPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GenrePage />} />
        <Route path="/artists/:genre" element={<ArtistPage />} />
        <Route path="/chat/:artistName" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
