const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Reference to the Book
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  
  // Required: Reviewer Name
  reviewerName: {
    type: String,
    required: [true, 'Reviewer name is required'],
    trim: true,
    minlength: [2, 'Reviewer name must be at least 2 characters long']
  },
  
  // Required Field 1: Rating
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5']
  },
  
  // Required Field 2: Comment
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters long'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  
  // Optional fields
  verified: {
    type: Boolean,
    default: false
  },
  
  helpful: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ bookId: 1, createdAt: -1 });

// Static method to get average rating for a book
reviewSchema.statics.getAverageRating = async function(bookId) {
  const result = await this.aggregate([
    { $match: { bookId: mongoose.Types.ObjectId(bookId) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  return result.length > 0 ? result[0] : { avgRating: 0, count: 0 };
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;