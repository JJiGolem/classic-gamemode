"use strict";

var serializer = require('./index.js');

module.exports = {
    'serializer.save': (player) => {
        serializer.save(player);
    }
};