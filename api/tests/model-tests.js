"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chai = require('chai');
const expect = chai.expect;
require('dotenv').config();

//Create a new schema that accepts a 'Product_name' object.
//object name is required.
const testSchema = new Schema({
    product_name :{type:String,required:true}
});

/*This Creates a new Collection called test_product'*/
const Name = mongoose.model('test_product',testSchema);

describe('Mongo Database Tests',function(){
    this.timeout(15000);
   /*We First Create a sandboxed database connection, using before(**...)*/
   before(function(done){
     mongoose.connect("mongodb+srv://admin:" + process.env.MONGO_ATLAS + "@restapi-kvyex.mongodb.net/Development?retryWrites=true",
         {useNewUrlParser: true});
     const developmentDb = mongoose.connection;
     developmentDb.on('error',console.error.bind(console,'connection error'));
     developmentDb.once('open',function(){
         console.log('We are connected to test database');
         done();
     });
   });
   describe('Test Database',function(){
       this.timeout(15000)
        //Save Object with test_product with value of 'Shampoo'
       it('Should save new test_product to test database',function(done){
          var testProduct = new Name({
              product_name: 'Shampoo'
          });
          testProduct.save(done);
       });
       it('Should not save Incorrect formats to database',function(done){
            var wrongProductFormat = Name({
                no_product_name:'No Shampoo'
            });
            wrongProductFormat.save(error =>{
               if(error){
                   return  done();
               }
               throw new Error('Should Generate Error');
            });
       });
       it('Should retrieve data from the database',function(done){
           this.timeout(15000);
          Name.find({product_name:'Shampoo'},function(err,product_name){
                if(err){
                    throw err;
                }
                if(product_name.length ===0){
                    throw new Error('No Data');
                }
          });
       });
   });

});