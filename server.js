require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Book Library API',
    version: '1.0.0',
    endpoints: {
      books: {
        'GET /api/books': 'Get all books',
        'GET /api/books/:id': 'Get book by ID',
        'POST /api/books': 'Create new book',
        'PUT /api/books/:id': 'Update book',
        'DELETE /api/books/:id': 'Delete book',
        'GET /api/books/stats/summary': 'Get book statistics'
      },
      reviews: {
        'GET /api/reviews': 'Get all reviews',
        'GET /api/reviews/:id': 'Get review by ID',
        'POST /api/reviews': 'Create new review',
        'PUT /api/reviews/:id': 'Update review',
        'DELETE /api/reviews/:id': 'Delete review',
        'GET /api/reviews/book/:bookId/average': 'Get average rating for a book'
      }
    }
  });
});

// Serve static files (frontend)
app.use(express.static('public'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}/index.html`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});