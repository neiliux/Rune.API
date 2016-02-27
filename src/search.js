var lodash = require('lodash');
var _cachedMtgJson = null;
var host;
var handler = {};

function wireEndpoints() {
    host.post('/api/search', function(req, res) {
        var searchRequest = req.body;
        var result = search(searchRequest.searchText);

        res.json(result);
    });
}

function search(name) {
    var matchingCards = [];

    lodash.each(_cachedMtgJson, function(set) {
        lodash.each(set.cards, function(card) {
            var regEx = new RegExp(name, 'i');
            if (regEx.test(card.name)) {
                matchingCards.push(card);
            }
        });
    });

    console.log('search found', matchingCards.length, 'cards');
    return matchingCards;
}

handler.init = function(mtgJson, server) {
    _cachedMtgJson = mtgJson;
    host = server;
    wireEndpoints();
};

module.exports = handler;
