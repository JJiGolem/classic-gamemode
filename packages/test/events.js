let test = require("./index.js");

module.exports = {
    /// Событие инициализации сервера
    "init": () => {
        test.test();
    },
};