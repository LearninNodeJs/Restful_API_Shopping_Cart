const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.displayAllUsers = function(req,res,next){
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
};
exports.loginUser = function(req,res,next){
    User.find({email:req.body.email})
        .exec()
        .then(users=>{
            if(users.length<1){
                return res.status(401).json({
                    message:'Authentication Failed!'
                });
            }
            bcrypt.compare(req.body.password,users[0].password,function(err,response){
                if(err){
                    return res.status(401).json({
                        message:'Authentication Failed'
                    });
                }
                if(response){
                    const token =  jwt.sign({
                        email:users[0].email,
                        userId:users[0]._id
                    }, process.env.JWT_KEY,{
                        expiresIn: "1h"
                    });
                    res.status(200).json({
                        message:'Authentication Success',
                        users,
                        token:token
                    });
                }
            });

        })
        .catch(error => {
            res.status(500).json({
                message:'Error Handling Find Method',
                error:error.message
            })
        });
};
exports.signUpUser = function(req,res,next){

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
};
exports.deleteUserByEmail = function(req,res,next){
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
};
exports.getUserByMail = function(req,res,next){
    const userEmail = req.params.userEmail;
    User.find({email:userEmail}).exec()
        .then(result =>{
            if(result.length>0){
                res.status(201).json({
                    message:'User Found',
                    result

                });
            }else{
                res.status(404).json({
                    message:'User Not Found, Email does not exist'
                });
            }
        })
        .catch(error=>{
            res.status(500).json({
                message:'Error Encountered Fetching User Email',
                error:error.message

            });
        });
};
