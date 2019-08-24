// Модуль рыбалки

"use strict"

// "amb@world_human_stand_fishing@base base" - стоит
// "amb@world_human_stand_fishing@idle_a idle_a" - медленно крутит
// "amb@world_human_stand_fishing@idle_a idle_b" - медленно крутит и иногда тянет
// "amb@world_human_stand_fishing@idle_a idle_c" - быстро крутит и тянет (вытягивает рыбу)

let shape;
let fishingPlace = {
    x: 894.9740600585938,
    y: -179.16798400878906,
    z: 74.70034790039062,
    marker: {
        x: 895.3949584960938,
        y: -179.32843017578125,
        z: 73.50028686523438,
        color: [255, 255, 125, 200],
    }
}

module.exports = {
    init() {
        this.createFishingPlace();
    },
    createFishingPlace() {
        mp.blips.new(198, new mp.Vector3(fishingPlace.x, fishingPlace.y, fishingPlace.z),
        {
            name: `Таксопарк "Cuber"`,
            shortRange: true,
            color: 70
        });
        mp.markers.new(1, new mp.Vector3(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z), 0.4,
            {
                direction: new mp.Vector3(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z),
                rotation: 0,
                color: taxiStation.marker.color,
                visible: true,
                dimension: 0
            });
        shape = mp.colshapes.newSphere(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z + 1, 1.2);
        shape.pos = new mp.Vector3(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z);
        shape.isFishingPlace = true;
    }
}