# Book Library API - Assignment 3

Full-stack CRUD application with MongoDB for managing a book library.





Database Schema

Book (Primary Object)
Required Fields:
- `title` - Book title (String)
- `author` - Author name (String)
- `isbn` - ISBN number (String, unique)

**Optional Fields:**
- `description`, `genre`, `publishedYear`, `price`, `availableCopies`, `language`, `publisher`
- Auto-generated: `createdAt`, `updatedAt`

Review (Secondary Object)
**Required Fields:**
- `bookId` - Reference to Book (ObjectId)
- `reviewerName` - Reviewer name (String)
- `rating` - 1-5 stars (Number)
- `comment` - Review text (String, 10-500 chars)

**Optional Fields:**
- `verified`, `helpful`
- Auto-generated: `createdAt`, `updatedAt`

API Endpoints

Books

POST   /api/books              Create book
GET    /api/books              Get all books
GET    /api/books/:id          Get single book
PUT    /api/books/:id          Update book
DELETE /api/books/:id          Delete book


Reviews

POST   /api/reviews            Create review
GET    /api/reviews            Get all reviews
GET    /api/reviews/:id        Get single review
PUT    /api/reviews/:id        Update review
DELETE /api/reviews/:id        Delete review


 Test with Postman

Create a Book
json
POST http://localhost:3000/api/books
Content-Type: application/json

{
  "title": "1984",
  "author": "George Orwell",
  "isbn": "9780451524935",
  "genre": "Fiction",
  "price": 14.99,
  "availableCopies": 3
}
```

### Get All Books
```
GET http://localhost:3000/api/books
```

### Update Book
```json
PUT http://localhost:3000/api/books/:id
Content-Type: application/json

{
  "title": "1984",
  "author": "George Orwell",
  "isbn": "9780451524935",
  "price": 18.99,
  "availableCopies": 10
}
```

Delete Book

DELETE http://localhost:3000/api/books/:id


Project Structure

├── server.js              Main server file
├── package.json           Dependencies
├── .env                   Environment variables
├── config/
│   └── database.js        MongoDB connection
├── models/
│   ├── Book.js           Book schema
│   └── Review.js         Review schema
├── routes/
│   ├── books.js          Book endpoints
│   └── reviews.js        Review endpoints
├── middleware/
│   └── validation.js     Validation logic
└── public/
    ├── index.html        Frontend UI
    └── app.js            Frontend JS
```

## ✅ Features Checklist

- ✅ Full CRUD operations for Books
- ✅ Full CRUD operations for Reviews
- ✅ MongoDB integration with Mongoose
- ✅ Complex schemas with validation
- ✅ Relationship management (Book ↔ Reviews)
- ✅ Error handling with proper status codes
- ✅ Input validation (frontend + backend)
- ✅ RESTful API design
- ✅ Frontend interface
- ✅ Timestamps on all objects

## 🎯 Testing

### Required Tests (Demo these)
1. **Create** - POST with valid data → 201 Created
2. **Read All** - GET all books → 200 OK with array
3. **Read One** - GET by ID → 200 OK with object
4. **Update** - PUT with changes → 200 OK with updated data
5. **Delete** - DELETE by ID → 200 OK with confirmation
6. **Validation** - POST missing fields → 400 Bad Request
7. **Not Found** - GET invalid ID → 404 Not Found

### Import Postman Collection
Use `POSTMAN_Collection.json` for complete testing suite.

## 🔧 Troubleshooting

**MongoDB Connection Error:**
- Check MongoDB is running: `mongod` (local) or verify Atlas credentials
- Verify connection string in `.env`

**Port Already in Use:**
- Change PORT in `.env` to 3001 or another available port

**Module Not Found:**
```bash
rm -rf node_modules
npm install
`