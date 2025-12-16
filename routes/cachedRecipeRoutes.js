import express from "express";
import CachedRecipe from "../models/CachedRecipe.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Search recipes from database
router.get("/search", protect, async (req, res) => {
  try {
    const { q, limit = 100 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: "Search query required" });
    }

    const recipes = await CachedRecipe.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(parseInt(limit));

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save recipes to database
router.post("/bulk", protect, async (req, res) => {
  try {
    const { recipes } = req.body;
    
    if (!recipes || !Array.isArray(recipes)) {
      return res.status(400).json({ message: "Recipes array required" });
    }

    const savedRecipes = [];
    for (const recipe of recipes) {
      const existing = await CachedRecipe.findOne({ recipeId: recipe.recipeId });
      if (existing) {
        existing.lastFetched = new Date();
        await existing.save();
        savedRecipes.push(existing);
      } else {
        const newRecipe = await CachedRecipe.create(recipe);
        savedRecipes.push(newRecipe);
      }
    }

    res.json({ saved: savedRecipes.length, recipes: savedRecipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all cached recipes
router.get("/all", protect, async (req, res) => {
  try {
    const { limit = 100, skip = 0 } = req.query;
    const recipes = await CachedRecipe.find()
      .sort({ lastFetched: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await CachedRecipe.countDocuments();
    res.json({ recipes, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recipe stats
router.get("/stats", protect, async (req, res) => {
  try {
    const total = await CachedRecipe.countDocuments();
    const bySource = await CachedRecipe.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } }
    ]);
    
    res.json({ total, bySource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
