import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const addUsers = createAsyncThunk(
  'user/addUsers',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://chatnpost-bakend.onrender.com/api/users", userData);
      toast.success("User created successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://chatnpost-bakend.onrender.com/api/users/login", userData);
      const user=res.data.user;
      localStorage.setItem("user",JSON.stringify(user));
      toast.success("Login successful");
      return res.data.user;
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
      return rejectWithValue(error.response?.data);
    }
  }
);

const loginSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUsers.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.users = [action.payload]; 
      });
  },
});

export default loginSlice.reducer;
