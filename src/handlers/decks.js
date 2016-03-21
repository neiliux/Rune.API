'use strict';

let mongoClient = require('../repositories/mongo-client');

module.exports = {
  post: (req, res, next) => {
    let deckData = req.body;
    let result = createDeck(deckData, () => {
        res.json(result);
    });
    next();
  },
  get: (req, res, next) => {
    let userId = req.user.userId;
    getDecks(userId, (decks) => {
        res.json(decks);
    });
    next();
  }
}

function createDeck(deckData, callback) {
    console.log('create deck handler');
    console.log(deckData.name);

    mongoClient.connect((db) => {
        createDeck(db);
        mongoClient.close(db);
        callback({});
    }, () => {
        console.log('something went wrong');
    });

    function createDeck(db) {
        db.collection('decks').insertOne({
            userId: 1,
            name: deckData.name
        });
    }
}

function getDecks(userId, callback) {
    userId = parseInt(userId);

    mongoClient.connect((db) => {
        let decks = getDecks(db, (decks) => {
            callback(decks);
        });
    }, () => {
        console.log('wrong...');
    });

    function getDecks(db, callback) {
        console.log('fetching decks for user id', userId);
        db.collection('decks')
            .find({ userId: userId })
            .toArray((err, decks) => {
                console.log('decks length', decks.length);
                callback(decks);
            });
    }
}
