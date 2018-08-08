const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req, file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString()+'_'+ file.originalname);
    }
});

const fileFilter = function(req,file,cb){

    if(file.mimetype == 'image/jpeg' || file.mimetype =='image/png'){
        cb(null, true);
    }else{
        cb(null, true);
    }
};

const upload = multer(
    {
        storage:storage,
        limits:{
            fileSize: 1024*1024*5
        },
        fileFilter:fileFilter
    });

exports.getAllProducts = function(req,res,next){
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            if(docs.length>=0){
                const response ={
                    count: docs.length,
                    products:docs.map(doc => {
                        return {
                            name:doc.name,
                            price:doc.price,
                            productImage:doc.productImage,
                            _id:doc._id,
                            request:{
                                type: 'GET',
                                url:'https://frozen-garden-96255.herokuapp.com/'+doc._id,
                                imageurl:'https://frozen-garden-96255.herokuapp.com/'+doc.productImage
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
};
exports.createProduct = function(req,res,next){
    console.log(req.file);
    const productItem =new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
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
                        url:'https://frozen-garden-96255.herokuapp.com/products/'+doc.url
                    }
                }
            });
        }
        return res.status(404).json({message: 'Invalid Id'});
    });
};
exports.getProductById = function(req,res,next){
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
};
exports.deleteOrderById = function(req,res,next){
    const id = req.params.productId;
    Product.remove({_id:id}).exec()
        .then(result =>{
            res.status(200).json(result);
        })
        .catch(err =>{
            res.status(500).json({error:err});
        });
};
exports.patchById = function(req,res,next){
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
                    url:'https://frozen-garden-96255.herokuapp.com/api/v1/products/'+id
                }
            });
        })
        .catch(error =>{
            console.log(error);
            res.status(500).json({error:error});
        });
};
