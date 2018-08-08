const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const productController = require('../controller/productController');
const checkAuth = require('../middleware/check-auth');
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

router.get('/',productController.getAllProducts);
router.post('/',checkAuth,upload.single('productImage'),productController.createProduct);
router.get('/:productId',checkAuth,productController.getProductById);
router.delete('/:productId',checkAuth,productController.deleteOrderById);
router.patch('/:productId',checkAuth,productController.patchById);

module.exports = router;