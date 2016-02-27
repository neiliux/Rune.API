var client = {};
var mongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/test';

client.connect = function(success, error) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('error');
            if (error) {
                error(err);
            }
            return;
        }

        success(db);
    });
};

client.close = function(db) {
    db.close();
};

module.exports = client;
