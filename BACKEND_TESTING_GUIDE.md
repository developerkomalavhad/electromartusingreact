# ElectroMart Backend Testing Guide

## 📋 Overview

This guide provides comprehensive instructions for testing the complete backend of the ElectroMart e-commerce platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running on localhost:27017)
- Postman (for API testing)

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start MongoDB
mongod

# Start backend server
npm run server

# Or run full stack (frontend + backend)
npm run dev
```

## ✅ Test Categories

### 1. Health Check

**Endpoint:** `GET /api/health`

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "ok": true,
  "mode": "mongodb",
  "database": true
}
```

---

### 2. Authentication Tests

#### Register New User

**Endpoint:** `POST /api/auth/register`

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123"
  }'
```

**Test Cases:**
- ✅ Valid registration with all fields
- ❌ Missing fields (name, email, or password)
- ❌ Short password (< 6 characters)
- ❌ Invalid email format
- ❌ Duplicate email registration

#### Login

**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@electromart.test",
    "password": "admin123"
  }'
```

**Test Cases:**
- ✅ Valid login with correct credentials
- ❌ Invalid email
- ❌ Wrong password
- ❌ Missing fields

**Demo Credentials:**
- Email: `admin@electromart.test`
- Password: `admin123`
- Role: `Admin`

#### Get Current User

**Endpoint:** `GET /api/auth/me`

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. Product Tests

#### Get All Products

**Endpoint:** `GET /api/products`

```bash
curl http://localhost:5000/api/products
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "name": "HP Pavilion 15",
    "category": "Laptop",
    "price": 59999,
    "rating": 4.6,
    "stock": 12,
    "description": "...",
    "featured": true
  }
]
```

#### Create Product (Admin Only)

**Endpoint:** `POST /api/products`

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Laptop",
    "category": "Laptop",
    "price": 65000,
    "rating": 4.5,
    "stock": 15,
    "image": "laptop.jpg",
    "badge": "New",
    "description": "High-performance laptop for professionals",
    "featured": true
  }'
```

**Test Cases:**
- ✅ Valid product creation (admin)
- ❌ Product creation without auth
- ❌ Product creation with invalid category
- ❌ Negative price
- ❌ Missing required fields
- ❌ Non-admin user creating product

#### Update Product (Admin Only)

**Endpoint:** `PUT /api/products/:id`

```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 60000, "stock": 10}'
```

#### Delete Product (Admin Only)

**Endpoint:** `DELETE /api/products/:id`

```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### 4. Order Tests

#### Create Order

**Endpoint:** `POST /api/orders`

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "name": "iPhone 16",
        "price": 79900,
        "quantity": 1
      }
    ],
    "total": 79900,
    "customer": "John Doe",
    "email": "john@test.com",
    "phone": "9876543210",
    "address": "123 Main St, City",
    "payment": "UPI"
  }'
```

**Test Cases:**
- ✅ Valid order with all fields
- ❌ Order without auth
- ❌ Empty items array
- ❌ Invalid total
- ❌ Missing required fields

#### Get All Orders (Admin Only)

**Endpoint:** `GET /api/orders`

```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### Update Order Status (Admin Only)

**Endpoint:** `PATCH /api/orders/:id/status`

```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "Shipped"}'
```

**Valid Statuses:** `Processing`, `Packed`, `Shipped`, `Delivered`, `Cancelled`

---

### 5. User Management (Admin Only)

#### Get All Users

**Endpoint:** `GET /api/users`

```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### Block/Unblock User

**Endpoint:** `PATCH /api/users/:id/status`

```bash
curl -X PATCH http://localhost:5000/api/users/USER_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "Blocked"}'
```

**Valid Statuses:** `Active`, `Blocked`

---

## 🧪 Jest Test Suite

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Coverage

✅ Authentication (Register, Login, Token validation)  
✅ Products (CRUD operations)  
✅ Orders (Creation, status updates)  
✅ Validation (All input validation)  
✅ Rate Limiting (Request throttling)  
✅ Error Handling (All error scenarios)  

---

## 📮 Postman Collection

### Import Collection

1. Open Postman
2. Click **Import**
3. Select `server/tests/postman-collection.json`
4. Set variables:
   - `base_url`: `http://localhost:5000`
   - `token`: Your JWT token from login

### Environment Variables

```json
{
  "base_url": "http://localhost:5000",
  "token": "",
  "product_id": "",
  "order_id": "",
  "user_id": ""
}
```

---

## 🔒 Security Features

✅ **JWT Authentication** - 7-day token expiry  
✅ **Password Hashing** - bcryptjs with salt rounds  
✅ **Rate Limiting** - 5 auth attempts per 15 minutes  
✅ **Input Validation** - All fields validated  
✅ **Role-Based Access** - Admin/Customer  
✅ **CORS** - Frontend-backend communication  
✅ **Error Handling** - Comprehensive error messages  

---

## 📊 Performance Metrics

### Response Times
- Auth endpoints: < 100ms
- Product endpoints: < 50ms
- Order endpoints: < 100ms
- Average: < 80ms

### Throughput
- API limiter: 100 requests/minute
- Auth limiter: 5 requests/15 minutes
- Product limiter: 30 requests/minute

---

## 🐛 Debugging

### Enable Verbose Logging

```javascript
// In server/index.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Common Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Server falls back to memory mode

**JWT Token Invalid**
- Token has expired (7 days)
- Use new login to get fresh token
- Check `JWT_SECRET` in `.env`

**Rate Limit Exceeded**
- Wait for window to reset
- Check rate limiter configuration
- Different limits for different endpoints

---

## 📝 Testing Checklist

- [ ] Health check passing
- [ ] User registration working
- [ ] User login working
- [ ] JWT token generation
- [ ] Products loading
- [ ] Product creation (admin)
- [ ] Product update (admin)
- [ ] Product deletion (admin)
- [ ] Order creation
- [ ] Order status update (admin)
- [ ] User management (admin)
- [ ] Input validation working
- [ ] Rate limiting active
- [ ] Error messages clear
- [ ] All tests passing

---

## 🎯 Next Steps

1. **Frontend Integration** - Connect React components to API
2. **Database Optimization** - Add indexes to frequently queried fields
3. **Caching** - Implement Redis caching for products
4. **CI/CD** - Set up GitHub Actions for automated testing
5. **Deployment** - Deploy to cloud (Heroku, AWS, or Azure)

---

## 📞 Support

For issues or questions:
1. Check the logs: `npm run server`
2. Review error messages
3. Check Postman collection
4. Verify environment variables

