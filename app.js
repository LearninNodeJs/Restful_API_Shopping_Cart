const express = require('express');
const app = express();

app.use((req,res,next)=>{
   res.status(200).json({
     message:'It Works'
   });
});
app.use('/see',function(req,res,next){
   res.status(200).json({
       message :'Use of Functions'
   });
});
module.exports = app;