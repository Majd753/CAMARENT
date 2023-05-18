const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// The Schema
const userSchema = new Schema({
  email: String,
  phone: String,
  username: String,
  password: String,
  rentedEquipmentsIds: [String]
}, { 
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});
// Defining Model 
const User = mongoose.model('User', userSchema);
module.exports = User;
module.exports.hashPassword = async (password) => {
  try{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  catch(error) {
    throw new Error("Hashing Not Working", error);
  }
}