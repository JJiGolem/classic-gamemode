let clothes = call('clothes');
let inventory = call('inventory');
let notifs = call('notifications');
let weather = call('weather');

module.exports = {
    "init": () => {
        clothes.init();
    },
    "clothes.clime.check": (player) => {
        var temperature = weather.getCurrentWeather().temperature;
        inventory.checkClimeDamage(player, temperature, (text) => {
            notifs.warning(player, text, `Климат`);
        });
    },
};
