let routecreator = require('./busdriver/routecreator.js');
let routesAvailable;
let peds = [{
    model: "a_m_o_genstreet_01",
    position: {
        x: 436.4219665527344,
        y: -645.994873046875,
        z: 28.74165153503418,
    },
    heading: 79.92713928222656,
    defaultScenario: 'WORLD_HUMAN_AA_COFFEE'
}
];

mp.events.add('characterInit.done', () => {
    peds.forEach((current) => {
        mp.events.call('NPC.create', current);
    })
});


mp.events.add('busdriver.jobmenu.show', (state) => {
    mp.busy.add('busdriver.jobmenu');
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["busJobMenu"])`);
    switch (state) {
        case 0:
            mp.callCEFV(`selectMenu.menu.items[0].text = 'Устроиться на работу'`);
            break;
        case 1:
            mp.callCEFV(`selectMenu.menu.items[0].text = 'Уволиться с работы'`);
            break;
    }
    mp.callCEFV(`selectMenu.show = true`);
});


mp.events.add('busdriver.jobmenu.close', () => {
    mp.busy.remove('busdriver.jobmenu');
    mp.callCEFV(`selectMenu.show = false`);
});

mp.events.add('busdriver.rent.show', (price) => {
    mp.gui.cursor.show(true, true);
    mp.callCEFV(`acceptWindow.header = 'Вы хотите арендовать автобус за $${price}?';`);
    mp.callCEFV(`acceptWindow.name = 'bus_rent';`);
    mp.callCEFV(`acceptWindow.show = true;`);
    mp.busy.add('bus_rent');
});

mp.events.add('busdriver.rent.close', () => {
    mp.gui.cursor.show(false, false);
    mp.callCEFV(`acceptWindow.show = false;`);
    mp.busy.remove('bus_rent');
});


mp.events.add('busdriver.menu.show', (data) => {
    mp.chat.debug('show bus')
    mp.busy.add('busdriver.menu');
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["busMenu"])`);
    routesAvailable = data;
    let names = [];
    data.forEach(current => names.push(current.name));
    mp.callCEFV(`selectMenu.menu.items[0].values = ${JSON.stringify(names)}`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('busdriver.rent.ans', (ans, data) => {
    mp.callCEFV('loader.show = false');
    switch (ans) {
        case 0:
            mp.notify.success('Вы арендовали транспорт', 'Автобус');
            mp.events.call('busdriver.menu.show', data);
            break;
        case 1:
            mp.notify.error('Ошибка аренды', 'Автобус');
            break;
        case 2:
            mp.notify.error('Недостаточно денег', 'Автобус');
            break;
        case 3:
            mp.notify.error('Аренда невозможна', 'Автобус');
            break;
        case 4:
            mp.notify.warning('Вы отказались от аренды', 'Автобус');
            break;
    }
});

mp.events.add('busdriver.menu.start', (routeIndex, price) => {
    mp.chat.debug(routeIndex);
    mp.chat.debug(`route name ${routesAvailable[routeIndex].name} ${routesAvailable[routeIndex].id}`);
    mp.chat.debug(price);
});

// [30, 206, 255, 255] stop
// [255, 246, 0, 255] point