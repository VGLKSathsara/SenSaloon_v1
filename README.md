Here's a comprehensive README.md file for your SenSaloon project:

```markdown
# 💇‍♀️ SenSaloon - Salon Booking Platform

A full-stack salon booking platform with role-based access for customers, stylists, and administrators.

## 🚀 Features

- **User Features**
  - Browse stylists by service type
  - Book appointments with time slot selection
  - View and manage appointments
  - Pay via **PayHere** payment gateway
  - Update profile with image upload

- **Stylist Features**
  - View assigned appointments
  - Mark appointments as completed/cancelled
  - Update availability status
  - View earnings dashboard

- **Admin Features**
  - Add/delete stylists
  - Manage all appointments
  - Toggle stylist availability
  - View dashboard statistics

## 🛠️ Tech Stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| Frontend       | React 18, Vite, TailwindCSS, React Router |
| Backend        | Node.js, Express.js                       |
| Database       | MongoDB (Mongoose)                        |
| Authentication | JWT                                       |
| File Upload    | Cloudinary                                |
| Payments       | **PayHere** (Sri Lankan Payment Gateway)  |

## 📁 Project Structure
```

SenSaloon/
├── frontend/ # Customer/User Frontend
├── admin/ # Admin & Stylist Panel
├── backend/ # Node.js API Server
└── README.md

````

## 🔧 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account
- PayHere merchant account

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/SenSaloon.git
cd SenSaloon
````

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run server
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Update VITE_BACKEND_URL
npm run dev
```

### 4. Admin Panel Setup

```bash
cd admin
npm install
cp .env.example .env
# Update VITE_BACKEND_URL
npm run dev
```

## ⚙️ Environment Variables

### Backend (.env)

```env
# Server
PORT=4000

# JWT
JWT_SECRET=your_jwt_secret

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sensaloon

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# PayHere Payment Gateway
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_SECRET=your_merchant_secret
PAYHERE_APP_ID=your_app_id
PAYHERE_CURRENCY=LKR
PAYHERE_SANDBOX=true
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
```

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=Rs.
```

### Admin Panel (.env)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=Rs.
```

## 🚦 API Endpoints

### User Routes

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| POST   | `/api/user/register`           | User registration        |
| POST   | `/api/user/login`              | User login               |
| GET    | `/api/user/get-profile`        | Get user profile         |
| POST   | `/api/user/update-profile`     | Update profile           |
| POST   | `/api/user/book-appointment`   | Book appointment         |
| GET    | `/api/user/appointments`       | List appointments        |
| POST   | `/api/user/cancel-appointment` | Cancel appointment       |
| POST   | `/api/user/payment-payhere`    | Initiate PayHere payment |
| GET    | `/api/user/verify-payhere`     | Verify payment           |
| POST   | `/api/user/payhere-notify`     | PayHere webhook          |

### Admin Routes

| Method | Endpoint                        | Description        |
| ------ | ------------------------------- | ------------------ |
| POST   | `/api/admin/login`              | Admin login        |
| GET    | `/api/admin/all-stylists`       | Get all stylists   |
| POST   | `/api/admin/add-stylist`        | Add new stylist    |
| POST   | `/api/admin/delete-stylist`     | Delete stylist     |
| GET    | `/api/admin/appointments`       | All appointments   |
| POST   | `/api/admin/cancel-appointment` | Cancel appointment |
| GET    | `/api/admin/dashboard`          | Dashboard stats    |

### Stylist Routes

| Method | Endpoint                            | Description          |
| ------ | ----------------------------------- | -------------------- |
| POST   | `/api/stylist/login`                | Stylist login        |
| GET    | `/api/stylist/appointments`         | Stylist appointments |
| POST   | `/api/stylist/complete-appointment` | Complete appointment |
| POST   | `/api/stylist/cancel-appointment`   | Cancel appointment   |
| GET    | `/api/stylist/profile`              | Get profile          |
| POST   | `/api/stylist/update-profile`       | Update profile       |
| GET    | `/api/stylist/dashboard`            | Dashboard stats      |

## 💳 PayHere Integration

### Payment Flow

1. User clicks "Pay Now" → Backend creates order
2. Redirect to PayHere hosted payment page
3. User enters card details on PayHere (secure)
4. PayHere processes payment and redirects back
5. Webhook confirms payment status

### Test Cards (Sandbox Mode)

| Card Type  | Card Number         | Expiry     | CVV          |
| ---------- | ------------------- | ---------- | ------------ |
| Visa       | 4916 1100 0000 0000 | Any future | Any 3 digits |
| Mastercard | 5213 0000 0000 0000 | Any future | Any 3 digits |

### PayHere Callback URLs

- Success: `{FRONTEND_URL}/verify?status=success&appointmentId={id}`
- Cancel: `{FRONTEND_URL}/verify?status=cancel`
- Notification: `{BACKEND_URL}/api/user/payhere-notify`

## 🧪 Testing

### Test Backend

```bash
# Test Cloudinary
GET http://localhost:4000/test-cloudinary

# Test PayHere Config
GET http://localhost:4000/test-payhere

# Test MongoDB
Check console for "Database Connected" message
```

### Test Payment Flow

1. Login as user
2. Book appointment
3. Go to "My Appointments"
4. Click "Pay Now"
5. Use test card on PayHere sandbox
6. Verify successful payment

## 🔐 Authentication

- **Users**: JWT token stored in localStorage
- **Stylists**: Separate JWT token (`sToken`)
- **Admin**: Separate JWT token (`aToken`)

## 📦 Deployment

### Deploy Backend (Vercel)

```bash
cd backend
npm install
vercel --prod
```

### Deploy Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy dist folder
```

## ⚠️ Common Issues & Solutions

| Issue                    | Solution                                           |
| ------------------------ | -------------------------------------------------- |
| MongoDB connection error | Check MONGODB_URI, whitelist IP in Atlas           |
| Cloudinary upload fails  | Verify API credentials, check folder permissions   |
| PayHere redirect fails   | Ensure FRONTEND_URL is correct, check sandbox mode |
| JWT token invalid        | Check JWT_SECRET matches across deployments        |
| CORS errors              | Verify VITE_BACKEND_URL, check CORS settings       |

## 📝 API Response Format

All endpoints return JSON with this structure:

```json
{
  "success": boolean,
  "message": string,
  "data": object (optional)
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Your Name - [@yourusername](https://github.com/yourusername)

---

## 🆘 Support

- PayHere Support: [https://support.payhere.lk](https://support.payhere.lk)
- Cloudinary Docs: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- MongoDB Docs: [https://docs.mongodb.com](https://docs.mongodb.com)

---

**Made with ❤️ for Sri Lankan Salons**

```

This README includes:
- ✅ Complete project overview
- ✅ Installation instructions
- ✅ All environment variables with examples
- ✅ API endpoints table
- ✅ PayHere integration details
- ✅ Test card information
- ✅ Common issues and solutions
- ✅ Deployment guide
- ✅ Response format documentation

You can customize the author section and add any specific details about your deployment URLs after hosting.
```
