import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get favorites
router.get("/", protect, async (req, res) => {
  try {
    res.json({ favorites: req.user.favorites || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add favorite
router.post("/", protect, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
    }
    
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove favorite
router.delete("/:recipeId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(id => id !== req.params.recipeId);
    await user.save();
    
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
