const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Equipment = require('../models/equipment');

// Searching for equipment
router.get('/equipment',(req,res)=>{  
    try {  
    Equipment.find({$and: [{pname: { $regex : new RegExp(req.query.searchBar, "i") }}, {ownerId: { $ne: req.session.userId }}]}, (err,data)=>{  
    if(err){  
    console.log(err);  
    }else{  
        res.render("dashboard", {data: data});
    }  
    }).lean();  
    } catch (error) {  
    console.log(error);  
    }  
    });

    module.exports = router;