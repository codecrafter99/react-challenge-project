const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_item: String,
  quantity: Number,
  orderedBy: String,
}, {
  timestamps: true,
  collection: 'Orders',
});

module.exports = mongoose.model('Order', OrderSchema);