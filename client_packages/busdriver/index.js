let routecreator = require('./busdriver/routecreator.js');

let routesAvailable;
let checkpoint;
let blip;
let checkpointTimer;

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
    mp.busy.add('busdriver.menu');
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["busMenu"])`);
    routesAvailable = data;
    let names = [];
    data.forEach(current => names.push(current.name));
    mp.callCEFV(`selectMenu.menu.items[0].values = ${JSON.stringify(names)}`);
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('busdriver.menu.close', () => {
    mp.gui.cursor.show(false, false);
    mp.callCEFV(`selectMenu.show = false;`);
    mp.busy.remove('busdriver.menu');
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
    mp.events.callRemote('busdriver.route.start', routesAvailable[routeIndex].id, price);
});

mp.events.add('busdriver.route.start.ans', (ans, data) => {
    mp.callCEFV('loader.show = false');
    switch (ans) {
        case 0:
            mp.notify.error('Это не рабочий транспорт', 'Автобус');
            break;
        case 1:
            mp.notify.success('Маршрут построен', 'Автобус');
            createCheckpoint(data);
            break;
    }
});

mp.events.add('busdriver.checkpoint.create', (data, timeout) => {
    createCheckpoint(data, timeout);
});

mp.events.add('playerEnterCheckpoint', () => {
    if (!mp.players.local.vehicle) return;
    mp.events.callRemote('busdriver.checkpoint.entered');
});

mp.events.add('busdriver.route.end', () => {
    deleteCheckpoint();
});

function createCheckpoint(data, timeout) {
    deleteCheckpoint();
    checkpointTimer = setTimeout(() => {
        try {
            checkpoint = mp.checkpoints.new(5, new mp.Vector3(data.x, data.y, data.z), 10,
            {
                color: data.isStop ? [30, 206, 255, 255] : [255, 246, 0, 255],
                visible: true,
                dimension: 0
            });
            blip = mp.blips.new(1, new mp.Vector3(data.x, data.y, data.z), { color: data.isStop ? 26 : 71, name: "Остановка" });
            blip.setRoute(true);
            blip.setRouteColour(data.isStop ? 26 : 71);
        } catch (err) {
            mp.console(JSON.stringify(err));
        }
    }, timeout);
}
function deleteCheckpoint() {
    clearTimeout(checkpointTimer);
    if (!checkpoint) return;
    checkpoint.destroy();
    checkpoint = null;
    if (!blip) return;
    blip.destroy();
    blip = null;
}
// [30, 206, 255, 255] stop
// [255, 246, 0, 255] point