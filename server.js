const express = require('express');
const cors = require('cors'); // ← import cors
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cardRoutes = require('./routes/cardRoutes');
const orderRoutes = require('./routes/orderRoutes');
const connectDB = require('./config/db');
const contactRoute = require('./routes/contact')
// const paymentRoutes = require('./routes/paymentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();

dotenv.config();
connectDB();

const allowedOrigins = [
  'http://localhost:5173', // for local dev
  'https://ai-ecommerce-4a2c6.web.app', // replace with your Firebase hosting URL (if deployed)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy blocked this origin.'), false);
    }
  },
  credentials: true,
}));

app.use(express.json());    

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/contact", contactRoute);
// app.use('/api/payments', paymentRoutes);
app.use('/api/payments', paymentRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
