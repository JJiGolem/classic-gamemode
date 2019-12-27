let carrier = call('carrier');
let factions = call('factions');
let farms = call('farms');
let jobs = call('jobs');
let inventory = call('inventory');
let money = call('money');
let notifs = call('notifications');
let routes = call('routes');
let timer = call('timer');

module.exports = {
    "init": async () => {
        await farms.init();
        inited(__dirname);
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
            farm.balance = 0;
            farm.taxBalance = farms.tax * 24;
            farm.owner = player.character;

            farm.save();
            notifs.success(player, `Ферма #${farm.id} куплена`, header);
            notifs.warning(player, `Пополните балансы фермы`, header);
            player.call(`prompt.showByName`, [`farm_tax`]);
            player.call(`selectMenu.loader`, [false]);
            player.call(`selectMenu.hide`);
        }, `Покупка фермы #${farm.id} у штата`);
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
        }, `Продажа фермы #${farm.id} в штат`);
    },
    "farms.sell.player": (player, data) => {
        data = JSON.parse(data);
        var header = `Продажа фермы`
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (!player.farm) return out(`Вы не у фермы`);
        if (player.farm.playerId != player.character.id) return out(`Вы не хозяин фермы`);
        var rec = mp.players.at(data.playerId);
        if (!rec || !rec.character) return out(`Игрок #${data.playerId} не найден`);
        if (rec.id == player.id) return out(`Нельзя продать самому себе`);
        if (player.dist(rec.position) > 10) return out(`Игрок далеко`);

        rec.offer = {
            type: "farm_sell",
            inviterId: player.id,
            price: data.sum
        };
        rec.call(`offerDialog.show`, ["farm_sell", {
            name: player.name,
            farmId: player.farm.id,
            price: data.sum
        }]);
        notifs.success(player, `Предложение ${rec.name} отправлено`, header);
    },
    "farms.sell.player.accept": (player) => {
        var header = `Покупка фермы`;
        if (!player.offer || player.offer.type != "farm_sell") return notifs.error(player, `Предложение не найдено`, header);

        var owner = mp.players.at(player.offer.inviterId);
        var price = player.offer.price;
        delete player.offer;
        if (!owner || !owner.character) return notifs.error(player, `Хозяин не найден`, header);
        if (player.dist(owner.position) > 10) return notifs.error(player, `${owner.name} далеко`, header);
        if (!owner.farm) {
            notifs.error(owner, `Вы не у фермы`, `Продажа фермы`);
            return notifs.error(player, `${owner.name} не у фермы`, header);
        }
        var farm = owner.farm;
        if (farm.playerId != owner.character.id) return notifs.error(player, `${owner.name} не хозяин`, header);
        if (player.character.cash < price) return notifs.error(player, `Необходимо $${price}`, header);

        money.removeCash(player, price, (res) => {
            if (!res) return notifs.error(player, `Ошибка списания наличных`);

            money.addCash(owner, price, (res) => {
                if (!res) return notifs.error(owner, `Ошибка начисления наличных`);

                farm.playerId = player.character.id;
                farm.owner = player.character;
                farm.save();
            }, `Продажа фермы #${farm.id} игроку ${player.name}`);
        }, `Покупка фермы #${farm.id} у игрока ${owner.name}`);
        notifs.success(owner, `Ферма #${farm.id} продана игроку ${player.name}`, `Продажа фермы`);
        notifs.success(player, `Ферма #${farm.id} куплена у игрока ${owner.name}`, header);
    },
    "farms.sell.player.cancel": (player) => {
        if (!player.offer) return;
        var owner = mp.players.at(player.offer.playerId);
        delete player.offer;
        if (!owner || !owner.character) return;
        var header = `Покупка фермы`;
        notifs.info(player, `Предложение отклонено`, header);
        notifs.info(owner, `${player.name} отклонил предложение`, header);
    },
    "farms.job.start": (player, index) => {
        index = Math.clamp(index, 0, 3);
        var header = `Работа на ферме`
        if (!player.farm) return notifs.error(player, `Вы не у фермы`, header);
        if (player.farmJob) return notifs.error(player, `Увольтесь, чтобы сменить должность`, header);
        // if (!player.farm.playerId) return notifs.error(player, `Ферма не имеет хозяина`, header);
        if (jobs.getJobSkill(player, 5).exp < farms.jobExps[index]) return notifs.error(player, `Необходимо навык ${jobs.getJob(5).name} ${farms.jobExps[index]}%`, header);
        if ((index == 1 || index == 2) && !player.character.carLicense) return notifs.error(player, `Необходимо водительское удостоверение`, header);
        if (index == 3 && !player.character.airLicense) return notifs.error(player, `Необходима лицензия на воздушный транспорт`, header);
        if (player.character.factionId) return notifs.error(player, `Вы состоите в ${factions.getFactionName(player)}`, header);

        jobs.addMember(player, 5);

        player.farmJob = {
            type: index,
            pay: 0,
            farm: player.farm,
        };

        if (player.farmJob.type == 0) player.call(`prompt.showByName`, ["farm_job"]);

        farms.setJobClothes(player, true, player.farmJob.type);
        player.call("farms.jobType.set", [player.farmJob.type]);
        notifs.success(player, `Вы начали работу (${farms.getJobName(player.farmJob.type)})`, header);
    },
    "farms.job.stop": (player) => {
        var header = `Завершение работы`;
        // if (!isDied && (!player.farm)) return notifs.error(player, `Вы не у фермы`, header);
        if (!player.farmJob || player.character.job != 5) return notifs.error(player, `Вы не работаете на ферме`, header);

        var farm = player.farmJob.farm;
        // if (farm.id != player.farm.id) return notifs.error(player, `Вы работаете на другой ферме`, header);

        if (farm.playerId) {
            if (farm.balance < player.farmJob.pay) notifs.warning(player, `Баланс фермы не позволяет вам выплатить заплату`, header);
            else {
                farm.balance -= player.farmJob.pay;
                farm.save();
                money.addCash(player, player.farmJob.pay * jobs.bonusPay, (res) => {
                    if (!res) return notifs.error(player, `Ошибка начисления наличных`, header);
                }, `Зарплата на ферме #${farm.id} x${jobs.bonusPay}`);
            }
        } else {
            money.addCash(player, player.farmJob.pay * jobs.bonusPay, (res) => {
                if (!res) return notifs.error(player, `Ошибка начисления наличных`, header);
            }, `Зарплата на ферме #${farm.id} без владельца x${jobs.bonusPay}`);
        }

        farms.setJobClothes(player, false);
        player.addAttachment("farmProductA", true);
        player.addAttachment("farmProductB", true);
        player.addAttachment("farmProductC", true);
        player.call("farms.jobType.set", [null]);
        player.call("routes.checkpoints.destroy");
        notifs.success(player, `Удачного дня!`, header);
        if ([2, 3].includes(player.farmJob.type)) {
            // тракторы с зерном и самолеты с удобрением, которые загрузил игрок
            var vehicles = mp.vehicles.toArray().filter(x => x.key == 'farm' && x.products && x.products.playerId == player.id);
            vehicles.forEach(veh => {
                veh.setVariable("label", null);
                delete veh.products;
            });
        }

        delete player.farmJob;
        jobs.deleteMember(player);
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

        if (!player.farmJob || player.character.job != 5) return notifs.error(player, `Вы не работаете на ферме`, header);
        if (field.farmId != player.farmJob.farm.id) return notifs.error(player, `Поле принадлежит другой ферме`, header);
        var jobName = farms.getJobName(player.farmJob.type);
        if (player.farmJob.type != 0 && player.farmJob.type != 1) return notifs.error(player, `Для должности ${jobName} недоступно`, header);
        if (player.hasAttachment("farmTrowel")) return notifs.error(player, `Вы уже собираете урожай`, header);
        player.addAttachment("farmTrowel");
        var playerId = player.id;
        var characterId = player.character.id;
        timer.add(() => {
            try {
                var rec = mp.players.at(playerId);
                if (!rec || rec.character.id != characterId) return;
                // TODO: проверка на присмерти
                rec.addAttachment("farmTrowel", true);
                if (!rec.farmJob) return;
                var obj = mp.objects.at(objId);
                if (!obj || !obj.field) {
                    return notifs.error(rec, `В этой части поля урожай уже собран`, header);
                }
                var names = ["farmProductA", "farmProductA", "farmProductB", "farmProductC"];
                rec.addAttachment(names[field.type]);

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
        if (!player.farmJob || player.character.job != 5) return notifs.error(player, `Вы не работаете на ферме`, header);
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
        if (veh.products && veh.products.type != prodType) return notifs.error(player, `Неверный тип урожая`, header);
        if (veh.products && veh.products.count >= 200) return notifs.error(player, `Пикап заполнен`, header);
        farms.addVehicleProducts(veh, prodType);

        if (!player.farmJob) return notifs.error(player, `Вы не работаете`, header);
        if (player.farmJob.farm.id != veh.db.owner) return notifs.error(player, `Вы работаете на другой ферме`, header);

        player.farmJob.pay += player.farmJob.farm.pay;
        notifs.info(player, `Заработано $${player.farmJob.pay}`, header);
        jobs.addJobExp(player, farms.exp);
    },
    "farms.warehouse.products.fill": (player) => {
        var header = `Выгрузка урожая`;
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "farm") return notifs.error(player, `Необходимо находиться в фермерском пикапе`, header);
        if (!player.farm) return notifs.error(player, `Вы далеко`, header);
        if (!player.farmJob || player.character.job != 5) return notifs.error(player, `Вы не работаете на ферме`, header);
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
        if (veh.products.count) {
            veh.setVariable("label", `${veh.products.count} из 200 ед.`);
            notifs.info(player, `Склад заполнен. ${veh.products.count} ед. урожая осталось в пикапе`, header);
        } else {
            veh.setVariable("label", null);
            delete veh.products;
        }
        var pay = parseInt(farm.farmerPay * (count / 200));
        player.farmJob.pay += pay;

        notifs.success(player, `Разгружено ${count} ед. урожая. Премия $${pay}`, header);
    },
    "farms.warehouse.products.buy": (player, data) => {
        data = JSON.parse(data);
        var header = `Покупка урожая`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "job" || veh.db.owner != 4) return out(`Необходимо находиться в грузовике`);
        if (!player.farm) return out(`Вы далеко`);
        if (player.character.job != 4) return out(`Вы не грузоперевозчик`);
        if (veh.products && veh.products.count) return out(`Грузовик уже содержит товар`);
        var max = carrier.getProductsMax(player);
        if (data.count > max) return out(`Ваш навык не позволяет загрузить более ${max} ед.`);

        var farm = player.farm;
        var key = ["productA", "productB", "productC"][data.index];
        if (key == 'productC' && !factions.isMafiaFaction(player.character.factionId)) return out(`Доступно только членам мафии`);
        if (farm[key] < 100 || farm[key] < data.count) return out(`На складе недостаточно урожая`);


        var price = farm[`${key}Price`] * data.count;
        if (player.character.cash < price) return out(`Необходимо $${price}`);

        money.removeCash(player, price, (res) => {
            if (!res) return out(`Ошибка списания наличных`);

            veh.products = {
                type: key,
                count: data.count,
            };
            veh.setVariable(`label`, `${data.count} из ${max} ед.`);
            farm[key] -= data.count;
            farm.balance += price;
            farm.save();
        }, `Загрузка урожая на ферме #${farm.id}`);

        notifs.success(player, `Урожай загружен`, header);
    },
    "farms.warehouse.products.inv.buy": (player, data) => {
        data = JSON.parse(data);
        var header = `Покупка на руки`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (player.vehicle) return out(`Выйдите из авто`);
        if (!player.farm) return out(`Вы далеко`);
        var farm = player.farm;
        var key = ["productA", "productB", "productC"][data.index];
        // if (key == 'productC' && !factions.isMafiaFaction(player.character.factionId)) return out(`Доступно только членам мафии`);
        if (key == 'productC') return out(`Недоступно`);
        if (farm[key] < 4 || farm[key] < data.count) return out(`На складе недостаточно урожая`);
        var price = farm[`${key}Price`] * data.count;
        if (player.character.cash < price) return out(`Необходимо $${price}`);
        var itemId = [36, 146][data.index];
        var params = {
            count: data.count
        };

        // TODO: возможность покупки урожая С (травка)
        var cantAdd = inventory.cantAdd(player, itemId, params);
        if (cantAdd) return out(cantAdd);

        money.removeCash(player, price, (res) => {
            if (!res) return out(`Ошибка списания наличных`);

            inventory.addItem(player, itemId, params, (e) => {
                if (e) return out(e);

                farm[key] -= data.count;
                farm.balance += price;
                farm.save();
                notifs.success(player, `Урожай куплен`, header);
            });
        }, `Покупка урожая на руки на ферме #${farm.id}`);
    },
    "farms.warehouse.grains.take": (player, data) => {
        data = JSON.parse(data);
        var header = `Загрузка зерна`;
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "farm") return notifs.error(player, `Необходимо находиться в тракторе`, header);
        if (!player.farm) return notifs.error(player, `Вы далеко`, header);
        if (!player.farmJob || player.character.job != 5) return notifs.error(player, `Вы не работаете на ферме`, header);
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
        if (field.count) return notifs.error(player, `Поле #${field.id} уже засеяно`, header);
        var count = 600;
        if (farm.grains < count) return notifs.error(player, `Недостаточно для загрузки`, header);
        if (data.grain == 2) return notifs.error(player, `Засев поля данным типом урожая временно не доступен`, header);

        farm.grains -= count;
        farm.save();
        if (!veh.products) veh.products = {};
        veh.products.type = data.grain + 1;
        veh.products.count = count;
        veh.products.playerId = player.id;
        veh.setVariable("label", `${count} из 600 ед.`);

        var points = farms.getFillingPoints(field);
        var data = Object.assign({}, routes.defaultCheckpointData);
        data.scale = 4;
        routes.start(player, data, points, () => {
            var veh = player.vehicle;
            if (!veh || !veh.db || veh.db.key != "farm") {
                notifs.error(player, `Необходимо находиться в тракторе`, header);
                return false;
            }
            if (!player.farmJob || player.character.job != 5) {
                notifs.error(player, `Вы не работаете на ферме`, header);
                return false;
            }
            veh.products.count -= parseInt(600 / points.length);
            veh.setVariable("label", `${veh.products.count} из 600 ед.`);
            return true;
        }, () => {
            var pay = farm.tractorPay;
            player.farmJob.pay += pay;
            notifs.success(player, `Поле засеяно. Премия $${pay}`, header);
            farms.fillField(field, veh.products.type);
            veh.setVariable("label", null);
            delete veh.products;
        });

        notifs.success(player, `Загружено ${count} ед. урожая`, header);
        notifs.info(player, `Отправляйтесь на посев поля`, header);
    },
    "farms.warehouse.grains.sell": (player) => {
        var header = `Продажа зерна`;
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "job" || veh.db.owner != 4) return notifs.error(player, `Необходимо находиться в грузовике`, header);
        if (!player.farm) return notifs.error(player, `Вы далеко`, header);
        var job = jobs.getJob(4);
        if (player.character.job != job.id) return notifs.error(player, `Вы не ${job.name}`, header);
        if (!veh.products || !veh.products.count) return notifs.error(player, `Грузовик пустой`, header);
        if (veh.products.type != "grains") return notifs.error(player, `Неверный тип товара`, header);
        var farm = player.farm;

        var count = Math.clamp(veh.products.count, 0, farms.grainsMax - farm.grains);
        var price = count * farm.grainPrice;
        if (farm.playerId && farm.balance < price) return notifs.warning(player, `Баланс фермы не позволяет вам выплатить заплату`, header);
        farm.grains += count;
        farm.save();
        veh.products.count -= count;
        if (veh.products.count) {
            veh.setVariable("label", `${veh.products.count} из ${carrier.getProductsMax(player)} ед.`);
            notifs.info(player, `Склад заполнен. ${veh.products.count} ед. зерна осталось в грузовике`, header);
        } else {
            veh.setVariable("label", null);
            delete veh.products;
            notifs.success(player, `Зерно продано`, header);
            jobs.addJobExp(player, carrier.exp);
        }

        if (farm.playerId) {
            farm.balance -= price;
            farm.save();
            money.addCash(player, price, (res) => {
                if (!res) return notifs.error(player, `Ошибка начисления наличных`, header);
            }, `Продажа зерна на ферме #${farm.id}`);
        } else {
            money.addCash(player, price, (res) => {
                if (!res) return notifs.error(player, `Ошибка начисления наличных`, header);
            }, `Продажа зерна на ферме #${farm.id} без владельца`);
        }
    },
    "farms.soilsWarehouse.take": (player) => {
        var header = `Загрузка удобрения`;
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "farm") return notifs.error(player, `Необходимо находиться в самолете`, header);
        if (!player.farm) return notifs.error(player, `Вы далеко`, header);
        if (!player.farmJob || player.character.job != 5) return notifs.error(player, `Вы не работаете на ферме`, header);
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
        points.forEach(x => x.z += 3);
        var data = Object.assign({}, routes.defaultCheckpointData);
        data.type = 6;
        data.scale = 8;
        data.color = [46, 224, 255, 100];
        data.isMarker = true;
        routes.start(player, data, points, () => {
            var veh = player.vehicle;
            if (!veh || !veh.db || veh.db.key != "farm") {
                notifs.error(player, `Необходимо находиться в самолете`, header);
                return false;
            }
            if (!player.farmJob || player.character.job != 5) {
                notifs.error(player, `Вы не работаете на ферме`, header);
                return false;
            }
            return true;
        }, () => {
            var pay = farm.pilotPay;
            if (farm.playerId) {

                if (farm.balance < pay) notifs.warning(player, `Баланс фермы не позволяет вам выплатить заплату`, header);
                else {
                    farm.balance -= pay;
                    farm.save();
                    money.addCash(player, pay, (res) => {
                        if (!res) return notifs.error(player, `Ошибка начисления наличных`, header);
                    }, `Засев поля на ферме #${farm.id}`);
                }
            } else {
                money.addCash(player, pay, (res) => {
                    if (!res) return notifs.error(player, `Ошибка начисления наличных`, header);
                }, `Засев поля на ферме #${farm.id} без владельца`);
            }

            notifs.success(player, `Урожай полей увеличился. Премия $${pay}`, header);
            farms.soilFields(farm);
            delete veh.soils;
        });

        notifs.success(player, `Загружено ${count} ед. удобрения`, header);
        notifs.info(player, `Отправляйтесь на орошение полей`, header);
    },
    "farms.soilsWarehouse.sell": (player) => {
        var header = `Продажа удобрения`;
        var veh = player.vehicle;
        if (!veh || !veh.db || veh.db.key != "job" || veh.db.owner != 4) return notifs.error(player, `Необходимо находиться в грузовике`, header);
        if (!player.farm) return notifs.error(player, `Вы далеко`, header);
        var job = jobs.getJob(4);
        if (player.character.job != job.id) return notifs.error(player, `Вы не ${job.name}`, header);
        if (!veh.products || !veh.products.count) return notifs.error(player, `Грузовик пустой`, header);
        if (veh.products.type != "soils") return notifs.error(player, `Неверный тип товара`, header);
        var farm = player.farm;

        var count = Math.clamp(veh.products.count, 0, farms.soilsMax - farm.soils);
        var price = count * farm.soilPrice;
        if (farm.balance < price) return notifs.warning(player, `Баланс фермы не позволяет вам выплатить заплату`, header);
        farm.soils += count;
        farm.save();
        veh.products.count -= count;
        if (veh.products.count) {
            veh.setVariable("label", `${veh.products.count} из ${carrier.getProductsMax(player)} ед.`);
            notifs.info(player, `Склад заполнен. ${veh.products.count} ед. удобрения осталось в грузовике`, header);
        } else {
            veh.setVariable("label", null);
            delete veh.products;
            notifs.success(player, `Удобрение продано`, header);
            jobs.addJobExp(player, carrier.exp);
        }
        player.call(`selectMenu.hide`);

        if (farm.playerId) {
            farm.balance -= price;
            farm.save();
            money.addCash(player, price, (res) => {
                if (!res) return notifs.error(player, `Ошибка начисления наличных`, header);
            }, `Продажа удобрения на ферме #${farm.id}`);
        } else {
            money.addCash(player, price, (res) => {
                if (!res) return notifs.error(player, `Ошибка начисления наличных`, header);
            }, `Продажа удобрения на ферме #${farm.id} без владельца`);
        }
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
        if (data.balance == 1 && data.sum > farms.taxBalanceMax) return out(`Баланс налога не более $${farms.taxBalanceMax}`);
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
                player.call(`selectMenu.hide`);
            }, `Пополнение баланса фермы #${farm.id}`);
        } else { // снять с баланса
            data.sum = farm[key] - data.sum;
            if (farm[key] < data.sum) return out(`Необходимо $${data.sum} на балансе`);
            money.addCash(player, data.sum, (res) => {
                if (!res) return out(`Ошибка зачисления наличных`);
                farm[key] -= data.sum;
                farm.save();
                notifs.success(player, `Наличные сняты`, header);
                player.call(`selectMenu.loader`, [false]);
                player.call(`selectMenu.hide`);
            }, `Снятие с баланса фермы #${farm.id}`);
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
        if (data.sum < 0 || data.sum > farms.payMax) return out(`Не более $${farms.payMax}`);

        farm[key] = data.sum;
        farm.save();
        notifs.success(player, `Зарплата $${farm[key]} установлена`, header);
        player.call(`selectMenu.hide`);
    },
    "death.spawn": (player) => {
        if (player.farmJob) mp.events.call("farms.job.stop", player);
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
        if (!player.farmJob || player.character.job != 5) {
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
    "vehicle.respawned": (veh) => {
        if (veh.key != "farm" || !veh.products) return;
        var jobId = farms.getJobTypeByVehModel(veh.modelName);
        if (jobId == 2 || jobId == 3) {
            delete veh.products;
            veh.setVariable("label", null);
        }
    },
    "playerQuit": (player) => {
        if (!player.character) return;
        if (player.farmJob) {
            farms.pay(player);
            delete player.farmJob;
        }
    },
};
