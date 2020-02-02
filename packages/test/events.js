"use strict";
let test = require("./index.js");

module.exports = {
    "init": () => {
        test.test();
        inited(__dirname);
    },
};