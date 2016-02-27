var async = require('async');
var request = require('request');
var fs = require('fs');
var config = require('./config');
var imageHandler = {};
var host;
var sendFileOptions = {
    root: config.imagePath
};
var jpegRegEx = new RegExp('jpeg|jpg', 'i');
var pngRegEx = new RegExp('png', 'i');

function getFileInformation(path) {
    try {
        return fs.statSync(path);
    } catch (exception) {
        return null;
    }
}

function fileExists(path) {
    var statInfo = getFileInformation(path);
    if (!statInfo) {
        return null;
    }
    
    return statInfo.isFile();
}

function sendImage(fileName, response) {
    response.sendFile(fileName, sendFileOptions);
}

function wireEndpoints() {
    host.get('/mtgImage/:id', getImageHandler);
}

function getImageHandler(req, res) {
    var id = req.params.id;
    fetchImage(id, res);
}

function fetchImage(multiverseId, response) {
    var id = multiverseId;
  
    if (!multiverseId || id === "back") {
        sendImage('back.jpg', response);
        return;
    }

    var pngFilename = id + '.png';
    var jpgFilename = id + '.jpg'; 

    if (fileExists(config.imagePath + pngFilename)) {
        sendImage(pngFilename, response);
        return;
    }

    if (fileExists(config.imagePath + jpgFilename)) {
        sendImage(jpgFilename, response);
        return;
    }

    async.waterfall([
        function(callback) {
            request('http://gatherer.wizards.com/Handlers/image.ashx?multiverseid=' + id + '&type=card',
                    { encoding: 'binary' },
                function(error, response, body) {
                    callback(null, body, response.headers['content-type']);
                });
        },
        function(imageBytes, contentType, callback) {
            var fileName = id;

            if (jpegRegEx.test(contentType)) {
                fileName += '.png';
            } else if (pngRegEx.test(contentType)) {
                fileName += '.jpg';
            }

            fs.writeFile(config.imagePath + fileName, imageBytes, 'binary', function() {
                callback(null, fileName);
            });
        }
    ], function(error, results) {
        sendImage(results, response);
    });
}

imageHandler.init = function(server) {
    host = server;
    wireEndpoints();
}

module.exports = imageHandler;
