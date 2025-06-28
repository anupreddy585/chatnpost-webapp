import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './ChatRoom.css';
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const { friendId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [friend, setFriend] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  // Fetch friend's info
  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${friendId}`);
        setFriend(res.data);
      } catch (err) {
        console.error("Failed to fetch friend", err);
      }
    };
    fetchFriend();
  }, [friendId]);

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${currentUser._id}/${friendId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [friendId, currentUser._id]);

  // Socket connection
  useEffect(() => {
    socket.emit("joinRoom", { senderId: currentUser._id, receiverId: friendId });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [friendId, currentUser._id]);

  const handleSend = async () => {
    if (!message.trim()) return; // Prevent sending empty/whitespace-only messages

    const newMsg = {
      senderId: currentUser._id,
      receiverId: friendId,
      text: message.trim(),
    };

    socket.emit("sendMessage", newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/messages", newMsg);
    } catch (err) {
      console.error("Failed to save message", err);
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate(-1)}>&larr;</button>
        <h2 style={{color:"white",outline:"none",border:"none",boxShadow:"none"}}>Chat with {friend?.username || "..."}</h2>
      </div>

      <div className="messages">
        {Array.isArray(messages) && messages.map((msg, index) => (
          <p key={index} className={msg.senderId === currentUser._id ? "you" : ""}>
            <b>{msg.senderId === currentUser._id ? "You" : friend?.username}:</b> {msg.text}
          </p>
        ))}
      </div>

      <div className="input-row">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSend} disabled={!message.trim()}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
