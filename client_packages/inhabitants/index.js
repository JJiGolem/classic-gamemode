let inhabitants = [
    {
        model: "u_m_y_militarybum",
        position: {
            x: -2119.95849609375,
            y: -560.9780883789062,
            z: 1.6138005256652832
        },
        heading: 135.39381408691406,
        defaultScenario: 'WORLD_HUMAN_BUM_WASH'
    },
];

mp.events.add('characterInit.done', () => {
    inhabitants.forEach((current) => {
        mp.events.call('NPC.create', current);
    })
});
