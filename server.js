const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cardRoutes = require('./routes/cardRoutes');
const orderRoutes = require('./routes/orderRoutes');
const connectDB = require('./config/db');
const contactRoute = require('./routes/contact');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();

dotenv.config();
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://ai-ecommerce-4a2c6.web.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// ✅ Add this line to handle preflight OPTIONS request
app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/contact', contactRoute);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
