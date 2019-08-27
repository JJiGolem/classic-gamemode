let routecreator = require('./busdriver/routecreator.js');

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


// [30, 206, 255, 255] stop
// [255, 246, 0, 255] point