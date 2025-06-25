const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  description: String,
  price: Number,
  category: String,
  image: String,

  processor: String,
  ram: String,
  storage: String,
  display: String,
  gpu: String,
  os: String,

  rating: {
  type: Number,
  default: 0,
},
numReviews: {
  type: Number,
  default: 0,
},
reviews: [
  {
    name: String,
    rating: { type: Number, required: true },
    comment: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
],

});


module.exports = mongoose.model('Product', productSchema);
