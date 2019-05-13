module.exports = {
    "farm.startJob": (player, index) => {
        if (!player.colshape || !player.colshape.farm) return player.utils.error(`Подойдите ближе!`);
        if (player.farmJob) return player.utils.error(`Вы уже работаете на ферме!`);
        var farm = player.colshape.farm;
        if (!farm.owner) return player.utils.error(`Ферма не имеет владельца!`);

        player.farmJob = {
            type: Math.clamp(index, 0, 3),
            pay: 0,
            farm: farm,
        };

        setFarmClothes(player, true, player.farmJob.type);
        player.utils.setLocalVar("farmJobType", player.farmJob.type);
        player.utils.success(`Вы начали работу на ферме!`);
        player.utils.info(`Ваша должность: ${mp.farms.getJobName(player.farmJob.type)}`);
    },

    "farm.stopJob": (player, isDied = false) => {
        if (!isDied && (!player.colshape || !player.colshape.farm)) return player.utils.error(`Подойдите ближе!`);
        if (!player.farmJob) return player.utils.error(`Вы не работаете на ферме!`);
        var farm = (isDied)? player.farmJob.farm : player.colshape.farm;
        if (farm.id != player.farmJob.farm.id) return player.utils.error(`Вы работаете на другой ферме!`);
        if (farm.balance < player.farmJob.pay) player.utils.warning(`На ферме недостаточно средств для оплаты труда! Обратитесь к владельцу фермы!`);
        else {
            farm.setBalance(farm.balance - player.farmJob.pay);
            player.utils.setMoney(player.money + player.farmJob.pay);
        }

        // player.call("clearCropCp");
        setFarmClothes(player, false);
        player.utils.setLocalVar("farmJobType", null);
        player.utils.success(`Вы закончили работу на ферме!`);
        player.utils.putObject();
        if (player.farmJob.tractorColshape) {
            player.call("checkpoint.clearForTractor");
            player.farmJob.tractorColshape.destroy();
        }
        delete player.farmJob;
    },

    "farm.warehouse.takeGrain": (player, data) => {
        // debug(`farm.warehouse.takeGrain: ${player.name} ${data}`)
        /*player.farmJob = {
            farm: mp.farms[0],
            type: 2,
            pay: 0
        }; //for test*/
        data = JSON.parse(data);
        var fieldId = data[0];
        var grainType = Math.clamp(data[1], 0, 3);

        if (!player.colshape || !player.colshape.warehouse) return player.utils.error(`Подойдите ближе!`);
        if (!player.farmJob) return player.utils.error(`Вы не работаете на ферме!`);
        var farm = player.colshape.farm;
        if (!farm.owner) return player.utils.error(`Ферма не имеет владельца!`);
        var jobName = mp.farms.getJobName(player.farmJob.type);
        if (player.farmJob.type != 2) return player.utils.error(`Вы не занимаете должность: ${jobName}`);
        var farmField = mp.farmFields.getBySqlId(fieldId);
        if (!farmField) return player.utils.error(`Поле не найдено!`);
        if (farmField.farmId != farm.sqlId) return player.utils.error(`Поле принадлежит другой ферме!`);
        if (farmField.count > 0) return player.utils.error(`Поле уже засеяно!`);
        var veh = mp.farms.getNearTractor(player.position, 5);
        if (!veh) return player.utils.error(`Подгоните трактор!`);

        var count = veh.products.maxCount - veh.products.count;
        if (!count) player.utils.error(`Трактор заполнен!`);
        else {
            if (count > farm.grains) return player.utils.error(`На ферме недостаточно зерна!`);
            farm.setGrains(farm.grains - count);

            veh.products.type = grainType;
            veh.products.count += count;
            // player.utils.success(`Зерно в тракторе: ${veh.products.count} / ${veh.products.maxCount} ед.`);
        }

        if (veh.products.count > 0) {
            farmField.startFilling(player, veh);
        }

    },

    "farm.field.takeCrop": (player, objId) => {
        // debug(`farm.field.takeCrop: ${player} ${objId}`);
        if (player.getVariable("knockDown")) return;
        var object = mp.objects.at(objId);
        if (!object || !object.field) {
            mp.objects.forEachInRange(player.position, 4, (obj) => {
                if (obj.field) {
                    objId = obj.id;
                    object = obj;
                }
            });
            if (!object || !object.field) return player.utils.error(`Урожай не найден!`);
        }
        var field = object.field;
        if (field.state != 3) return player.utils.error(`Урожай не созрел!`);

        if (!player.farmJob) return player.utils.error(`Вы не работаете на ферме!`);
        if (field.farmId != player.farmJob.farm.sqlId) return player.utils.error(`Поле принадлежит другой ферме!`);
        var jobName = mp.farms.getJobName(player.farmJob.type);
        if (player.farmJob.type != 0 && player.farmJob.type != 1) return player.utils.error(`Должность ${jobName} не занимается сбором урожая!`);

        player.utils.takeObject("prop_cs_trowel");
        var playerId = player.id;
        let locktime = mp.economy["wait_farm_crop_time"].value; // Последний: 9
        if (locktime > 2147483647) {
          let uselogtext = `TIMEOUT ERROR | CODE: 9 | TIME: ${locktime}`;
          player.utils.error(uselogtext);
          console.log(uselogtext);
          DB.Handle.query("INSERT INTO timeout_log (log) VALUES (?)", uselogtext);
          return;
        }
        setTimeout(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec) return;
                if (rec.getVariable("knockDown") || !rec.farmJob) return;
                var obj = mp.objects.at(objId);
                if (!obj) {
                    player.utils.putObject();
                    return player.utils.error(`В этой части поля урожая больше нет!`);
                }
                var models = ["prop_veg_crop_03_pump", "prop_veg_crop_03_pump", "prop_veg_crop_03_cab", "prop_weed_02"];
                rec.utils.takeObject(models[field.cropType]);

                obj.count--;
                field.setCount(field.count - 1);
                if (obj.count <= 0) {
                    field.objects.splice(field.objects.indexOf(obj), 1);
                    obj.destroy();
                }
                rec.farmJob.pay += rec.farmJob.farm.pay;
                // rec.utils.info(`Заработано: ${rec.farmJob.pay}$`);
            } catch (e) {
                console.log(e);
            }
        }, locktime);
    },

    "farm.warehouse.unloadCrop": (player) => {
        // debug(`far.warehouse.unloadCrop: ${player.name}`)
        if (!player.colshape || !player.colshape.warehouse) return player.utils.error(`Подойдите ближе!`);
        if (!player.farmJob) return player.utils.error(`Вы не работаете на ферме!`);
        var farm = player.colshape.farm;
        if (!farm.owner) return player.utils.error(`Ферма не имеет владельца!`);
        var jobName = mp.farms.getJobName(1);
        if (player.farmJob.type != 1) return player.utils.error(`Вы не занимаете должность: ${jobName}`);

        var veh = mp.farms.getNearPickup(player.position, 5);
        if (!veh) return player.utils.error(`Подгоните фермерский пикап!`);
        if (!veh.crop || veh.crop.count <= 0) return player.utils.error(`Пикап пустой!`);


        if (veh.crop.type == 1) {
            var count = Math.clamp(veh.crop.count, 0, 2000 - farm.pumpkins);
            farm.setPumpkins(farm.pumpkins + count);
        } else if (veh.crop.type == 2) {
            var count = Math.clamp(veh.crop.count, 0, 2000 - farm.cabbages);
            farm.setCabbages(farm.cabbages + count);
        } else if (veh.crop.type == 3) {
            var count = Math.clamp(veh.crop.count, 0, 2000 - farm.weeds);
            farm.setWeeds(farm.weeds + count);
        }

        veh.crop.count -= count;
        player.utils.success(`Урожай выгружен: ${count} ед.`);
        if (veh.crop.count > 0) player.utils.info(`${veh.crop.count} ед. урожая не вместилось на склад!`);

        var pay = farm.pay * mp.economy["farm_farmer_pay"].value * (count / 200);
        pay = parseInt(pay);
        if (farm.balance < pay) player.utils.warning(`На ферме недостаточно средств для оплаты труда! Обратитесь к владельцу фермы!`);
        else {
            farm.setBalance(farm.balance - pay);
            player.utils.setMoney(player.money + pay);
        }
        setVehCropLoad(veh, true);
        if (veh.crop.count <= 0) delete veh.crop;
    }
}

function setFarmClothes(player, enable, job) {
    if (enable) {
        player.body.clearItems();
        player.body.denyUpdateView = true;
        var textures = [6,0,8,4];
        if (player.sex == 1) {
            var torsos = [41, 63, 74];
            var torso = torsos[mp.randomInteger(0, torsos.length - 1)];
            player.setProp(0, 13, 1);
            player.setClothes(11, 56, 0, 0);
            player.setClothes(3, torso, 0, 0);
            player.setClothes(4, 90, textures[job], 0);
            player.setClothes(6, 51, 4, 0);
        } else {
            var torsos = [72, 85, 114];
            var torso = torsos[mp.randomInteger(0, torsos.length - 1)];
            player.setProp(0, 20, 0);
            player.setClothes(11, 0, 0, 0);
            player.setClothes(3, torso, 0, 0);
            player.setClothes(4, 93, textures[job], 0);
            player.setClothes(6, 64, 2, 0);
        }
    } else {
        // TODO: Clear Clothes.

        delete player.body.denyUpdateView;
        player.body.loadItems();
    }
}

global.setVehCropLoad = (vehicle, update = false) => {
    if (!vehicle.crop) return;
    if (!mp.isFarmVehicle(vehicle)) return;
    if (vehicle.crop.count % 2 == 0 || vehicle.crop.count == 200 || update)
        vehicle.setVariable("cropLoad", parseInt(vehicle.crop.count / 2))
}
