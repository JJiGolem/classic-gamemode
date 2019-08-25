let dmv = require('./index.js');

module.exports = {
    "init": () => {
        dmv.init();
    },
    "dmv.license.buy": (player, id) => {
        let price;
        let lic;

        let PRICE = dmv.getPriceConfig();
        switch (id) {
            case 0:
                if (player.character.carLicense) return player.call('dmv.license.buy.ans', [0]);
                lic = 'carLicense';
                price = PRICE.CAR;
                break;
         }
    }
}