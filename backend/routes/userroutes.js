import express from 'express';
const router = express.Router();
import User from '../models/user.js';

// Get all users except the current one
router.get('/all/:id', async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // omit sensitive fields
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
