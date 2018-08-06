const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');


router.get('/',function(req,res,next){
   Order.find().select('_id product quantity')
       .populate('product','name')
       .exec()
       .then(result =>{
            console.log(result);
            res.status(201).json({
                count:result.length,
                orders: result.map(results =>{
                  return {
                     _id: results._id,
                     product:results.product,
                     quantity: results.quantity,
                     request:{
                        type: 'GET',
                        url:'http://localhost:3000/api/v1/orders/'+results._id
                     }
                  }
                })
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
   Product.findById(req.body.productId)
       .then(product =>{
           const order = new Order({
               _id:new mongoose.Types.ObjectId(),
               quantity: req.body.quantity,
               product:req.body.productId
           });
           order.save()
               .then(result => {
                   console.log(result);
                   res.status(200).json({
                       createdProduct:{
                           message:'Order Stored',
                           result,
                           request:{
                              type:'GET',
                              url:'http://localhost:3000/api/v1/orders/'+result._id
                           }
                       }
                   });
               })
               .catch(err =>{
                   console.log(err);
                   res.status(500).json({error:err});
               });
       })
       .catch(error=>{
          res.status(500).json({
             message:'Product Not Found',
             error:error.message
          });
       });

});
router.get('/:productId',function(req,res,next){
   const productId = req.params.productId;
   Order.findById(productId).select('product _id quantity')
       .populate('product','name')
       .exec()
       .then(order => {
          if(!order){
             return res.status(404).json({
                message: 'No Record Has been Found'
             });
          }
            res.status(200).json({
                message:'Order Has Been Found',
                order:order,
                request:{
                   type:'GET',
                   url:'http://localhost:3000/api/v1/orders/'+order._id
                }

            });
       })
       .catch(err=>{
          res.status(500).json({
             message:'Record Not Found',
             error:err.message
          });
       });
});
router.delete('/:orderId',function(req,res,next){
   const orderId = req.params.orderId;
   Order.remove({_id:orderId})
       .exec()
       .then(result =>{

          res.status(200).json({
             message:'Successfully Deleted Record',
             result
          });
       })
       .catch(error => {
          res.status(500).json({
             message:'Error Deleting Record',
             error:error.message
          });
       });
});
module.exports = router;
