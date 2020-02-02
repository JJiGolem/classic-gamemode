"use strict";

let parser = require("./index.js");

module.exports = {
    "init": async () => {
        await parser.init();
        inited(__dirname);
    },
};

