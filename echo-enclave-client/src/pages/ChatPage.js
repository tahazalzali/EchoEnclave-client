import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ChatPage() {
  const { artistName } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const userId = getUserId();

  useEffect(() => {
    // Fetch chat history
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/chat/history`, { params: { userId, artistName } })
      .then((response) => setMessages(response.data))
      .catch((error) => console.error(error));
  }, [artistName, userId]);

  const sendMessage = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        message: input,
        artistName,
        userId,
      })
      .then((response) => {
        setMessages([...messages, { message: input, reply: response.data.reply }]);
        setInput('');
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
    <header className="bg-white shadow p-4 flex items-center">
      <h1 className="text-2xl font-bold">{artistName}</h1>
    </header>
    <main className="flex-grow p-4 overflow-auto">
      <div className="max-w-2xl mx-auto">
        {messages.map((msg, index) => (
          <div key={index}>
            {/* User Message */}
            <div className="flex justify-end mb-2">
              <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                {msg.message}
              </div>
            </div>
            {/* AI Reply */}
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 p-3 rounded-lg max-w-xs">
                {msg.reply}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
    <footer className="p-4 bg-white">
      <div className="max-w-2xl mx-auto flex">
        <input
          type="text"
          className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the artist..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </footer>
  </div>
  );
}

function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  return userId;
}

export default ChatPage;
