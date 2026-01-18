const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  // Required: Title/Name
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  // Required Field 1: Author
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    minlength: [1, 'Author name must be at least 1 character long']
  },
  
  // Required Field 2: ISBN
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // ISBN-10 or ISBN-13 format validation
        return /^(?:\d{10}|\d{13})$/.test(v.replace(/-/g, ''));
      },
      message: 'Please provide a valid ISBN (10 or 13 digits)'
    }
  },
  
  // Optional fields
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  publishedYear: {
    type: Number,
    min: [1000, 'Published year must be after 1000'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  
  genre: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 
           'Biography', 'History', 'Self-Help', 'Romance', 'Thriller', 'Other'],
    default: 'Other'
  },
  
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  
  availableCopies: {
    type: Number,
    min: [0, 'Available copies cannot be negative'],
    default: 1
  },
  
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  
  publisher: {
    type: String,
    trim: true
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

// Index for faster queries
bookSchema.index({ title: 1, author: 1 });
bookSchema.index({ isbn: 1 });

// Instance method to check availability
bookSchema.methods.isAvailable = function() {
  return this.availableCopies > 0;
};

// Static method to find books by genre
bookSchema.statics.findByGenre = function(genre) {
  return this.find({ genre: genre });
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;