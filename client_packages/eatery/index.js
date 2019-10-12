mp.events.add({
    "eatery.enter": (data, priceConfig) => {
        // setSupermarketHeaders(data.bType);
        setPrices(priceConfig, data.priceMultiplier);
        mp.events.call('selectMenu.show', 'eateryMain');
    },
    "eatery.exit": () => {
        mp.events.call(`selectMenu.hide`);
    },
});


function setPrices(config, multiplier) {
    for (let key in config) {
        config[key] *= multiplier;
    }
    mp.callCEFV(`selectMenu.menus["eateryMain"].items[0].values[0] = '$${config.hamburger}'`);
    mp.callCEFV(`selectMenu.menus["eateryMain"].items[1].values[0] = '$${config.hotdog}'`);
    mp.callCEFV(`selectMenu.menus["eateryMain"].items[2].values[0] = '$${config.pizza}'`);
    mp.callCEFV(`selectMenu.menus["eateryMain"].items[3].values[0] = '$${config.chips}'`);
    mp.callCEFV(`selectMenu.menus["eateryMain"].items[4].values[0] = '$${config.pizza}'`);
}