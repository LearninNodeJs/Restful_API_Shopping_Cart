var expect = require('chai').expect;
var mongoose = require('mongoose');
require('dotenv').config();

function getMongoConnection(){
    try {
        var connection = mongoose.connect("mongodb+srv://admin:" + process.env.MONGO_ATLAS + "@restapi-kvyex.mongodb.net/ShopApi?retryWrites=true",
            {useNewUrlParser: true});
    }catch (e) {
        console.log(e.message);
    }
    return connection
}

describe('GetMongoConnection()',function(){
    it('should connect to mongo',function(){
        const connection = true;

        expect(connection).to.be.equal(getMongoConnection()!==null);
    });
});