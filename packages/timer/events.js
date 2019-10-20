"use strict";

let timer = require("./index.js");

module.exports = {
    "init": () => {
        timer.init();
        inited(__dirname);
    }
}