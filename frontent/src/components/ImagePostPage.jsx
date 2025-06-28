import { useEffect, useState } from "react";
import axios from "axios";
import './ImagePostPage.css';
import { useNavigate } from "react-router-dom";

export default function ImagePostPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserPosts, setSelectedUserPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      const others = res.data.filter((u) => u._id !== user._id);
      setUsers(others);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${user._id}`);
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setPosts([]);
    }
  };

  const fetchUserPosts = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${userId}`);
      setSelectedUserPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setSelectedUserPosts([]);
    }
  };

  const handleBack = () => navigate(-1);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("userId", user._id);

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(null);
      fetchPosts();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`);
        fetchPosts();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSave = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `image-${Date.now()}.jpg`;
    link.click();
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserPosts(user._id);
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  return (
    <div className="image-post-page">
      <div className="header-bar">
        <button className="back-btn" onClick={handleBack}>⬅ Back</button>
        <h2>📸 Upload Image Post</h2>
      </div>

      <div className="upload-box">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleUpload} disabled={!image}>Upload</button>
      </div>

      <div className="main-content">
        <div className="users-list">
          <h3>Explore Users</h3>
          {users.map((u) => (
            <div
              key={u._id}
              className={`user-card ${selectedUser?._id === u._id ? "active" : ""}`}
              onClick={() => handleUserClick(u)}
            >
              🧑 {u.username}
            </div>
          ))}
        </div>

        <div className="posts-view">
          <div className="posts-section">
            <h3>Your Posts</h3>
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <img
                  className="image"
                  src={`http://localhost:5000${post.imageUrl}`}
                  alt="Post"
                  onClick={() => setSelectedImage(`http://localhost:5000${post.imageUrl}`)}
                />
                <div className="btn-group">
                  <button className="delete-btn" onClick={() => handleDelete(post._id)}>🗑 Delete</button>
                  <button className="save-btn" onClick={() => handleSave(`http://localhost:5000${post.imageUrl}`)}>💾 Save</button>
                </div>
              </div>
            ))}
          </div>

          {selectedUser && (
            <>
              <div className="close-other-posts-container">
                <button
                  className="close-other-posts-btn"
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedUserPosts([]);
                  }}
                >
                  Close Other User Posts
                </button>
              </div>

              <div className="posts-section">
                <h3>{selectedUser.username}'s Posts</h3>
                {selectedUserPosts.length === 0 && <p>No posts yet.</p>}
                {selectedUserPosts.map((post) => (
                  <div key={post._id} className="post-card">
                    <img
                      className="image"
                      src={`http://localhost:5000${post.imageUrl}`}
                      alt="Post"
                      onClick={() => setSelectedImage(`http://localhost:5000${post.imageUrl}`)}
                    />
                    <div className="btn-group">
                      <button className="save-btn" onClick={() => handleSave(`http://localhost:5000${post.imageUrl}`)}>💾 Save</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Preview" />
            <button className="close-btn" onClick={() => setSelectedImage(null)}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}
