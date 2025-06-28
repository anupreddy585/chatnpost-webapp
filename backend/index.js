import express from 'express';
import connectDB from './db.js';
import cors from 'cors';
import User from './models/user.js';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
import postRoutes from './routes/posts.js';
import userroutes from './routes/userroutes.js';
import messagesrouter from './routes/messages.js';
app.use(express.json());
app.use(cors());
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });
});

server.listen(5000, () => console.log('Server listening on port 5000'));


app.post('/api/users', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existed = await User.findOne({ username });
    if (existed) {
      return res.status(400).json({ error: "username already exists" });
    }
    else{
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(200).json(newUser);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});


app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user)
    {
        return res.status(401).json({ error: "Invalid credentials" });
    } 
    else{
    
    if (password!=user.password){
         return res.status(401).json({ error: "Invalid credentials" });
    }
    else {
        res.status(200).json({ user });
    }
}

    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.use("/api/posts", postRoutes);
app.use('/uploads',express.static("uploads"));
app.use('/api/users', userroutes);
app.use('/api/messages',messagesrouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
