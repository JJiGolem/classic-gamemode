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