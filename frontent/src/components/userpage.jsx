import React from 'react';
import './userpage.css';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handlePosts = () => {
    navigate("/posts");
  };

  return (
    <div className="ig-container">
      <div className="ig-card">
        <div className="ig-header">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.username}&background=random`}
            alt="avatar"
            className="avatar"
          />
          <h2>Hello, <span>{user?.username}</span></h2>
          <p>What would you like to do today?</p>
        </div>
        <div className="ig-buttons">
          <button className="btn btn-chat" onClick={() => navigate('/user/chats')}>Chats</button>
          <button className="btn btn-posts" onClick={handlePosts}>View Posts</button>
          <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
