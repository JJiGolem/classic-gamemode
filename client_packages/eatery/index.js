mp.events.add({
    "eatery.enter": (data, priceConfig) => {
        // setSupermarketHeaders(data.bType);
        setPrices(priceConfig, data.priceMultiplier);
        mp.events.call('selectMenu.show', 'eateryMain');
    },
    "eatery.exit": () => {
        mp.events.call(`selectMenu.hide`);
    },
    "eatery.products.buy.ans": (ans, data) => {
        mp.callCEFV('selectMenu.loader = false');
        switch (ans) {
            case 0:
                mp.callCEFV(`selectMenu.notification = 'Ошибка покупки'`);
                break;
            case 1:
                mp.callCEFV(`selectMenu.notification = 'Вы приобрели товар'`);
                break;
            case 2:
                mp.callCEFV(`selectMenu.notification = 'Недостаточно денег'`);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'В закусочной кончились продукты'`);
                break;
            case 4:
                mp.callCEFV(`selectMenu.notification = '${data}'`);
                break;
        }
    }
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