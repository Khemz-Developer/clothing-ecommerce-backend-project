# E-Commerce API Documentation

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

## 🚀 Testing API Endpoints

> **⚠️ IMPORTANT:** A Postman collection file is included in the repository!
> 
> **File:** `MERN E-Commerce Backend.postman_collection.json`
>
> ### How to Use:
> 1. Download the Postman collection file from the repository
> 2. Open Postman
> 3. Click **Import** button (top left)
> 4. Select the downloaded `.json` file
> 5. All API endpoints will be imported with example requests
> 6. Update the Bearer tokens in protected routes after login
>
> This is the **easiest way** to test all API endpoints with pre-configured requests!

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Routes

### 1. Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### 2. Login User
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

---

## Product Routes

### 4. Get All Products (with filters)
**GET** `/products`

**Query Parameters:**
- `search` - Search by name/description
- `category` - Filter by category (Men/Women/Kids)
- `size` - Filter by size (S/M/L/XL)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```
GET /products?category=Men&minPrice=50&maxPrice=150&page=1&limit=10
```

---

### 5. Get Single Product
**GET** `/products/:id`

---

### 6. Seed Demo Products
**POST** `/products/seed`

Creates 20 demo products for testing.

---

## Cart Routes

### 7. Get User Cart
**GET** `/cart`

**Headers:** `Authorization: Bearer <token>`


---

### 8. Add Item to Cart
**POST** `/cart`

**Body:**
```json
{
  "productId": "64abc123...",
  "quantity": 2,
  "size": "M",
  "userId": "64abc456..." // optional, for logged-in users
}
```

---

### 9. Update Cart Item Quantity
**PUT** `/cart/:itemId`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "quantity": 3
}
```

---

### 10. Remove Item from Cart
**DELETE** `/cart/:itemId`

**Headers:** `Authorization: Bearer <token>`

---

### 11. Clear Cart
**DELETE** `/cart`

**Headers:** `Authorization: Bearer <token>`

---

## Order Routes

### 12. Create Order (Checkout)
**POST** `/orders`

**Headers:** `Authorization: Bearer <token>`

Creates an order from the user's cart and sends confirmation email.

---

### 13. Get User Orders
**GET** `/orders`

**Headers:** `Authorization: Bearer <token>`

---

### 14. Get Single Order
**GET** `/orders/:id`

**Headers:** `Authorization: Bearer <token>`

---


### Backend Structure
```
ecommerce-backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── models/
│   ├── User.js              # User model schema
│   ├── Product.js           # Product model schema
│   └── Order.js             # Order model schema
├── routes/
│   ├── auth.js              # Authentication routes (login/register)
│   ├── products.js          # Product CRUD routes
│   ├── cart.js              # Cart management routes
│   └── orders.js            # Order management routes
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── utils/
│   └── email.js             # Email service utility
├── .env                     # Environment variables
├── server.js                # Express server entry point
└── package.json             # Backend dependencies
```


### Backend (.env)
```env
PORT=5000

# MongoDB Connection (use local or MongoDB Atlas)
MONGO_URI=mongodb://localhost:27017/ecommerce
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_generated_jwt_secret_key_here
JWT_EXPIRE=30d

# Client URL for CORS
CLIENT_URL=http://localhost:3000

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Your Store Name <your_email@gmail.com>"
```


### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon (development)
```
