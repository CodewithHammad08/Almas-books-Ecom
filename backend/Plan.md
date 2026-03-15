# 📚 Almas Bookstore — Backend Development Guide

Backend architecture and database models for the **Almas Books & General Store MERN application**.

This document serves as a **reference while developing the backend**.

---

# 🧱 Tech Stack

```
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Cloudinary (Image Storage)
Multer (File Uploads)
bcrypt (Password Hashing)
```

---

# 📂 Recommended Backend Folder Structure

```
backend
│
├── controllers
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── printController.js
│
├── models
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   ├── Order.js
│   ├── PrintRequest.js
│   ├── Review.js
│
├── routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── printRoutes.js
│
├── middleware
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│
├── config
│   ├── db.js
│
├── utils
│   ├── cloudinary.js
│
├── server.js
└── package.json
```

---

# 🧑 User Model

Used for login, authentication and order tracking.

```javascript
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  address: {
    street: String,
    city: String,
    pincode: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("User", UserSchema);
```

---

# 📦 Product Model

Represents items sold in the store.

```javascript
const ProductSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  description: String,

  price: {
    type: Number,
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },

  image: String,

  stock: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: 0
  },

  reviewsCount: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Product", ProductSchema);
```

---

# 🗂 Category Model

Used for product filtering.

Example categories:

```
Stationery
Books
School Supplies
Art & Craft
Office Items
```

Schema:

```javascript
const CategorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  icon: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Category", CategorySchema);
```

---

# 🛒 Cart Model

Stores products added by a user before checkout.

```javascript
const CartSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      quantity: {
        type: Number,
        default: 1
      }
    }
  ]

});

module.exports = mongoose.model("Cart", CartSchema);
```

---

# 📦 Order Model

Stores completed purchases.

```javascript
const OrderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      quantity: Number,

      price: Number
    }
  ],

  totalPrice: Number,

  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    pincode: String
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Online"]
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", OrderSchema);
```

---

# 🖨 Print Request Model

For the **printing service feature**.

```javascript
const PrintRequestSchema = new mongoose.Schema({

  name: String,

  phone: String,

  fileUrl: String,

  copies: Number,

  printType: {
    type: String,
    enum: ["black-white", "color"]
  },

  notes: String,

  status: {
    type: String,
    enum: ["pending", "printing", "completed"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("PrintRequest", PrintRequestSchema);
```

---

# ⭐ Review Model

Stores product reviews.

```javascript
const ReviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  rating: Number,

  comment: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Review", ReviewSchema);
```

---

# 🔌 API Routes Plan

## Authentication

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
```

---

## Products

```
GET /api/products
GET /api/products/:id
POST /api/products (admin)
PUT /api/products/:id (admin)
DELETE /api/products/:id (admin)
```

---

## Cart

```
GET /api/cart
POST /api/cart/add
DELETE /api/cart/remove
```

---

## Orders

```
POST /api/orders
GET /api/orders
GET /api/orders/:id
```

---

## Print Services

```
POST /api/print-request
GET /api/print-request (admin)
```

---

# ⚙️ Important Features

## Inventory Management

Add `stock` in product model.

When order is placed:

```
product.stock -= quantity
```

---

## Authentication

Use:

```
JWT
bcrypt
```

---

## Image Upload

Use:

```
Cloudinary
Multer
```

for product images.

---

# 🚀 Future Improvements

Possible upgrades for the store:

```
Admin Dashboard
Order Tracking
Online Payments (Razorpay / Stripe)
Product Search
Product Pagination
Wishlist
Discount Coupons
```

---

# ✅ Development Checklist

- [ ] Setup Express Server
- [ ] Connect MongoDB
- [ ] Create Models
- [ ] Implement Auth (JWT)
- [ ] Create Product APIs
- [ ] Implement Cart System
- [ ] Implement Order System
- [ ] Implement Print Request System
- [ ] Upload Images to Cloudinary
- [ ] Add Admin Panel APIs

---

# 🏪 Project Purpose

This backend powers the **Almas Books & General Store website**, allowing customers to:

- Browse stationery products
- Add items to cart
- Place orders
- Submit printing requests
- Contact the shop

---

© 2026 Almas Books & General Store