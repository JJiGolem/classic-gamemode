let farms = call('farms');
let money = call('money');
let notifs = call('notifications');
let routes = call('routes');

module.exports = {
    "init": () => {
        farms.init();
    },
    "farms.buy": (player) => {
        var header = `Покупка фермы`;
        var out = (text) => {
            player.call(`selectMenu.loader`, [false]);
            notifs.error(player, text, header);
        };
        if (!player.farm) return out(`Вы не у фермы`);
        if (player.farm.playerId) return out(`Ферма уже имеет хозяина`);
        var farm = player.farm;
        if (player.character.cash < farm.price) return out(`Необходимо $${farm.price}`);

        money.removeCash(player, farm.price, (res) => {
            if (!res) return out(`Ошибка списания наличных`);
            farm.playerId = player.character.id;
            farm.owner = player.character;
            farm.save();
            notifs.success(player, `Ферма #${farm.id} куплена`, header);
            notifs.warning(player, `Пополните балансы фермы`, header);
            player.call(`selectMenu.loader`, [false]);
            player.call(`selectMenu.hide`);
        });
    },
    "farms.sell.state": (player) => {
        var header = `Продажа фермы`
        var out = (text) => {
            player.call(`selectMenu.loader`, [false]);
            notifs.error(player, text, header);
        };
        if (!player.farm) return out(`Вы не у фермы`);
        if (player.farm.playerId != player.character.id) return out(`Вы не хозяин фермы`);
        var farm = player.farm;
        var price = parseInt(farm.price * farms.farmSellK + farm.balance + farm.taxBalance);
        money.addCash(player, price, (res) => {
            if (!res) return out(`Ошибка зачисления наличных`);
            farm.playerId = null;
            farm.owner = null;
            farm.balance = 0;
            farm.taxBalance = 0;
            farm.save();
            notifs.success(player, `Ферма продана в штат`, header);
            player.call(`selectMenu.loader`, [false]);
            player.call(`selectMenu.hide`);
        });
    },
    "farms.sell.player": (player, data) => {
        data = JSON.parse(data);
        console.log(`farms.sell.player: ${player.name}`)
        console.log(data);
    },
    "farms.job.start": (player, index) => {
        var header = `Работа на ферме`
        if (!player.farm) return notifs.error(player, `Вы не у фермы`, header);
        if (player.farmJob) return notifs.error(player, `Увольтесь, чтобы сменить должность`, header);
        if (!player.farm.playerId) return notifs.error(player, `Ферма не имеет хозяина`, header);

        player.farmJob = {
            type: Math.clamp(index, 0, 3),
            pay: 0,
            farm: player.farm,
        };

        if (player.farmJob.type == 0) player.call(`prompt.showByName`, ["farm_job"]);

        farms.setJobClothes(player, true, player.farmJob.type);
        player.call("farms.jobType.set", [player.farmJob.type]);
        notifs.success(player, `Вы начали работу (${farms.getJobName(player.farmJob.type)})`, header);
    },
    "farms.job.stop": (player, isDied = false) => {
        var header = `Завершение работы`;
        if (!isDied && (!player.farm)) return notifs.error(player, `Вы не у фермы`, header);
        if (!player.farmJob) return notifs.error(player, `Вы не работаете на ферме`, header);

        var farm = player.farmJob.farm;
        if (farm.id != player.farm.id) return notifs.error(player, `Вы работаете на другой ферме`, header);

        if (farm.balance < player.farmJob.pay) notifs.warning(player, `Баланс фермы не позволяет вам выплатить заплату`, header);
        else {
            farm.balance -= player.farmJob.pay;
            farm.save();
            money.addCash(player, player.farmJob.pay);
        }

        farms.setJobClothes(player, false);
        player.addAttachment("farmProductA", true);
        player.addAttachment("farmProductB", true);
        player.addAttachment("farmProductC", true);
        player.call("farms.jobType.set", [null]);
        player.call("routes.checkpoints.destroy");
        notifs.success(player, `Удачного дня!`, header);

        delete player.farmJob;
    },
    "farms.field.crop.take": (player, objId) => {
        // console.log(`farms.field.crop.take: ${player.name} ${objId}`)
        var header = `Сбор урожая`;
        var object = mp.objects.at(objId);
        if (!object || !object.field) {
            mp.objects.forEachInRange(player.position, 4, (obj) => {
                if (obj.field) {
                    objId = obj.id;
                    object = obj;
                }
            });
            if (!object || !object.field) return notifs.error(player, `Урожай не найден`, header);
        }
        var field = object.field;
        if (field.state != null && field.state != 3) return notifs.error(player, `Урожай не созрел`, header);

        if (!player.farmJob) return notifs.error(player, `Вы не работаете на ферме`, header);
        if (field.farmId != player.farmJob.farm.id) return notifs.error(player, `Поле принадлежит другой ферме`, header);
        var jobName = farms.getJobName(player.farmJob.type);
        if (player.farmJob.type != 0 && player.farmJob.type != 1) return notifs.error(player, `Для должности ${jobName} недоступно`, header);
        if (player.hasAttachment("farmTrowel")) return notifs.error(player, `Вы уже собираете урожай`, header);
        player.addAttachment("farmTrowel");
        var playerId = player.id;
        var characterId = player.character.id;
        setTimeout(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || rec.character.id != characterId) return;
                // TODO: проверка на присмерти
                if (!rec.farmJob) return;
                var obj = mp.objects.at(objId);
                rec.addAttachment("farmTrowel", true);
                if (!obj || !obj.field) {
                    return notifs.error(rec, `В этой части поля урожай уже собран`, header);
                }
                var names = ["farmProductA", "farmProductA", "farmProductB", "farmProductC"];
                player.addAttachment(names[field.type]);
                player.call(`farms.isCropping.end`);

                obj.count--;
                obj.field.count--;
                if (obj.count <= 0) {
                    var list = farms.fieldObjects[obj.field.id];
                    var i = list.indexOf(obj);
                    list.splice(i, 1);
                    if (!list.length) obj.field.count = 0;
                    obj.destroy();
                }
                if (obj.field.count % 20 == 0) obj.field.save();
            } catch (e) {
                console.log(e);
            }
        }, farms.takeCropTime);
    },
    "farms.vehicle.products.put": (player, vehId) => {
        // console.log(`farms.vehicle.products.put: ${player.name}`);
        var header = `Загрузка урожая`;
        var veh = mp.vehicles.at(vehId);
        if (!veh) return notifs.error(player, `Авто #${player.bootVehicleId} не найдено`, header);
        if (!veh.db || veh.db.key != "farm") return notifs.error(player, `Авто не принадлежит ферме`, header);
        if (player.dist(veh.position) > 10) return notifs.error(player, `Авто далеко`, header);
        var prodType;
        if (player.hasAttachment("farmProductA")) {
            player.addAttachment("farmProductA", true);
            prodType = 1;
        } else if (player.hasAttachment("farmProductB")) {
            player.addAttachment("farmProductB", true);
            prodType = 2;
        } else if (player.hasAttachment("farmProductC")) {
            player.addAttachment("farmProductC", true);
            prodType = 3;
        } else return notifs.error(player, `Соберите урожай на поле`, header);
        if (veh.products && veh.products.type != prodType) return notifs.error(player, `Неверный типа урожая`, header);
        if (veh.products && veh.products.count >= 200) return notifs.error(player, `Пикап заполнен`, header);
        farms.addVehicleProducts(veh, prodType);

        if (!player.farmJob) return notifs.error(player, `Вы не работаете`, header);
        if (player.farmJob.farm.id != veh.db.owner) return notifs.error(player, `Вы работаете на другой ферме`, header);

        player.farmJob.pay += player.farmJob.farm.pay;
        notifs.info(player, `Заработано $${player.farmJob.pay}`, header);
    },
    "farms.warehouse.products.fill": (player) => {
        var header = `Выгрузка урожая`;
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "farm") return notifs.error(player, `Необходимо находиться в фермерском пикапе`, header);
        if (!player.farm) return notifs.error(player, `Вы далеко`, header);
        if (!player.farmJob) return notifs.error(player, `Вы не работаете на ферме`, header);
        if (player.farmJob.farm.id != player.farm.id) return notifs.error(player, `Вы работаете на другой ферме`, header);
        if (player.farmJob.type != 1) {
            var jobName = farms.getJobName(player.farmJob.type);
            return notifs.error(player, `Для должности ${jobName} недоступно`, header);
        }
        if (!veh.products || !veh.products.count) return notifs.error(player, `Пикап пустой`, header);
        var names = ["productA", "productB", "productC"];
        if (veh.products.type < 1 || veh.products.type > names.length) return notifs.error(player, `Не подходящее содержимое пикапа`, header);
        var key = names[veh.products.type - 1];
        var farm = player.farm;

        var count = Math.clamp(veh.products.count, 0, farms.productsMax - farm[key]);
        farm[key] += count;
        farm.save();
        veh.products.count -= count;
        veh.setVariable("farmProductsState", parseInt(veh.products.count / 33));
        if (veh.products.count) notifs.info(player, `Склад заполнен. ${veh.products.count} ед. урожая осталось в пикапе`, header);
        else {
            veh.setVariable("label", null);
            delete veh.products;
        }
        var pay = parseInt(farm.farmerPay * (count / 200));
        if (farm.balance < pay) notifs.warning(player, `Баланс фермы не позволяет вам выплатить заплату`, header);
        else {
            farm.balance -= pay;
            farm.save();
            money.addCash(player, pay);
        }
        notifs.success(player, `Разгружено ${count} ед. урожая. Премия $${pay}`, header);
    },
    "farms.warehouse.grains.take": (player, data) => {
        data = JSON.parse(data);
        var header = `Загрузка зерна`;
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "farm") return notifs.error(player, `Необходимо находиться в тракторе`, header);
        if (!player.farm) return notifs.error(player, `Вы далеко`, header);
        if (!player.farmJob) return notifs.error(player, `Вы не работаете на ферме`, header);
        if (player.farmJob.farm.id != player.farm.id) return notifs.error(player, `Вы работаете на другой ферме`, header);
        if (player.farmJob.type != 2) {
            var jobName = farms.getJobName(player.farmJob.type);
            return notifs.error(player, `Для должности ${jobName} недоступно`, header);
        }
        if (veh.products && veh.products.count) return notifs.error(player, `Трактор уже загружен`, header);
        var farm = player.farm;
        if (data.field < 0 || data.field >= farm.fields.length) return notifs.error(player, `Поле #${data.field} не найдено`, header);
        var field = farm.fields[data.field];
        if (!field) return notifs.error(player, `Поле #${data.field} не найдено`, header);
        if (field.count) return notifs.error(player, `Поле #${data.field} уже засеяно`, header);
        var count = 600;
        if (farm.grains < count) return notifs.error(player, `Недостаточно для загрузки`, header);

        farm.grains -= count;
        farm.save();
        if (!veh.products) veh.products = {};
        veh.products.type = data.grain + 1;
        veh.products.count = count;
        veh.setVariable("label", `${count} из 600 ед.`);

        var points = farms.getFillingPoints(field);
        routes.checkpointData.scale = 4;
        routes.start(player, points, () => {
            var veh = player.vehicle;
            if (!veh || !veh.db || veh.db.key != "farm") {
                notifs.error(player, `Необходимо находиться в тракторе`, header);
                return false;
            }
            if (!player.farmJob) {
                notifs.error(player, `Вы не работаете на ферме`, header);
                return false;
            }
            veh.products.count -= parseInt(600 / points.length);
            veh.setVariable("label", `${veh.products.count} из 600 ед.`);
            return true;
        }, () => {
            var pay = farm.tractorPay;
            if (farm.balance < pay) notifs.warning(player, `Баланс фермы не позволяет вам выплатить заплату`, header);
            else {
                farm.balance -= pay;
                farm.save();
                money.addCash(player, pay);
            }
            notifs.success(player, `Полея засеяно. Премия $${pay}`, header);
            farms.fillField(field, veh.products.type);
            veh.setVariable("label", null);
            delete veh.products;
        });

        notifs.success(player, `Загружено ${count} ед. урожая`, header);
        notifs.info(player, `Отправляйтесь на посев поля`, header);
    },
    "farms.soilsWarehouse.take": (player) => {
        var header = `Загрузка удобрения`;
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "farm") return notifs.error(player, `Необходимо находиться в самолете`, header);
        if (!player.farm) return notifs.error(player, `Вы далеко`, header);
        if (!player.farmJob) return notifs.error(player, `Вы не работаете на ферме`, header);
        if (player.farmJob.farm.id != player.farm.id) return notifs.error(player, `Вы работаете на другой ферме`, header);
        if (player.farmJob.type != 3) {
            var jobName = farms.getJobName(player.farmJob.type);
            return notifs.error(player, `Для должности ${jobName} недоступно`, header);
        }
        if (veh.soils && veh.soils.count) return notifs.error(player, `Самолет уже загружен`, header);
        var farm = player.farm;
        var count = 200;
        if (farm.soils < count) return notifs.error(player, `Недостаточно для загрузки`, header);

        farm.soils -= count;
        farm.save();
        if (!veh.soils) veh.soils = {};
        veh.soils.count = count;

        var points = farms.getPilotPoints(farm);
        routes.checkpointData.scale = 4;
        routes.start(player, points, () => {
            var veh = player.vehicle;
            if (!veh || !veh.db || veh.db.key != "farm") {
                notifs.error(player, `Необходимо находиться в самолете`, header);
                return false;
            }
            if (!player.farmJob) {
                notifs.error(player, `Вы не работаете на ферме`, header);
                return false;
            }
            return true;
        }, () => {
            var pay = farm.pilotPay;
            if (farm.balance < pay) notifs.warning(player, `Баланс фермы не позволяет вам выплатить заплату`, header);
            else {
                farm.balance -= pay;
                farm.save();
                money.addCash(player, pay);
            }
            notifs.success(player, `Урожай полей увеличился. Премия $${pay}`, header);
            farms.soilFields(farm);
            delete veh.soils;
        });

        notifs.success(player, `Загружено ${count} ед. удобрения`, header);
        notifs.info(player, `Отправляйтесь на орошение полей`, header);
    },
    "farms.grains.price.set": (player, val) => {
        var header = `Цена на зерно`
        if (!player.farm) return notifs.error(player, `Вы не у фермы`, header);
        if (player.farm.playerId != player.character.id) return notifs.error(player, `Вы не хозяин фермы`, header);
        if (val < 0 || val > farms.priceMax) return notifs.error(player, `Не более $${farms.priceMax}`, header);
        var farm = player.farm;
        farm.grainPrice = val;
        farm.save();
        notifs.success(player, `Цена $${farm.grainPrice} установлена`, header);
    },
    "farms.soils.price.set": (player, val) => {
        var header = `Цена на удобрение`
        if (!player.farm) return notifs.error(player, `Вы не у фермы`, header);
        if (player.farm.playerId != player.character.id) return notifs.error(player, `Вы не хозяин фермы`, header);
        if (val < 0 || val > farms.priceMax) return notifs.error(player, `Не более $${farms.priceMax}`, header);
        var farm = player.farm;
        farm.soilPrice = val;
        farm.save();
        notifs.success(player, `Цена $${farm.soilPrice} установлена`, header);
    },
    "farms.crops.price.set": (player, data) => {
        data = JSON.parse(data);
        var header = `Цена на удобрение`
        if (!player.farm) return notifs.error(player, `Вы не у фермы`, header);
        if (player.farm.playerId != player.character.id) return notifs.error(player, `Вы не хозяин фермы`, header);
        if (data.price < 0 || data.price > farms.priceMax) return notifs.error(player, `Не более $${farms.priceMax}`, header);
        var names = ["productAPrice", "productBPrice", "productCPrice"];
        var farm = player.farm;
        farm[names[data.field]] = data.price;
        farm.save();
        notifs.success(player, `Цена $${farm[names[data.field]]} установлена`, header);
    },
    "farms.balance.set": (player, data) => {
        data = JSON.parse(data);
        var header = `Баланс фермы`;
        var out = (text) => {
            player.call(`selectMenu.loader`, [false]);
            notifs.error(player, text, header);
        };
        if (!player.farm) return out(`Вы не у фермы`);
        if (player.farm.playerId != player.character.id) return out(`Вы не хозяин фермы`);
        var key = ["balance", "taxBalance"][data.balance];
        var farm = player.farm;
        if (farm[key] == data.sum) return out(`Баланс уже $${data.sum}`);
        if (farm[key] < data.sum) { // пополнить баланс
            data.sum -= farm[key];
            if (player.character.cash < data.sum) return out(`Необходимо $${data.sum}`);
            money.removeCash(player, data.sum, (res) => {
                if (!res) return out(`Ошибка списания наличных`);
                farm[key] += data.sum;
                farm.save();
                notifs.success(player, `Баланс пополнен`, header);
                player.call(`selectMenu.loader`, [false]);
            });
        } else { // снять с баланса
            data.sum = farm[key] - data.sum;
            if (farm[key] < data.sum) return out(`Необходимо $${data.sum} на балансе`);
            money.addCash(player, data.sum, (res) => {
                if (!res) return out(`Ошибка зачисления наличных`);
                farm[key] -= data.sum;
                farm.save();
                notifs.success(player, `Наличные сняты`, header);
                player.call(`selectMenu.loader`, [false]);
            });
        }
    },
    "farms.pay.set": (player, data) => {
        data = JSON.parse(data);
        var header = `Зарплата на ферме`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (!player.farm) return out(`Вы не у фермы`);
        if (player.farm.playerId != player.character.id) return out(`Вы не хозяин фермы`);
        var key = ["pay", "farmerPay", "tractorPay", "pilotPay"][data.job];
        var farm = player.farm;
        if (data.sum < 0 || data.sum > farms.payMax) return out(`Не более $${data.sum}`);

        farm[key] = data.sum;
        farm.save();
        notifs.success(player, `Зарплата $${farm[key]} установлена`, header);
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (!vehicle.db) return;
        if (vehicle.db.key != "farm") return;
        if (seat != -1) return;
        // player.farmJob = {
        //     farm: farms.farms[0],
        //     type: 1,
        //     pay: 0
        // }; //for test

        var header = `Техника фермы`;
        if (!player.farmJob) {
            player.removeFromVehicle();
            return notifs.error(player, `Вы не работаете на ферме`, header);
        }
        if (player.farmJob.farm.id != vehicle.db.owner) {
            player.removeFromVehicle();
            return notifs.error(player, `Вы работаете на другой ферме`, header);
        }
        var jobType = farms.getJobTypeByVehModel(vehicle.db.modelName);
        if (jobType == -1) return notifs.error(player, `Должность для авто ${vehicle.db.modelName} не найдена`, header);
        if (jobType != player.farmJob.type) {
            player.removeFromVehicle();
            return notifs.error(player, `Необходимо иметь должность: ${farms.getJobName(jobType)}`, header);
        }
        if (jobType == 1) { // фермер
            player.call(`prompt.waitShowByName`, [`farm_farmer`]);
            if (!vehicle.products || !vehicle.products.count) return;
            var count = vehicle.products.count;
            notifs.info(player, `Урожай в пикапе: ${count} из 200 ед.`, header);
            if (count == 200) {
                notifs.info(player, `Разгрузите урожай на склад фермы`, header);
                var pos = farms.getWarehouse(player.farmJob.farm.id).position;
                player.call(`waypoint.set`, [pos.x, pos.y]);
            }
        } else if (jobType == 2) { // тракторист
            player.call(`prompt.waitShowByName`, [`farm_tractor`]);
            if (!vehicle.grains || !vehicle.grains.count) {
                notifs.info(player, `Загрузите зерно на складе фермы`, header);
                var pos = farms.getWarehouse(player.farmJob.farm.id).position;
                player.call(`waypoint.set`, [pos.x, pos.y]);
                return;
            }
            var count = vehicle.grains.count;

            notifs.info(player, `Зерно в тракторе: ${count} из 600 ед.`, header);
        } else if (jobType == 3) { // пилот
            player.call(`prompt.waitShowByName`, [`farm_pilot`]);
            if (!vehicle.soils || !vehicle.soils.count) {
                notifs.info(player, `Загрузите удобрение на складе`, header);
                var pos = farms.getSoilsWarehouse(player.farmJob.farm.id).position;
                player.call(`waypoint.set`, [pos.x, pos.y]);
                return;
            }
            var count = vehicle.soils.count;

            notifs.info(player, `Удобрение в самолете: ${count} из 200 ед.`, header);
        }
    },
};
