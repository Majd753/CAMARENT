const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// The Schema
const equipmentSchema = new Schema({
  pic:
    {
        data: Buffer,
        contentType: String
    },  
    pname: String,
    desc: String,
    price: Number,
    insurance: Number,
    location: String,
    tag: String,
    ownerId: String,
    delivery: String,
    state: String
  }, {
    // 3 
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });
//   defining the model
const Equipment = mongoose.model("Equipment", equipmentSchema);
module.exports = Equipment;