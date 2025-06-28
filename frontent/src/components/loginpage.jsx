import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/loginSlice';
import './loginpage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === '' || password === '') {
      alert("Please enter username and password");
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ username, password }));
      const user = resultAction.payload;
      if (user && user._id) {
        navigate(`/user/${user.username}`);
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className='container'>
      {/* Avatar Icon */}
      <img
        src='https://i.pinimg.com/564x/f8/aa/8d/f8aa8dd95ea6d42633b05c26761df6c4.jpg'
        alt='Avatar'
        className='avatar'
      />
      <h1 className='heading'>Login</h1>
      <input
        className='username'
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='username'
      />
      <input
        className='password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='password'
      />
      <button className='button' type='submit' onClick={handleSubmit}>
        Login
      </button>
      <div>
        <p className='desc'>
          Don't have an account? <a className='link' href='/signup'>Signup</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
