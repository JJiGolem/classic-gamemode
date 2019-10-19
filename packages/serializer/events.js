"use strict";

var serializer = require('./index.js');

module.exports = {
    'serializer.save.all': (player) => {
        serializer.saveAll(player);
    },
    'serializer.save.table': (player, tableName) => {
        serializer.saveTable(player, tableName);
    },
    'serializer.clear.all': (player) => {
        serializer.clearAll(player);
    },
    'serializer.clear.table': (player, tableName) => {
        serializer.clearTable(player, tableName);
    },
    'serializer.load.all': (player) => {
        serializer.loadAll(player);
    },
    'serializer.load.table': (player, tableName) => {
        serializer.loadTable(player, tableName);
    },
    'serializer.clear.files': (player) => {
        serializer.deleteAllFiles(player);
    }
};