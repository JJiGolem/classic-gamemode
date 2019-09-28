mp.events.add({
    "ammunation.enter": (data, weaponsConfig) => {
        let items = [];
        for (let key in weaponsConfig) {
            let current = weaponsConfig[key];
            items.push({
                text: current.name,
                values: [`$${current.products * data.productPrice * data.priceMultiplier}`],
                weaponId: key
            });
        }
        items.push({ text: 'Назад' });
        mp.callCEFV(`selectMenu.setItems('ammunationFirearms', ${JSON.stringify(items)});`)
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
                mp.callCEFV(`selectMenu.notification = '${data}'`);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'Вы приобрели ${data}'`);
                break;
            case 3:
                mp.callCEFV(`selectMenu.notification = 'Ошибка финансовой операции'`);
                break;
        }
    }
});