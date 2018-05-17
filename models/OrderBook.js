const mongoose = require('mongoose');

/**
 * Create order book schema
 */
const orderBookSchema = new mongoose.Schema({
  userId: {type: String },
  size: { type: Number },
  bid: { type: Number }
});

/**
 * Create order book model
 */
const OrderBook = mongoose.model('OrderBook', orderBookSchema);

module.exports = OrderBook;