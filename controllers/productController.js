const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      category,
      processor,
      ram,
      storage,
      display,
      gpu,
      os,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({
      name,
      brand,
      description,
      price,
      category,
      image: imagePath,
      processor,
      ram,
      storage,
      display,
      gpu,
      os,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Failed to add product:', err);
    res.status(500).json({ message: 'Failed to add product', error: err });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};


exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const alreadyReviewed = product.reviews.find(
  r => r.user && r.user.toString() === req.user._id.toString()
);

  if (alreadyReviewed) {
    return res.status(400).json({ message: 'Product already reviewed' });
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: 'Review added' });
};
