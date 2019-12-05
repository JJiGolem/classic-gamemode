const logger = require('./index');

module.exports = {
    "logger.log": (player, text, moduleName = null) => {
        logger.log(text, moduleName, player);
    },
    "logger.debug": (player, text, moduleName = null) => {
        logger.debug(text, moduleName, player);
    },
}