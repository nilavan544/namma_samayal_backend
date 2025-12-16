import express from "express";
import Recipe from "../models/Recipe.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all approved recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({ approved: true }).populate("submittedBy", "name");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit new recipe
router.post("/", protect, async (req, res) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      submittedBy: req.user._id,
      approved: req.user.role === "admin"
    });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add rating/review
router.post("/:id/rate", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    
    recipe.ratings.push({ user: req.user._id, rating, comment });
    await recipe.save();
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending recipes (admin only)
router.get("/pending", protect, adminOnly, async (req, res) => {
  try {
    const recipes = await Recipe.find({ approved: false }).populate("submittedBy", "name email");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve recipe (admin only)
router.patch("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete recipe (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
