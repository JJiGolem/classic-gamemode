let peds = [{
    model: "a_f_y_business_01",
    position: {
        x: -139.05726623535156,
        y: -633.8464965820312,
        z: 168.82054138183594,
        d: 1
    },
    heading: 9.959887504577637,
    defaultScenario: 'WORLD_HUMAN_STAND_MOBILE'
}
];

mp.events.add('characterInit.done', () => {
    peds.forEach((current) => {
        mp.events.call('NPC.create', current);
    })
});

mp.events.add('dmv.menu.show', (config) => {
    mp.busy.add('dmv.menu', false);
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["dmvMenu"])`);

    let i = 0;
    for (let key in config) {
        mp.callCEFV(`selectMenu.menu.items[${i}].values[0] = '$${config[key]}'`);
        i++;
    }
    mp.callCEFV(`selectMenu.show = true`);
});

mp.events.add('dmv.menu.close', () => {
    mp.busy.remove('dmv.menu');
    mp.callCEFV(`selectMenu.show = false`);
});

mp.events.add('dmv.license.buy.ans', (ans) => {
    mp.callCEFV('selectMenu.loader = false');
    switch (ans) {
        case 0:
            mp.notify.warning('У вас уже есть лицензия', 'Лицензии');
            break;
        case 1:
            mp.notify.success('Вы приобрели лицензию', 'Лицензии');
            break;
        case 2:
            mp.notify.error('Недостаточно денег', 'Лицензии');
            break;
        case 3:
            mp.notify.error('Ошибка покупки', 'Лицензии');
            break;
    }
});