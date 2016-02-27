var mongoClient = require('./mongoClient');
var handler = {};
var host;

function wireEndpoints() {
    host.get('/api/decks', getDecksHandler);
}

function getDecksHandler(req, res) {
    var userId = req.user.userId;
    getDecks(userId, function(decks) {
        res.json(decks);
    }); 
}

function getDecks(userId, callback) {
    userId = parseInt(userId);

    mongoClient.connect(function(db) {
        var decks = getDecks(db, function(decks) {
            callback(decks);
        });
    }, function() {
        console.log('wrong...');
    });

    function getDecks(db, callback) {
        console.log('fetching decks for user id', userId);
        db.collection('decks')
            .find({ userId: userId })
            .toArray(function(err, decks) {
                console.log('decks length', decks.length);
                callback(decks);
            });
    }
};

handler.init = function(server) {
    host = server;
    wireEndpoints();
};

module.exports = handler;
