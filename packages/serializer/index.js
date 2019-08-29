"use strict"

const Sequelize = require('sequelize');
var db = require('../base/db.js');

module.exports = {
    save(player) {
        console.log(db.Models);
        player.call('serializer.save');
    }
}