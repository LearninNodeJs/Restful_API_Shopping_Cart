const express = require('express');
const router = express.Router();

router.get('/',function(req,res,next){
    res.status(200).json({
       message:'Handling GET Requests to /products'
    });
});
router.post('/',(req,res,next)=>{
   res.status(200).json({
        message: 'Handling POST Requests to /products'
   });
});

router.get('/:productId',function(req,res,next){
   const productID = req.params.productId;
   if(productID === 'special'){
       res.status(200).json({
          message: 'You Discovered the Special Id',
           id:productID
       });
   }else{
       res.status(200).json({
          message:'You Passed An id'
       });
   }
});
module.exports = router;