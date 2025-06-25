const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const Cart = require('../models/Cart');


// ✅ Create a new order (COD or Stripe)
exports.createOrder = async (req, res) => {
  const { products, total, paymentMethod } = req.body;
  try {
    const order = new Order({
      userId: req.user.id,
      products,
      total,
      paymentMethod: paymentMethod || 'Cash on Delivery',
    });
    await order.save();
    await Cart.deleteMany({ user: req.user.id });

    // 🧠 Send confirmation email
    const user = await User.findById(req.user.id);
    if (user && user.email) {
      const productList = products.map(
        (item) =>
          `<li>${item.product?.brand || 'Product'} × ${item.quantity}</li>`
      ).join('');

      const emailContent = `
        <h2>Thank you for your order!</h2>
        <p>Hi <strong>${user.name || 'Customer'}</strong>,</p>
        <p>Your order has been successfully placed.</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <h4>Ordered Products:</h4>
        <ul>${productList}</ul>
        <p>We’ll notify you when your order is shipped.</p>
        <br/>
        <p>Regards,<br/>Syeed E-commerce Team</p>
      `;

      sendEmail(user.email, '🛒 Order Confirmation...', emailContent)
  .then(() => console.log('✅ Email sent'))
  .catch(err => console.error('❌ Email error:', err));

    }

    res.json(order);
  } catch (err) {
    console.error('❌ Error creating order:', err.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// ✅ Get logged-in user's own orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
};

// ✅ Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'email')
      .populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
};

// ✅ Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = req.body.status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
