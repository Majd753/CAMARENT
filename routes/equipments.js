const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');
const User = require('../models/user');


// global.eqId = 0;

router.get('/info',async (req,res)=>{
    req.session.eqId = req.query.equipmentId;
    let equipmentView = await Equipment.findOne({_id: req.session.eqId});
    try {   
        if(equipmentView.state == "Available"){
        Equipment.find({$and: [{_id: req.session.eqId}, {state: "Available"}]}, (err,data)=>{  
        if(err){  
        console.log(err);  
        }else{  
            res.render("equipmentInfo", {data: data});
        }  
        }).lean();
            }
            else{
                // req.flash("error", "The equipment is rented");
                // res.redirect("/users/dashboard");
                res.render("equipmentInfo", {rentedMessage: "The equipment is rented"});
            }  
        } catch (error) {  
        console.log(error);  
        }
    });

    router.get('/remove',(req,res)=>{  
        try {   
            Equipment.deleteOne({_id: req.query.equipmentId}, (err,data)=>{  
            if(err){  
            console.log(err);  
            }else{  
                req.flash('success', 'Equipment Removed Successfully');
                res.redirect("/users/profile");
            }  
            });
            } catch (error) {  
            console.log(error);  
            }
            
        });

module.exports = router;