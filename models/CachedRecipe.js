import mongoose from "mongoose";

const cachedRecipeSchema = new mongoose.Schema({
  recipeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  category: String,
  cuisine: String,
  instructions: String,
  tags: String,
  ingredients: [String],
  measures: [String],
  source: { type: String, enum: ['edamam', 'recipepuppy', 'themealdb'], required: true },
  calories: Number,
  sourceUrl: String,
  lastFetched: { type: Date, default: Date.now }
}, { timestamps: true });

cachedRecipeSchema.index({ name: 'text', category: 'text', cuisine: 'text', tags: 'text' });
cachedRecipeSchema.index({ lastFetched: 1 });

export default mongoose.model("CachedRecipe", cachedRecipeSchema);
