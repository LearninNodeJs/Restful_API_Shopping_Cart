const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/allusers',function(req,res,next){
    User.find()
        .select('_id email password')
        .exec()
        .then(results =>{
            res.status(201).json({
               count:results.length,
               message:'All Users',
               results
            });
        })
        .catch(error =>{
            res.status(500).json({
               error:error.message
            });
        });
});

router.post('/signup',function(req,res,next){
    User.find({email:req.body.email}).exec()
        .then(result=>{
            if(result.length>0){
                return res.status(409).json({
                   message:'Email Already Exists'
                });
            }else{
                bcrypt.hash(req.body.password,10,function(error,hash){
                    if(error){
                        return res.status(500).json({
                            message:'Error Hashing Password',
                            error:error.message
                        });
                    }else{
                        const user = new User({
                            _id:new mongoose.Types.ObjectId(),
                            email:req.body.email,
                            password:hash
                        });
                        user.save()
                            .then(result =>{
                                res.status(200).json({
                                    message:'User Created',
                                    user
                                });
                            })
                            .catch(error=>{
                                res.status(500).json({
                                    Error:error.message,
                                    message:'Error Encountered Saving User'
                                });
                            });
                    }
                });
            }
        })
        .catch(error=>{
           res.status(500).json({
               message:'Error Loading User Emails'
           });
        });
});
router.delete('/:userEmail',function(req,res,next){
   const email = req.params.userEmail;
    User.find({email:req.params.userEmail}).exec()
        .then(result =>{
            if(result.length>0){
                User.remove({email:email}).exec()
                    .then(result =>{
                        res.status(200).json({
                           message:'User Deleted Successfully'
                        });
                    })
                    .catch(error =>{
                        res.status(500).json({
                            error:error.message,
                            message:'Error Removing User'
                        })
                    })
            }else{
                res.status(404).json({
                   message:'Email Does Not Exist'
                });
            }
        })
        .catch(error =>{
             res.status(500).json({
                message:'Error Handling Find Method',
                error:error.message
             });
        });

});

module.exports = router;