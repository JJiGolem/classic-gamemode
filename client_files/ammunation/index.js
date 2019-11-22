mp.events.add({
    "ammunation.enter": (data, weaponsConfig, ammoProducts, armourProducts) => {
        let items = [];
        for (let key in weaponsConfig) {
            let current = weaponsConfig[key];
            items.push({
                text: current.name,
                values: [`$${parseInt(current.products * data.productPrice * data.priceMultiplier)}`],
                weaponId: key
            });
        }
        items.push({ text: 'Назад' });
        mp.callCEFV(`selectMenu.setItems('ammunationFirearms', ${JSON.stringify(items)});`)
        let price = parseInt(data.productPrice * data.priceMultiplier);
        items = [{
            text: "Патроны - 9mm",
            values: [`12 ед. - $${12 * ammoProducts * price}`, `24 ед. - $${24 * ammoProducts * price}`, `32 ед. - $${32 * ammoProducts * price}`],
        },
        {
            text: "Патроны - 12mm",
            values: [`8 ед. - $${8 * ammoProducts * price}`, `16 ед. - $${16 * ammoProducts * price}`, `24 ед. - $${24 * ammoProducts * price}`],
        },
        {
            text: "Патроны - 5.56mm",
            values: [`12 ед. - $${12 * ammoProducts * price}`, `24 ед. - $${24 * ammoProducts * price}`, `32 ед. - $${32 * ammoProducts * price}`],
        },
        {
            text: "Патроны - 7.62mm",
            values: [`10 ед. - $${10 * ammoProducts * price}`, `20 ед. - $${20 * ammoProducts * price}`, `30 ед. - $${30 * ammoProducts * price}`],
        },
        {
            text: "Назад"
        }];
        mp.callCEFV(`selectMenu.setItems('ammunationAmmo', ${JSON.stringify(items)});`)
        let armourPrice = parseInt(armourProducts * data.productPrice * data.priceMultiplier);
        items = [{
            text: "Серый бронежилет",
            values: [`$${armourPrice}`]
        },
        {
            text: "Черный бронежилет",
            values: [`$${armourPrice}`]
        },
        {
            text: "Зеленый бронежилет",
            values: [`$${armourPrice}`]
        },
        {
            text: "Камуфляжный бронежилет",
            values: [`$${armourPrice}`]
        },
        {
            text: "Камуфляжный бронежилет №2",
            values: [`$${armourPrice}`]
        },
        {
            text: "Назад"
        }
    ]
        mp.callCEFV(`selectMenu.setItems('ammunationArmour', ${JSON.stringify(items)});`)
        mp.events.call('selectMenu.show', 'ammunationMain');
    },
    "ammunation.exit": () => {
        mp.events.call(`selectMenu.hide`);
    },
    "ammunation.weapon.buy.ans": (ans, data) => {
        mp.callCEFV(`selectMenu.loader = false`);
        switch (ans) {
            case 0:
                mp.callCEFV(`selectMenu.notification = 'Недостаточно денег'`);
                break;
            case 1:
                mp.callCEFV(`selectMenu.notification = 'В магазине кончились ресурсы'`);
                break;
            case 2:
                mp.callCEFV(`selectMenu.notification = \`${data}\``);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'Вы приобрели ${data}'`);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'Ошибка финансовой операции'`);
                break;
            case 4:
                mp.callCEFV(`selectMenu.notification = 'У вас нет лицензии на оружие'`);
                break;
        }
    },
    "ammunation.ammo.buy.ans": (ans, data) => {
        mp.callCEFV(`selectMenu.loader = false`);
        switch (ans) {
            case 0:
                mp.callCEFV(`selectMenu.notification = 'Недостаточно денег'`);
                break;
            case 1:
                mp.callCEFV(`selectMenu.notification = 'В магазине кончились ресурсы'`);
                break;
            case 2:
                mp.callCEFV(`selectMenu.notification = \`${data}\``);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'Вы приобрели боеприпасы'`);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'Ошибка финансовой операции'`);
                break;
            case 4:
                mp.callCEFV(`selectMenu.notification = 'У вас нет лицензии на оружие'`);
                break;
        }
    },
    "ammunation.armour.buy.ans": (ans, data) => {
        mp.callCEFV(`selectMenu.loader = false`);
        switch (ans) {
            case 0:
                mp.callCEFV(`selectMenu.notification = 'Недостаточно денег'`);
                break;
            case 1:
                mp.callCEFV(`selectMenu.notification = 'В магазине кончились ресурсы'`);
                break;
            case 2:
                mp.callCEFV(`selectMenu.notification = \`${data}\``);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'Вы купили бронежилет'`);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'Ошибка финансовой операции'`);
                break;
        }
    }
});