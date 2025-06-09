import express from 'express';
import categoryModel from '../models/categoryModel.js';
const CategoryRouter = express.Router();

CategoryRouter.get('/', async (req, res) => {
  try {
    const categories = await categoryModel.find();
    console.log(categories);
    res.json({
      success: true,
      data: categories.map(category => category.toObject())
  });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

CategoryRouter.post('/create', async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    // Create and save new category
    const newCategory = new categoryModel({ name });
    const savedCategory = await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: savedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
});

export default CategoryRouter;
