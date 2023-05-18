const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
// The Schema
const orderSchema = new Schema({
    lesseeId: String,
    equipmentId: String,
    fullName: String,
    billingAddress: String,
    city: String,
    state: String,
    zip: String,
    cardHolderName: String,
    cardNumber: String,
    expMonth: String,
    expYear: String,
    cvv: String,
    days: Number,
    total: Number,
  }, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });
  //   defining the model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

module.exports.hashCardInfo = async (info) => {
  try{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(info, salt);
  }
  catch(error) {
    throw new Error("Hashing Not Working", error);
  }
}