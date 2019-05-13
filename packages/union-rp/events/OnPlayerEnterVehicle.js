module.exports = {
    "playerEnterVehicle": (player, vehicle, seat) => {
        clearVehSpawnTimer(vehicle);
        if (seat == -1) { // водительское место
            if (!haveLicense(player, vehicle)) {
                player.removeFromVehicle();
                return player.utils.error(`Вам необходима ${mp.getLicName(vehicle.license)}!`);
            }
            if (mp.isFactionVehicle(vehicle) && player.admin <= 0) {
                if (player.faction != vehicle.owner) {
                    player.removeFromVehicle();
                    return player.utils.error(`Вы не состоите в ${mp.factions.getBySqlId(vehicle.owner).name}`);
                } else if (vehicle.dbData.rank && vehicle.dbData.rank > player.rank) {
                    player.removeFromVehicle();
                    return player.utils.error(`Необходим ранг: ${mp.factions.getRankName(player.faction, vehicle.dbData.rank)}`);
                }
            } else if (mp.isJobVehicle(vehicle) && player.admin <= 0) {
                if (player.job != -vehicle.owner) {
                    player.removeFromVehicle();
                    var job = mp.jobs.getBySqlId(-vehicle.owner);
                    if (!job) return player.utils.error(`Работа с ID: ${-vehicle.owner} не найдена!`);
                    return player.utils.error(`Вы не ${job.name}`);
                } else onEnterJobVehHandler(player, vehicle);
            } else if (mp.isFarmVehicle(vehicle) && player.admin <= 0) {
                /*player.farmJob = {
                    farm: mp.farms[0],
                    type: 1,
                    pay: 0
                }; //for test*/

                if (!player.farmJob) {
                    player.removeFromVehicle();
                    return player.utils.error(`Вы не работаете на ферме!`);
                }
                if (player.farmJob.farm.sqlId != -vehicle.owner - 3000) {
                    player.removeFromVehicle();
                    return player.utils.error(`Вы работаете на другой ферме!`);
                }
                var jobType = mp.farms.getJobTypeByModel(vehicle.name);
                var jobName = mp.farms.getJobName(jobType);
                if (jobType != player.farmJob.type) {
                    player.removeFromVehicle();
                    return player.utils.error(`Необходимо иметь должность на ферме: ${jobName}`);
                }
                if (jobType == 1) { // фермер
                    player.call(`selectMenu.show`, [`farm_crop_loading`]);
                } else if (jobType == 2) { // тракторист
                    if (!vehicle.products.count) player.utils.info(`Загрузить зерно возможно у склада`);
                    player.utils.info(`Зерно: ${vehicle.products.count} / ${vehicle.products.maxCount} ед.`);
                }
            }
            if (!vehicle.getVariable("engine")) player.call("prompt.showByName", ["vehicle_engine"]);
            for (var key in vehicle.vehPropData) {
                player.call("setVehicleVar", [vehicle, key, vehicle.vehPropData[key]]);
            }
            checkPlayerGangwar(player, vehicle);
            vehicle.player = player;
        } else {
            player.call("setVehicleVar", [vehicle, "radio", vehicle.vehPropData.radio]);
        }
    }
}

function haveLicense(player, vehicle) {
    if (!vehicle.license) return true;
    var docs = player.inventory.getArrayByItemId(16);
    for (var key in docs) {
        if (!docs[key].params || !docs[key].params.licenses) return false;
        if (docs[key].params.licenses.indexOf(vehicle.license) != -1) return true;
    }
    return false;
}

mp.isFactionVehicle = (vehicle) => {
    return vehicle.owner > 0 && vehicle.owner < 101;
}

mp.isJobVehicle = (vehicle) => {
    return vehicle.owner > -101 && vehicle.owner < 0;
}

mp.isOwnerVehicle = (vehicle) => {
    return vehicle.owner > 1000;
}

mp.isNewbieVehicle = (vehicle) => {
    return vehicle.owner == -1001;
}

mp.isLicVehicle = (vehicle) => {
    return vehicle.owner == -2001;
}

mp.isFarmVehicle = (vehicle) => {
    return vehicle.owner >= -4000 && vehicle.owner <= -3001;
}

/* Игрок сел в рабочее авто своей работы. */
function onEnterJobVehHandler(player, vehicle) {
    var handlers = {
        5: (player, vehicle) => { // дальнобойщик
            if (vehicle.rentPlayerId == null) {
                var skill = mp.trucker.getSkill(player.jobSkills[5 - 1]);
                if (skill.level < mp.trucker.getMinLevel(vehicle.name)) {
                    player.removeFromVehicle();
                    return player.utils.error(`Навык дальнобойщика мал!`);
                }
                vehicle.rentPlayerId = player.id;
                player.rentVehicleId = vehicle.id;
                return player.utils.info(`Вы арендовали фуру для теста!`);
            }
            if (vehicle.rentPlayerId != player.id) return player.utils.error(`Это не Ваша фура!`);
        },
    };
    if (handlers[player.job]) handlers[player.job](player, vehicle);
}

function clearVehSpawnTimer(vehicle) {
    if (vehicle.spawnTimerId) {
        clearTimeout(vehicle.spawnTimerId);
        delete vehicle.spawnTimerId;
    }
}

function checkPlayerGangwar(player, vehicle) {
    var gangwar = player.getVariable("gangwar");
    if (gangwar && player.seat == -1) vehicle.setVariable("gangwar", gangwar);
}
