let inhabitants = [{
    model: "ig_russiandrunk",
    position: {
        x: -522.1705932617188,
        y: -263.2584228515625,
        z: 35.48202133178711
    },
    heading: 205.48,
    defaultScenario: 'WORLD_HUMAN_MUSICIAN'
},
// {
//     model: "a_m_m_farmer_01",
//     position: {
//         x: -257.7437438964844,
//         y: -337.05328369140625,
//         z: 29.93291664123535
//     },
//     heading: 279.3279113769531,
//     defaultScenario: 'WORLD_HUMAN_BUM_FREEWAY'
// },
{
    model: "u_m_y_militarybum",
    position: {
        x: -2120.634033203125,
        y: -561.5369873046875,
        z: 1.3953653573989868
    },
    heading: 135.39381408691406,
    defaultScenario: 'WORLD_HUMAN_BUM_WASH'
},
];
//-2120.634033203125 -561.5369873046875 1.3953653573989868

mp.events.add('characterInit.done', () => {
    inhabitants.forEach((current) => {
        mp.events.call('NPC.create', current);
    })
});
