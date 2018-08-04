const express = require('express');
const app = express();
const morgan = require('morgan');


const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');

//Order Routes
app.use(morgan('dev'));
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);


/*Error Handlers*/
app.use(function(req,res,next){
   const error = new Error('Not Found');
   error.status =404;
   next(error);
});
app.use(function(err,req,res,next){
   res.status(err.status || 500);
   res.json({
      err:{
          message:err.message
      }
   });
});
module.exports = app;