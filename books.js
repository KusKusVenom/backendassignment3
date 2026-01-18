const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { validateBook, validateObjectId } = require('../middleware/validation');

// @route   POST /api/books
// @desc    Create a new book
// @access  Public
router.post('/', validateBook, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    // Handle duplicate ISBN error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A book with this ISBN already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/books
// @desc    Get all books (with optional filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { genre, author, minPrice, maxPrice, available } = req.query;
    let query = {};

    // Build query based on filters
    if (genre) query.genre = genre;
    if (author) query.author = new RegExp(author, 'i'); // Case-insensitive search
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (available === 'true') {
      query.availableCopies = { $gt: 0 };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/books/:id
// @desc    Get a single book by ID
// @access  Public
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book by ID
// @access  Public
router.put('/:id', validateObjectId, validateBook, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run model validators
      }
    );
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    // Handle duplicate ISBN error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A book with this ISBN already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book by ID
// @access  Public
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/books/stats/summary
// @desc    Get statistics about books
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalBooks: { $sum: 1 },
          totalCopies: { $sum: '$availableCopies' },
          avgPrice: { $avg: '$price' },
          genres: { $addToSet: '$genre' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: stats[0] || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;