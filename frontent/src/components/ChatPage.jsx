// ChatPage.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatPage.css';

export default function ChatPage() {
  const [friends, setFriends] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`https://chatnpost-bakend.onrender.com/api/users/all/${currentUser._id}`);
        setFriends(res.data);
      } catch (err) {
        console.error("Failed to load friends", err);
      }
    };

    const fetchUnreadCounts = async () => {
      try {
        const res = await axios.get(`https://chatnpost-bakend.onrender.com/api/messages/unread/${currentUser._id}`);
        setUnreadCounts(res.data); 
      } catch (err) {
        console.error("Failed to fetch unread counts", err);
      }
    };

    fetchFriends();
    fetchUnreadCounts();
  }, [currentUser._id]);

  const getUnreadCount = (friendId) => {
    const match = unreadCounts.find(c => c._id === friendId);
    return match ? match.count : 0;
  };

  return (
    <div className="chat-wrapper">
      <div className="top-bar">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>Chat Page</h1>
      </div>

      <div className="sidebar">
        <h2 style={{color:"white"}}>Friends</h2>
        {friends.map((f) => (
          <div
            key={f._id}
            className="friend"
            onClick={() => navigate(`/user/chat/${f._id}`)}
          >
            {f.username}
            {getUnreadCount(f._id) > 0 && (
              <span className="unread-badge">{getUnreadCount(f._id)}</span>
            )}
          </div>
        ))}
      </div>

      <div className="chat-main">
        <p>Select a friend to start chatting</p>
      </div>
    </div>
  );
}
