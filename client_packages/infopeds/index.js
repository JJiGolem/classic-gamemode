"use strict"

let peds = [
    {
        model: "a_m_m_bevhills_02",
        position: {
            x: -239.1190643310547,
            y: -343.98004150390625,
            z: 30.037139892578125,
        },
        heading: 50.666,
        defaultScenario: 'WORLD_HUMAN_HANG_OUT_STREET'
    },
    {
        model: "a_m_o_soucent_02",
        position: {
            x: 264.5687561035156,
            y: -1119.0252685546875,
            z: 29.342485427856445,
        },
        heading: 94.91204071044922,
        defaultScenario: 'WORLD_HUMAN_SMOKING'
    },
    {
        model: "a_m_m_business_01",
        position: {
            x: -192.1609344482422,
            y: -811.5452880859375,
            z: 30.454017639160156,
        },
        heading: 47.82609939575195,
        defaultScenario: 'WORLD_HUMAN_STAND_MOBILE_UPRIGHT_CLUBHOUSE'
    },
    {
        model: "ig_trafficwarden",
        position: {
            x: 1160.117919921875,
            y: -484.12921142578125,
            z: 65.7087631225586,
        },
        heading: 65.96830749511719,
        defaultScenario: 'WORLD_HUMAN_DRINKING'
    },
    {
        model: "ig_old_man1a",
        position: {
            x: -185.68223571777344,
            y: 6430.361328125,
            z: 31.915056228637695,
        },
        heading: 281.2537841796875,
        defaultScenario: 'WORLD_HUMAN_AA_SMOKE'
    },
    {
        model: "ig_russiandrunk",
        position: {
            x: 1952.59423828125,
            y: 3841.803955078125,
            z: 32.17793273925781,
        },
        heading: 296.3082275390625,
        defaultScenario: 'WORLD_HUMAN_AA_SMOKE'
    },
];

mp.events.add({
    "characterInit.done": () => {
        peds.forEach((current) => {
            mp.events.call('NPC.create', current);
        });
    },
    "infopeds.info.show": (show) => {
        if (show) {
            mp.callCEFV(`modal.showByName('newbie_help')`)
        } else {
            mp.callCEFV(`modal.show = false`)
        }
    }
});