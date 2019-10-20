let dmv = require('./index.js');
let money = call('money');

module.exports = {
    "init": () => {
        dmv.init();
        inited(__dirname);
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
            case 1:
                if (player.character.passengerLicense) return player.call('dmv.license.buy.ans', [0]);
                lic = 'passengerLicense';
                price = PRICE.PASSENGER;
                break;
            case 2:
                if (player.character.bikeLicense) return player.call('dmv.license.buy.ans', [0]);
                lic = 'bikeLicense';
                price = PRICE.BIKE;
                break;
            case 3:
                if (player.character.truckLicense) return player.call('dmv.license.buy.ans', [0]);
                lic = 'truckLicense';
                price = PRICE.TRUCK;
                break;
            case 4:
                if (player.character.airLicense) return player.call('dmv.license.buy.ans', [0]);
                lic = 'airLicense';
                price = PRICE.AIR;
                break;
            case 5:
                if (player.character.boatLicense) return player.call('dmv.license.buy.ans', [0]);
                lic = 'boatLicense';
                price = PRICE.BOAT;
                break;
        }

        if (player.character.cash < price) return player.call('dmv.license.buy.ans', [2]);

        money.removeCash(player, price, function (result) {
            if (result) {
                player.character[lic] = 1;
                player.character.save();
                player.call('dmv.license.buy.ans', [1])
            } else {
                player.call('dmv.license.buy.ans', [3]);
            }
        }, `Покупка лицензии ${lic}`);

    }
}