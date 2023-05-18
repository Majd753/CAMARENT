const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');


router.get('/', (req, res) => {
    res.redirect('/users/dashboard');
});
router.get('/users/dashboard', (req, res) => {
    if(req.session.isAuth == undefined) {
    try {  
        Equipment.find((err,data)=>{  
        if(err){  
        console.log(err);  
        }else{  
            res.render("dashboard", {data: data});
        }  
        }).lean();  
        } catch (error) {  
        console.log(error);  
        }
    }
    else {
        try {  
            Equipment.find({ownerId: { $ne: req.session.userId }}, (err,data)=>{  
            if(err){  
            console.log(err);  
            }else{  
                res.render("dashboard", {data: data});
            }  
            }).lean();  
            } catch (error) {  
            console.log(error);  
            }
    }
});

router.get('/users/dashboard/lowest', (req, res) => {
    if(req.session.isAuth == undefined) {
    try {  
        Equipment.find((err,data)=>{  
        if(err){  
        console.log(err);  
        }else{  
            res.render("dashboard", {data: data});
        }  
        }).sort({price: 1}).lean();  
        } catch (error) {  
        console.log(error);  
        }
    }
    else {
        try {  
            Equipment.find({ownerId: { $ne: req.session.userId }}, (err,data)=>{  
            if(err){  
            console.log(err);  
            }else{  
                res.render("dashboard", {data: data});
            }  
            }).sort({price: 1}).lean();  
            } catch (error) {  
            console.log(error);  
            }
    }
});

router.get('/users/dashboard/highest', (req, res) => {
    if(req.session.isAuth == undefined) {
    try {  
        Equipment.find((err,data)=>{  
        if(err){  
        console.log(err);  
        }else{  
            res.render("dashboard", {data: data});
        }  
        }).sort({price: -1}).lean();  
        } catch (error) {  
        console.log(error);  
        }
    }
    else {
        try {  
            Equipment.find({ownerId: { $ne: req.session.userId }}, (err,data)=>{  
            if(err){  
            console.log(err);  
            }else{  
                res.render("dashboard", {data: data});
            }  
            }).sort({price: -1}).lean();  
            } catch (error) {  
            console.log(error);  
            }
    }
});

router.get('/users/dashboard/cameras', (req, res) => {
    if(req.session.isAuth == undefined) {
    try {  
        Equipment.find({tag: "camera"}, (err,data)=>{  
        if(err){  
        console.log(err);  
        }else{  
            res.render("dashboard", {data: data});
        }  
        }).lean();  
        } catch (error) {  
        console.log(error);  
        }
    }
    else {
        try {  
            Equipment.find({$and: [{tag: "camera"}, {ownerId: { $ne: req.session.userId }}]}, (err,data)=>{  
            if(err){  
            console.log(err);  
            }else{  
                res.render("dashboard", {data: data});
            }  
            }).lean();  
            } catch (error) {  
            console.log(error);  
            }
    }
});

router.get('/users/dashboard/flashes', (req, res) => {
    if(req.session.isAuth == undefined) {
    try {  
        Equipment.find({tag: "flash"}, (err,data)=>{  
        if(err){  
        console.log(err);  
        }else{  
            res.render("dashboard", {data: data});
        }  
        }).lean();  
        } catch (error) {  
        console.log(error);  
        }
    }
    else {
        try {  
            Equipment.find({$and: [{tag: "flash"}, {ownerId: { $ne: req.session.userId }}]}, (err,data)=>{  
            if(err){  
            console.log(err);  
            }else{  
                res.render("dashboard", {data: data});
            }  
            }).lean();  
            } catch (error) {  
            console.log(error);  
            }
    }
});

router.get('/users/dashboard/lenses', (req, res) => {
    if(req.session.isAuth == undefined) {
    try {  
        Equipment.find({tag: "lenses"}, (err,data)=>{  
        if(err){  
        console.log(err);  
        }else{  
            res.render("dashboard", {data: data});
        }  
        }).lean();  
        } catch (error) {  
        console.log(error);  
        }
    }
    else {
        try {  
            Equipment.find({$and: [{tag: "lenses"}, {ownerId: { $ne: req.session.userId }}]}, (err,data)=>{  
            if(err){  
            console.log(err);  
            }else{  
                res.render("dashboard", {data: data});
            }  
            }).lean();  
            } catch (error) {  
            console.log(error);  
            }
    }
});

router.get('/users/dashboard/others', (req, res) => {
    if(req.session.isAuth == undefined) {
    try {  
        Equipment.find({tag: "others"}, (err,data)=>{  
        if(err){  
        console.log(err);  
        }else{  
            res.render("dashboard", {data: data});
        }  
        }).lean();  
        } catch (error) {  
        console.log(error);  
        }
    }
    else {
        try {  
            Equipment.find({$and: [{tag: "others"}, {ownerId: { $ne: req.session.userId }}]}, (err,data)=>{  
            if(err){  
            console.log(err);  
            }else{  
                res.render("dashboard", {data: data});
            }  
            }).lean();  
            } catch (error) {  
            console.log(error);  
            }
    }
});

router.get('/users/upload', (req, res) => {
    if(req.session.isAuth == true)
    res.render('upload');
    else{
    req.flash("error", "You have to login");
    res.redirect("/users/login");
    }
});
router.get('/payment/users', async (req, res) => {
    if(req.session.isAuth == true){
    let equip = await Equipment.findOne({_id: req.session.eqId});
    res.render('payment', {price: equip.price, insurance: equip.insurance, totalPrice: equip.price + equip.insurance});
    }
    else{
    req.flash("error", "You have to login");
    res.redirect("/users/login");
    }
});


module.exports = router;