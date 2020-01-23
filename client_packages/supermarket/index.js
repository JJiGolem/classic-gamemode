mp.events.add({
    "supermarket.enter": (data, priceConfig) => {
        setSupermarketHeaders(data.bType);
        setPrices(priceConfig, data.priceMultiplier);
        mp.events.call('selectMenu.show', 'supermarketMain');
    },
    "supermarket.exit": () => {
        mp.events.call(`selectMenu.hide`);
    },
    "supermarket.phone.buy": () => {
        mp.events.callRemote('supermarket.phone.buy');
    },
    "supermarket.phone.buy.ans": (ans) => {
        mp.callCEFV('selectMenu.loader = false');
        switch (ans) {
            case 0:
                mp.callCEFV(`selectMenu.notification = 'У вас уже есть телефон'`);
                break;
            case 1:
                mp.events.call('prompt.show', 'Чтобы достать свой телефон, нажмите <span>↑</span>');
                mp.callCEFV(`selectMenu.notification = 'Вы купили телефон'`);
                break;
            case 2:
                mp.callCEFV(`selectMenu.notification = 'Недостаточно денег'`);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'В магазине кончились продукты'`);
                break;
            case 4:
                mp.callCEFV(`selectMenu.notification = Ошибка покупки'`);
                break;
        }
    },
    "supermarket.number.change": (number) => {
        if (number.length != 6) {
            mp.callCEFV('selectMenu.loader = false');
            return mp.callCEFV(`selectMenu.notification = 'Номер должен содержать 6 символов'`);
        }
        if (/\D/g.test(number)) {
            mp.callCEFV('selectMenu.loader = false');
            return mp.callCEFV(`selectMenu.notification = 'Номер содержит недопустимые символы'`);
        }
        if (number.charAt(0) == '0') {
            mp.callCEFV('selectMenu.loader = false');
            return mp.callCEFV(`selectMenu.notification = 'Номер не может начинаться с 0'`);
        }
        mp.events.callRemote('supermarket.number.change', number);
    },
    "supermarket.number.change.ans": (ans, number) => {
        mp.callCEFV('selectMenu.loader = false');
        switch (ans) {
            case 0:
                mp.callCEFV(`selectMenu.notification = 'Некорректный номер'`);
                break;
            case 1:
                mp.callCEFV(`selectMenu.notification = 'Ваш новый номер — ${number}'`);
                break;
            case 2:
                mp.callCEFV(`selectMenu.notification = 'Недостаточно денег'`);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'В магазине кончились продукты'`);
                break;
            case 4:
                mp.callCEFV(`selectMenu.notification = 'Ошибка покупки'`);
                break;
            case 5:
                mp.callCEFV(`selectMenu.notification = 'Номер занят'`);
                break;
        }
    },
    "supermarket.products.buy.ans": (ans, data) => {
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
                mp.callCEFV(`selectMenu.notification = 'В магазине кончились продукты'`);
                break;
            case 4:
                mp.callCEFV(`selectMenu.notification = \`${data}\``);
                break;
        }
    }
});

function setSupermarketHeaders(type) {
    let img = type ? 'ltd.png' : 'supermarket.png';
    mp.callCEFV(`selectMenu.menus["supermarketMain"].headerImg = \`${img}\``);
    mp.callCEFV(`selectMenu.menus["supermarketMobile"].headerImg = \`${img}\``);
    mp.callCEFV(`selectMenu.menus["supermarketNumberChange"].headerImg = \`${img}\``);
    mp.callCEFV(`selectMenu.menus["supermarketFood"].headerImg = \`${img}\``);
    mp.callCEFV(`selectMenu.menus["supermarketTobacco"].headerImg = \`${img}\``);
    mp.callCEFV(`selectMenu.menus["supermarketStuff"].headerImg = \`${img}\``);
    mp.callCEFV(`selectMenu.menus["supermarketBags"].headerImg = \`${img}\``);
}

function setPrices(config, multiplier) {
    for (let key in config) {
        config[key] *= multiplier;
    }
    mp.callCEFV(`selectMenu.menus["supermarketMobile"].items[0].values[0] = '$${config.phone}'`);
    mp.callCEFV(`selectMenu.menus["supermarketMobile"].items[1].values[0] = '$${config.numberChange}'`);
    mp.callCEFV(`selectMenu.menus["supermarketNumberChange"].items[1].values[0] = '$${config.numberChange}'`);
    mp.callCEFV(`selectMenu.menus["supermarketFood"].items[0].values[0] = '$${config.water}'`);
    //mp.callCEFV(`selectMenu.menus["supermarketFood"].items[1].values[0] = '$${config.chocolate}'`);
    mp.callCEFV(`selectMenu.menus["supermarketTobacco"].items[0].values[0] = '$${config.cigarettes}'`);
    mp.callCEFV(`selectMenu.menus["supermarketStuff"].items[0].values[0] = '$${config.rope}'`);
    mp.callCEFV(`selectMenu.menus["supermarketStuff"].items[1].values[0] = '$${config.bag}'`);
    mp.callCEFV(`selectMenu.menus["supermarketStuff"].items[2].values[0] = '$${config.canister}'`);
    mp.callCEFV(`selectMenu.menus["supermarketBags"].items[0].values[0] = '$${config.duffleBag}'`);
    mp.callCEFV(`selectMenu.menus["supermarketBags"].items[1].values[0] = '$${config.duffleBag}'`);
    mp.callCEFV(`selectMenu.menus["supermarketStuff"].items[3].values[0] = '$${config.healthPack}'`);
    mp.callCEFV(`selectMenu.menus["supermarketStuff"].items[4].values[0] = '$${config.matches}'`);
}
