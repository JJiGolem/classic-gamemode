"use strict";

let timer;
let utils;

let bizService = require('./index.js');
module.exports = {
    "init": () => {
        timer = call("timer");
        utils = call("utils");
        bizService.init();
    },
}