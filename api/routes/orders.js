const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');


router.get('/',function(req,res,next){
   Order.find().exec()
       .then(result =>{
            console.log(result);
            res.status(201).json({
                count:result.length,
                createdOrders:result
            });
       })
       .catch(error =>{
          console.log(error);
          res.status(500).json({
             error:error
          });
       });
});

router.post('/',function(req,res,next){
   const order = new Order({
      _id:new mongoose.Types.ObjectId(),
       quantity: req.body.quantity,
       product:req.body.productId
   });
   order.save()
       .then(result => {
          console.log(result);
          res.status(201).json(result);
       })
       .catch(err =>{
          console.log(err);
          res.status(500).json({error:err});
       });
});
module.exports = router;





















