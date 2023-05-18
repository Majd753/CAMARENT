const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');
const Order = require('../models/order');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


router.post("/checkout", async (req, res) => {
  if(req.session.isAuth){
    const orderObject = {
        lesseeId: req.session.userId,
        fullName: req.body.fullName,
        billingAddress: req.body.billingAddress,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        cardHolderName: req.body.cName, 
        cardNumber: await Order.hashCardInfo(req.body.cNumber),
        expMonth: req.body.expMonth,
        expYear: req.body.expYear,
        cvv: await Order.hashCardInfo(req.body.cvv),
        equipmentId: req.session.eqId,
        days: req.body.totalDays,
        total: req.body.totalPrice
    }

    let equipmentInOrder = await Equipment.findOne({_id: req.session.eqId});
    
    try {
        const newOrder = await new Order(orderObject);
        await newOrder.save();
        User.findOneAndUpdate({_id: req.session.userId}, {$push: {rentedEquipmentsIds: req.session.eqId}}, (err, data) => {
          if(err){  
            console.log(err);  
            }else{  
                console.log("Updated document");
            }
        });
        Equipment.findOneAndUpdate({_id: req.session.eqId}, {$set: {state: "Busy"}}, (err, data) => {
          if(err){  
            console.log(err);  
            }else{  
                console.log("Updated document");
            }
        });

        req.flash('success', req.session.userName + ', Your order number is: ' + newOrder._id + ", you ordered " + equipmentInOrder.pname + ", Please give the order number to the delivery company");
        res.redirect('/users/dashboard');
        } catch(error) {
          next(error);
        }

      }

      else{
        req.flash("error", "You have to login");
        res.redirect("/users/login");
      }

});

module.exports = router;