let peds = [{
    model: "a_m_m_hillbilly_01",
    position: {
        x: 541.69775390625,
        y: -192.27578735351562,
        z: 54.48133850097656
    },
    heading: 38.72,
    marker: {
        x: 541.351318359375,
        y: -191.85520935058594,
        z: 53.34,
        color: [255, 255, 125, 120],
        eventName: "carservice.shape.enter"
    },
    defaultScenario: 'WORLD_HUMAN_SMOKING'
},
{
    model: "a_m_m_hillbilly_01",
    position: {
        x: 488.8618469238281,
        y: -1318.2044677734375,
        z: 29.219741821289062
    },
    heading: 290.9831237792969,
    marker: {
        x: 489.3613586425781,
        y: -1318.0531005859375,
        z: 28.090497360229492,
        color: [255, 255, 125, 128],
        eventName: "carservice.shape.enter"
    },
    defaultScenario: 'WORLD_HUMAN_AA_SMOKE'
},
{
    model: "a_m_m_hillbilly_01",
    position: {
        x: -229.68690490722656,
        y: -1377.2591552734375,
        z: 31.258243560791016
    },
    heading: 212.7614288330078,
    marker: {
        x: -229.38626098632812,
        y: -1377.6666259765625,
        z: 30.118222579956055,
        color: [255, 255, 125, 128],
        eventName: "carservice.shape.enter"
    },
    defaultScenario: 'WORLD_HUMAN_AA_COFFEE'
},
]

mp.events.add('characterInit.done', () => {
    peds.forEach((current) => {
        mp.events.call('NPC.create', current);
    })
});

mp.events.add('carservice.shape.enter', () => {
    mp.events.callRemote('carservice.shape.enter');
});

mp.events.add('carservice.jobmenu.show', () => {
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["carServiceJobMenu"])`);
    mp.callCEFV(`selectMenu.show = true`);
});