
import express from "express";
const router = express.Router();
import Message from '../models/chatdata.js';

router.get('/:userId/:friendId', async (req, res) => {
  const { userId, friendId } = req.params;

  try {
  
    await Message.updateMany(
      { senderId: friendId, receiverId: userId, read: false },
      { $set: { read: true } }
    );

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    read: false,
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/unread/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const counts = await Message.aggregate([
      { $match: { receiverId: userId, read: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    res.status(200).json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
