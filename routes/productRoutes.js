const express = require('express');
const router = express.Router();
const { addProduct, getProducts, updateProduct, deleteProduct, getProductById } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // ✅ fixed path
const admin = require('../middleware/adminMiddleware');
const { createProductReview } = require('../controllers/productController');
const multer = require('multer');

// Add product with image upload
router.post('/', auth, admin, upload.single('image'), addProduct);

// Get all products (public)

router.get('/', getProducts);

// Update and delete product
router.put('/:id', upload.single('image'), auth, admin, updateProduct);
router.delete('/:id', auth, admin, deleteProduct);
router.get('/:id', getProductById);
router.post('/:id/reviews', auth, createProductReview);

module.exports = router;
