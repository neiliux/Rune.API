'use strict';

let async = require('async');
let request = require('request');
let fs = require('fs');
let config = require('../../config');
let sendFileOptions = {
    root: config.imagePath
};
let jpegRegEx = /jpeg|jpg/i;
let pngRegEx = /png/i;

module.exports = {
  get: (req, res, next) => {
    let id = req.params.id;
    fetchImage(id, res);
    next();
  }
}

function getFileInformation(path) {
    try {
        return fs.statSync(path);
    } catch (exception) {
        return null;
    }
}

function fileExists(path) {
    let statInfo = getFileInformation(path);
    if (!statInfo) {
        return null;
    }

    return statInfo.isFile();
}

function sendImage(fileName, response) {
    response.sendFile(fileName, sendFileOptions);
}

function fetchImage(multiverseId, response) {
    let id = multiverseId;

    if (!multiverseId || id === "back") {
        sendImage('back.jpg', response);
        return;
    }

    let pngFilename = id + '.png';
    let jpgFilename = id + '.jpg';

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
            request(`http://gatherer.wizards.com/Handlers/image.ashx?multiverseid=${id}&type=card`,
                    { encoding: 'binary' },
                function(error, response, body) {
                    callback(null, body, response.headers['content-type']);
                });
        },
        function(imageBytes, contentType, callback) {
            let fileName = id;

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
