const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// 🧾 User routes
router.post('/', auth, createOrder);
router.get('/', auth, getOrders);

// 🛡️ Admin routes
router.get('/admin', auth, admin, getAllOrders);
router.put('/:id/status', auth, admin, updateOrderStatus);

module.exports = router;
