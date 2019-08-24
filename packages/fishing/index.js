// Модуль рыбалки

"use strict"

// "amb@world_human_stand_fishing@base base" - стоит
// "amb@world_human_stand_fishing@idle_a idle_a" - медленно крутит
// "amb@world_human_stand_fishing@idle_a idle_b" - медленно крутит и иногда тянет
// "amb@world_human_stand_fishing@idle_a idle_c" - быстро крутит и тянет (вытягивает рыбу)

let shape;
let fishingPlace = {
    x: -1850.4912744140625,
    y: -1242.1881591796875,
    z: 8.615778923034668,
    marker: {
        x: -1850.1712744140625,
        y: -1241.8881591796875,
        z: 7.415778923034668,
        color: [255, 255, 125, 200],
    }
}

module.exports = {
    init() {
        this.createFishingPlace();
    },
    createFishingPlace() {
        mp.blips.new(68, new mp.Vector3(fishingPlace.x, fishingPlace.y, fishingPlace.z),
        {
            name: `"Рыбалка"`,
            shortRange: true,
            color: 26
        });
        mp.markers.new(1, new mp.Vector3(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z), 0.4,
            {
                direction: new mp.Vector3(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z),
                rotation: 0,
                color: fishingPlace.marker.color,
                visible: true,
                dimension: 0
            });
        shape = mp.colshapes.newSphere(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z + 1, 1.2);
        shape.pos = new mp.Vector3(fishingPlace.marker.x, fishingPlace.marker.y, fishingPlace.marker.z);
        shape.isFishingPlace = true;
    }
}