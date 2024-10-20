import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ChatPage() {
  const { artistName } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const userId = getUserId();
  const [charCount, setCharCount] = useState(2000);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to handle feedback
  const handleFeedback = async (index, isHelpful) => {
    setFeedbackGiven({ ...feedbackGiven, [index]: isHelpful });
    const chatMessage = messages[index];
    try {
      await axios.post("/api/chat/feedback", {
        chatId: chatMessage._id,
        feedback: isHelpful ? "helpful" : "not_helpful",
      });
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  useEffect(() => {
    // Fetch artist data
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/spotify/artist/${artistName}`
      )
      .then((response) => {
        setArtistData(response.data);
      })
      .catch((error) => console.error("Error fetching artist data:", error))
      .finally(() => setLoading(false));
  }, [artistName]);

  useEffect(() => {
    // Fetch chat history
    if (!artistData) return;
    let name = artistData?.name;
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/chat/history`, {
        params: { userId, name },
      })
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching chat history:", error));
  }, [artistData, userId]);

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= 2000) {
      setInput(inputText);
      setCharCount(2000 - inputText.length);
    }
  };

  const sendMessage = () => {
    // Send message to the server
    if (input.trim() === "") return;
    let name = artistData?.name;
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        message: input,
        artistName: name,
        userId,
      })
      .then((response) => {
        setMessages([
          ...messages,
          {
            _id: response.data.chatId,
            userId,
            artistName: name,
            message: input,
            reply: response.data.response,
          },
        ]);
        setInput("");
        setCharCount(2000);
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  const handleCopy = (reply) => {
    navigator.clipboard.writeText(reply).then(() => {
      alert("Reply copied to clipboard");
    });
  };

  function handleExplainIt(index) {
    // Implementing the logic to get a detailed explanation
    const message = messages[index];
    let name = artistData?.name;
    try {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat/explain`, {
        message: message.reply,
        artistName: name,
        userId,
      });
    } catch (error) {
      console.error("Error explaining message:", error);
    }

    console.log(`Explain it for message ${index}`);
  }

  const handleRegenerate = async (index) => {
    // Regenerate response
    const msg = messages[index];
    let name = artistData?.name;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat`,
        {
          message: msg.message,
          artistName:name,
          userId,
        }
      );
      // Update the message with the new response
      const updatedMessages = [...messages];
      updatedMessages[index] = { ...msg, reply: response.data.response };
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error regenerating response:", error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      ) : (
        <div className="flex flex-col h-screen bg-black font-sans">
          <header className="bg-black p-6 flex items-start">
            <div className="text-white flex items-center gap-4">
              <img
                className="w-16 h-16 object-contain rounded-2xl pt-2 mr-2"
                src={
                  artistData?.images[0]
                    ? artistData?.images[0]?.url
                    : "https://via.placeholder.com/300x300.png?text=No+Image"
                }
                alt={artistData.name}
              />
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">{artistData.name}</h1>
                  {/* Badge */}
                  <div className="mt-2 pl-3  pb-9 flex justify-between items-center">
                    <span className="text-m font-semibold h-[25px] text-[#69D8F7] w-[45px] text-center px-2 relative rounded bottom-[-15px] bg-[#0D3D45]">
                      {artistData.popularity}
                    </span>
                  </div>
                </div>
                {artistData && (
                  <p className="text-sm text-gray-400">
                    {artistData.followers.total.toLocaleString()} followers
                  </p>
                )}
              </div>
            </div>
          </header>

          <main className="flex-grow p-4 overflow-auto">
            <div className="max-w-2xl mx-auto">
              {messages.map((msg, index) => (
                <div key={index}>
                  {/* User Message */}
                  <div className="flex justify-end mb-2">
                    <div className="bg-[#97E2F7] text-black p-3 rounded-lg max-w-xs">
                      {msg.message}
                    </div>
                  </div>
                  {/* AI Reply */}
                  <div className="flex justify-start mb-2">
                    <div className="bg-white text-black  p-3 rounded-lg max-w-lg relative">
                     <p className="font-bold">{msg.reply}</p>
                      {/* Icons */}
                      <div className="absolute bottom-0 right-0 flex space-x-2 p-1">
                        <button
                          className="text-black hover:text-gray-700"
                          onClick={() => handleCopy(msg.reply)}
                        >
                          📋
                        </button>
                        <button
                          className="text-black hover:text-gray-700"
                          onClick={() => handleRegenerate(index)}
                        >
                          🔄
                        </button>
                      </div>
                      {/* Feedback and Explain It */}
                      <div className="mt-5">
                        <button
                          className="text-white bg-[#187180] rounded-lg text-sm mr-4 px-2 py-1"
                          onClick={() => handleExplainIt(index)}
                        >
                          Explain it
                        </button>
                        <div className="inline-flex items-center text-sm text-gray-600">
                          Was this answer helpful?
                          <button
                            className="ml-2 text-green-500"
                            onClick={() => handleFeedback(index, true)}
                          >
                            👍
                          </button>
                          <button
                            className="ml-1 text-red-500"
                            onClick={() => handleFeedback(index, false)}
                          >
                            👎
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
          <footer className="p-4 bg-black">
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute top-4 left-2 text-white">
                <svg
                  width="24"
                  height="21"
                  viewBox="0 0 24 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.418 15.9247C23.2879 16.243 23.2045 16.5924 23.018 16.8733C22.6398 17.443 22.0612 17.6882 21.3838 17.7028C21.1843 17.7071 20.9847 17.7035 20.7506 17.7035C20.7506 17.7831 20.7506 17.8534 20.7506 17.9237C20.7506 18.4793 20.7471 19.035 20.7521 19.5906C20.7547 19.8847 20.6787 20.1363 20.405 20.2843C20.1245 20.436 19.8616 20.3652 19.6116 20.198C18.424 19.4034 17.2376 18.6071 16.0455 17.8193C15.936 17.7493 15.8092 17.7109 15.6792 17.7084C13.5974 17.7017 11.5156 17.7048 9.43381 17.7031C8.57314 17.7024 7.91302 17.3446 7.5337 16.5597C7.42244 16.3105 7.35593 16.0437 7.33722 15.7714C7.30366 15.4039 7.32082 15.0312 7.33007 14.6611C7.33469 14.6234 7.34693 14.587 7.36603 14.5542C7.38513 14.5214 7.41071 14.4928 7.4412 14.4702C7.78793 14.2298 8.13877 13.9949 8.49659 13.7715C8.58645 13.724 8.68724 13.7012 8.78877 13.7052C10.7594 13.7015 12.7301 13.7064 14.7007 13.7011C16.201 13.697 17.4461 12.8176 17.9025 11.4109C18.0157 11.0438 18.074 10.6619 18.0754 10.2778C18.0949 8.8408 18.0833 7.40339 18.0833 5.96615V5.71266C18.1642 5.70789 18.2285 5.70086 18.2928 5.70081C19.3077 5.70013 20.3227 5.69418 21.3376 5.70225C22.1881 5.70901 22.8343 6.0752 23.2157 6.84875C23.3121 7.04421 23.3521 7.26748 23.418 7.47797L23.418 15.9247Z"
                    fill="#187180"
                  />
                  <path
                    d="M3.32415 12.3667C3.09364 12.3667 2.89441 12.3698 2.69531 12.3662C1.53892 12.3457 0.670324 11.5183 0.663003 10.365C0.646072 7.69807 0.646187 5.03106 0.663348 2.36397C0.671257 1.19173 1.55078 0.368752 2.74189 0.364982C4.46805 0.359519 6.19423 0.363561 7.92039 0.363559C10.1577 0.363555 12.3951 0.363822 14.6324 0.364358C15.4903 0.365264 16.1625 0.71073 16.5343 1.50183C16.6669 1.79012 16.7373 2.10316 16.7408 2.42049C16.7566 5.05039 16.7588 7.68037 16.7475 10.3104C16.7439 11.5173 15.8745 12.3637 14.6549 12.3659C12.625 12.3695 10.5951 12.3689 8.56518 12.3642C8.32046 12.3602 8.08068 12.4332 7.87964 12.5728C6.76301 13.3269 5.64347 14.0767 4.52103 14.8222C4.44884 14.8737 4.37231 14.9188 4.29231 14.957C3.80802 15.1699 3.33673 14.8768 3.32706 14.347C3.31664 13.7767 3.32435 13.2062 3.32416 12.6357C3.32413 12.5553 3.32415 12.475 3.32415 12.3667ZM8.71531 4.36474C7.73013 4.36474 6.74496 4.36475 5.75979 4.36476C5.17461 4.36482 4.58936 4.35944 4.00428 4.3671C3.5325 4.37327 3.26329 4.72428 3.3596 5.18872C3.43127 5.53436 3.65923 5.69783 4.08035 5.69792C7.16179 5.6986 10.2432 5.69862 13.3247 5.69798C13.3913 5.69994 13.458 5.69719 13.5243 5.68974C13.6466 5.67615 13.7617 5.62521 13.854 5.54384C13.9463 5.46247 14.0113 5.35463 14.0402 5.235C14.1623 4.73226 13.8811 4.36691 13.3597 4.36591C11.8116 4.36291 10.2634 4.36252 8.71531 4.36474ZM6.71388 7.03229C5.81773 7.03229 4.92157 7.03007 4.02543 7.03338C3.66649 7.0347 3.43339 7.20801 3.3648 7.50774C3.25125 8.00387 3.52785 8.36261 4.03664 8.36443C5.10312 8.36826 6.16962 8.3657 7.23611 8.36568C7.95451 8.36566 8.67293 8.36815 9.39131 8.36425C9.73578 8.36238 9.96963 8.18939 10.0393 7.90148C10.1609 7.39877 9.87957 7.03538 9.35789 7.03321C8.47657 7.02955 7.59522 7.03221 6.71388 7.03229Z"
                    fill="#187180"
                  />
                </svg>
              </div>
              <textarea
                className="w-full h-24  p-4 pl-10 pr-32 rounded-lg bg-[#97E2F7]  placeholder-black resize-none focus:outline-none"
                value={input}
                onChange={handleInputChange}
                placeholder="Type text, or upload, paste, and drag an image here."
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              {/* Counter and Send Button */}
              <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600">{charCount}</span>
                <button
                  className="bg-[#187180] text-white pl-8 pr-4 py-2 flex rounded-lg hover:bg-gray-300"
                  onClick={sendMessage}
                >
                  Send
                  <svg
                    style={{ position: "absolute", top: 15, left: 45 }}
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.88111 13.5548C8.5262 13.4559 8.34769 13.2089 8.23614 12.8658C7.77988 11.4625 7.30723 10.0645 6.83728 8.66571C6.82234 8.62762 6.81793 8.58623 6.8245 8.54586C6.83108 8.50548 6.84839 8.46762 6.87464 8.43621C7.79607 7.12333 8.71572 5.8092 9.63359 4.49382C9.66681 4.4508 9.69093 4.40148 9.70446 4.34886C9.66921 4.3714 9.63318 4.3928 9.59884 4.41664C8.27796 5.33355 6.9577 6.25135 5.63805 7.17004C5.54268 7.23662 5.46701 7.25239 5.3533 7.21409C3.93111 6.73509 2.50647 6.26336 1.08309 5.78789C0.484504 5.58794 0.314681 4.88272 0.773703 4.4852C0.874803 4.40354 0.9909 4.34237 1.11548 4.30512C2.85859 3.73947 4.6027 3.17688 6.3478 2.61735C8.4045 1.9557 10.4613 1.29428 12.5181 0.633094C12.5287 0.629696 12.5367 0.618391 12.5459 0.610779H12.8239C12.8785 0.630538 12.934 0.64836 12.9877 0.670388C13.2466 0.77663 13.3795 0.986722 13.4558 1.24281V1.49563C13.4364 1.55528 13.4171 1.61494 13.3977 1.6746C12.1993 5.39533 11.0024 9.11653 9.80696 12.8382C9.69499 13.1881 9.52473 13.451 9.15913 13.5548H8.88111Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

function getUserId() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("userId", userId);
  }
  return userId;
}

export default ChatPage;
