const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');


router.get('/',function(req,res,next){
   Product.find()
       .select('name price _id')
       .exec()
       .then(docs => {
           if(docs.length>=0){
               const response ={
                    count: docs.length,
                    products:docs.map(doc => {
                        return {
                            name:doc.name,
                            price:doc.price,
                            _id:doc._id,
                            request:{
                                type: 'GET',
                                url:'http://localhost:3000/api/v1/products/'+doc._id
                            }
                        }
                    })
               };
               res.status(200).json(response);
           }else{
               res.status(404).json({
                  message: 'No Entries Found'
               });
           }

       })
       .catch(err =>{
          console.log(err);
          res.status(500).json({error:err});
       });
});

router.post('/',(req,res,next)=>{
    const productItem =new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    });
   productItem.save(function (error,doc) {
      if(error){
          console.log(error.message);
          return res.status(500).json({
             error:error
          });
      }
      if(doc){
          console.log(doc);
          return res.status(200).json({
              message:'Handling Post Requests to /Products',
              createdProduct:{
                  name:doc.name,
                  price:doc.price,
                  id:doc._id,
                  request:{
                      type:'POST',
                      url:'http://localhost:3000/api/v1/products/'+doc.url
                  }
              }
          });
      }
      return res.status(404).json({message: 'Invalid Id'});
   });

});

router.get('/:productId',function(req,res,next){
   const productID = req.params.productId;

   Product.findById(productID,function(error,docs){
       if(error){
           console.log('Error' + error.message);
           return res.status(500).json({
               error:error
           });
       }
       console.log(docs);
       res.status(200).json({
            docs
       });
    });
});

router.delete('/:productId',function(req,res,next){
   const id = req.params.productId;
   Product.remove({_id:id}).exec()
       .then(result =>{
           res.status(200).json(result);
       })
       .catch(err =>{
           res.status(500).json({error:err});
       });

});

router.patch('/:productId',function(req,res,next){
   const id = req.params.productId;
   const updateOps = {};
   for(const ops of req.body){
       updateOps[ops.propName] = ops.value;
   }
   Product.update({_id:id},{$set:updateOps}).exec()
       .then(result => {
            console.log(result);
            res.status(200).json({
                updatedProduct:result,
                request:{
                    type: 'GET',
                    url:'http://localhost:3000/api/v1/products/'+id
                }
            });
       })
       .catch(error =>{
           console.log(error);
           res.status(500).json({error:error});
       });

});
module.exports = router;