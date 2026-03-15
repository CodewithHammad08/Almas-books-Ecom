# E-Commerce Project TODO & Integration Guide

I've successfully configured the backend and frontend so they can communicate seamlessly without CORS issues. Here is exactly what I've done:

1. **Backend Configuration:** 
   - I updated the `.env` file to set `CORS_ORIGIN=http://localhost:5173` which allows your React frontend to connect properly while supporting cookies (credentials mode).
2. **Frontend Configuration:**
   - I installed `axios` to handle your API requests easily.
   - I configured Vite's `vite.config.js` with a proxy. Now any request to `/api` in the frontend will automatically be forwarded to your backend at `http://localhost:8000`.
   - I created a centralized API client at `frontend/src/api/axios.js`.

---

## 🚀 Your TODO List for Connecting the Frontend and Backend

Below is your step-by-step guide to integrate everything. Follow these steps to fetch and display data.

### 1. Implement User Authentication (Login / Register)
Use the `api` instance I created to hit your backend authentication routes.

**In `frontend/src/components/Login.jsx` (example):**
```javascript
import React, { useState } from 'react';
import api from '../api/axios'; // Import the pre-configured axios client

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Because of the proxy, we just hit '/api/auth/login'
            const response = await api.post('/auth/login', {
                email,
                password
            });
            console.log("Logged in!", response.data);
            // TODO: Store user info in React state/context or LocalStorage
            // Cookies for tokens are automatically saved!
        } catch (error) {
            console.error("Login Failed:", error.response?.data?.message);
        }
    };

    return (
       // Your brilliant UI goes here...
    );
}
export default Login;
```

### 2. Fetch Products
Fetch the products from your backend Database into your `ProductListing` and `ShopDetail` components.

**In `frontend/src/components/ProductListing.jsx`:**
```javascript
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ProductListing = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Adjust route based on your backend products.routes.js
                const response = await api.get('/products'); 
                setProducts(response.data.data); // Assuming backend sends { data: [...] }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            {/* Map over your 'products' state to render them */}
        </div>
    );
}
export default ProductListing;
```

### 3. Setup Redux or Context API (Highly Recommended)
Since this is an E-Commerce site, you'll want to implement **Zustand**, **Redux**, or **React Context API** to manage:
- The Cart State (How many items the user added)
- The Logged-in User State (Is the user logged in or guest?)

### 4. Setup Print Form
In `frontend/src/components/PrintForm.jsx`, use the `api.post('/print-request', formData)` logic to send print orders straight to your backend, similar to login.

### 5. Final Checks Checklist
- [ ] Connect Register page to `/api/auth/register`
- [ ] Connect Login page to `/api/auth/login`
- [ ] Connect Cart to `/api/cart/...`
- [ ] Start backend server on another terminal: `npm run dev` in `backend`
- [ ] Start frontend server: `npm run dev` in `frontend`

---

## ☁️ MongoDB & Cloudinary Integration Guide

You've successfully hooked up your MongoDB cluster and populated your Cloudinary keys in `.env`. I have officially **seeded the MongoDB database** with standard mocked products so your frontend has items to show immediately upon launching the backend API.

Here is what you need to know to take it into your own hands:

### MongoDB
1. **The Database is Live:** Your React component (`ProductListing.jsx` and `ShoppingPage.jsx`) makes a `GET` request to your backend `/api/products` endpoint. The backend looks into your Mongo Altas Cluster (`almas-books-store`), rips out the seeded items, and sends them to React.
2. **Adding More Things:** If you want to add Users, Orders, Categories, etc., your Express controllers (in `backend/src/controllers/`) use the models defined in `backend/src/models/` to `insert` or `find` on MongoDB.

### Cloudinary (How to Upload Your Real Product Images!)
Right now, the dummy products in MongoDB do not have images attached, so we are defaulting them to a standard graphic (`lib.png`). To upload REAL photos of your products via Cloudinary:
1. **Form setup in React:** In your future "Admin Dashboard" where you add products, ensure you append the image to a `FormData` object.
   ```javascript
   const formData = new FormData();
   formData.append("name", "New Cool Book");
   formData.append("price", 500);
   formData.append("image", fileInput.files[0]); // This is the actual image binary
   api.post("/api/products", formData, { headers: { 'Content-Type': 'multipart/form-data' }})
   ```
2. **Backend Handling:** I see you have `backend/src/utils/cloudinary.js` fully configured! Make sure that your `product.controller.js` logic receives the file using `multer` (the middleware), uploads it to Cloudinary with `await uploadOnCloudinary(localFilePath)`, and grabs the `.url` string it returns.
3. Save that **Cloudinary URL string** directly into your `Product` model on MongoDB under the `image:` property. Now, react will display the global Cloudinary URL seamlessly!

---

### Need Help?
You've got the foundational setup done! Let me know if you want me to write code to connect a specific component right now.
