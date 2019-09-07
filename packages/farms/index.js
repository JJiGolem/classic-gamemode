"use strict";

let inventory = call('inventory');
let utils = call('utils');

module.exports = {
    // Фермы
    farms: [],
    // Маркеры ферм
    markers: [],
    // Блипы ферм
    blips: [],
    // Должности
    jobNames: ["Рабочий", "Фермер", "Тракторист", "Пилот"],

    async init() {
        await this.loadFarmsFromDB();
        this.initFarmMarkers();
    },
    async loadFarmsFromDB() {
        var dbFarms = await db.Models.Farm.findAll({
            include: [{
                model: db.Models.FarmField,
                as: "fields"
            }]
        });
        this.farms = dbFarms;
        console.log(`[FARMS] Фермы загужены (${dbFarms.length} шт.)`);
    },
    initFarmMarkers() {
        for (var i = 0; i < this.farms.length; i++) {
            var farm = this.farms[i];
            this.createFarmMarker(farm);
            this.initFarmWarehouse(farm);
            this.initFarmLabels(farm);
        }
    },
    createFarmMarker(farm) {
        var pos = new mp.Vector3(farm.x, farm.y, farm.z - 1);
        var marker = mp.markers.new(1, pos, 0.5, {
            color: [255, 187, 0, 70]
        });
        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            player.call(`selectMenu.show`, [`farm`]);
            player.farm = farm;
        };
        colshape.onExit = (player) => {
            player.call(`selectMenu.hide`);
            delete player.farm;
        };
        marker.colshape = colshape;
        this.markers.push(marker);
        this.blips.push(mp.blips.new(88, pos, {
            color: 60,
            name: `Ферма #${farm.id}`,
            shortRange: 10,
            scale: 1
        }));
    },
    initFarmWarehouse(farm) {

    },
    initFarmLabels(farm) {

    },
    setJobClothes(player, enable, job) {
        if (enable) {
            inventory.clearAllView(player);
            player.inventory.denyUpdateView = true;
            var textures = [6, 0, 8, 4];
            if (player.character.gender == 0) {
                var torsos = [41, 63, 74];
                var torso = torsos[utils.randomInteger(0, torsos.length - 1)];
                player.setProp(0, 13, 1);
                player.setClothes(11, 56, 0, 0);
                player.setClothes(3, torso, 0, 0);
                player.setClothes(4, 90, textures[job], 0);
                player.setClothes(6, 51, 4, 0);
            } else {
                var torsos = [72, 85, 114];
                var torso = torsos[utils.randomInteger(0, torsos.length - 1)];
                player.setProp(0, 20, 0);
                player.setClothes(11, 0, 0, 0);
                player.setClothes(3, torso, 0, 0);
                player.setClothes(4, 93, textures[job], 0);
                player.setClothes(6, 64, 2, 0);
            }
        } else {
            // TODO: Clear Clothes.
            player.inventory.denyUpdateView = false;
            inventory.clearAllView(player);
            inventory.updateAllView(player);
        }
    },
    getJobName(jobType) {
        jobType = Math.clamp(jobType, 0, this.jobNames.length - 1);
        return this.jobNames[jobType];
    },
};
