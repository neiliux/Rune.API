var handler = {};
var mongoClient = require('./mongoClient');
var host;

function wireEndpoints() {
    host.post('/api/createDeck', createDeckHandler);
}

function createDeckHandler(req, res) {
    var deckData = req.body;
    var result = createDeck(deckData, function() {
        res.json(result);
    });
}

function createDeck(deckData, callback) {
    console.log('create deck handler');
    console.log(deckData.name);

    mongoClient.connect(function(db) {
        createDeck(db);
        mongoClient.close(db);
        callback({});   
    }, function() {
        console.log('something went wrong');
    });

    function createDeck(db) {
        db.collection('decks').insertOne({
            userId: 1,
            name: deckData.name
        });
    }
};

handler.init = function(server) {
    host = server;
    wireEndpoints();
}

module.exports = handler;
