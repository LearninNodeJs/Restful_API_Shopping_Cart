const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use(function(req,res,next){
   res.header("Access-Control-Allow-Origin","*");
   res.header("Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept, Authorization");

   if(req.method === "OPTIONS"){
      res.header('Access-Control-Allow-Methods','PUT,PATCH,POST,DELETE,GET');
      return res.status(200).json({});
   }
   next();
});

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
mongoose.connect('mongodb+srv://admin:wamatu@restapi-kvyex.mongodb.net/test?retryWrites=true',
    {useNewUrlParser:true});

//Order Routes
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/api/v1/products',productRoutes);
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