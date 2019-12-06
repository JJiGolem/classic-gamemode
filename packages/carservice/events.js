let carservice = require('./index.js');

let money = call('money');
let jobs = call('jobs');
let timer = call('timer');

let DEFAULT_PRODUCTS = carservice.defaultProducts;
let DEFAULT_DIAGNOSTICS_PRODUCTS = DEFAULT_PRODUCTS.DIAGNOSTICS;
let PRODUCT_PRICE = carservice.productPrice;

module.exports = {
    "init": async () => {
        await carservice.init();
        inited(__dirname);
    },
    "carservice.jobshape.enter": (player) => {
        if (player.character.job != 1) {
            player.call("carservice.jobmenu.show", [0]);
        } else {
            player.call("carservice.jobmenu.show", [1]);
        }
    },
    "carservice.jobshape.employment": (player) => {
        if (player.character.job == 1) {
            mp.events.call("jobs.leave", player);
            player.call('carservice.shape.leave');
        } else {
            mp.events.call("jobs.set", player, 1);
            player.call('carservice.shape.enter');
        }
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isCarService) {
            player.currentCarServiceId = shape.carServiceId;
            if (player.character.job == 1) {
                player.call('carservice.shape.enter');
            }
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isCarService) {
            if (player.character.job == 1) {
                player.call('carservice.shape.leave');
            }
        }
    },
    "carservice.diagnostics.offer": (player, targetId) => {
        if (player.character.job != 1) return player.call('notifications.push.error', ['Вы не механик', 'Ошибка']);
        if (player.currentCarServiceId == null) return console.log('car service id == null');
        let target = mp.players.at(targetId);
        if (!target) return console.log('no target');
        let vehicle = target.vehicle;
        if (!vehicle) return console.log('no target vehicle');;

        if (vehicle.isBeingRepaired) return player.call('notifications.push.error', ['Транспорт уже ремонтируется', 'Ошибка']);

        let productsAvailable = carservice.getProductsAmount(player.currentCarServiceId);
        if (productsAvailable < DEFAULT_DIAGNOSTICS_PRODUCTS) return player.call('notifications.push.error', ['В мастерской недостаточно ресурсов', 'Ошибка']);
        target.diagnosticsOffer = {
            playerId: player.id,
            vehicleToRepair: vehicle
        }

        player.senderDiagnosticsOffer = {
            targetPlayer: target
        };

        let serviceId = player.currentCarServiceId;
        let priceMultiplier = carservice.getPriceMultiplier(serviceId);
        let price = parseInt(DEFAULT_DIAGNOSTICS_PRODUCTS * PRODUCT_PRICE * priceMultiplier);

        target.call('offerDialog.show', ["carservice_diagnostics", {
            name: player.character.name,
            price: price
        }]);
    },
    "carservice.diagnostics.accept": (player, accept) => {
        let target = player;
        let offer = target.diagnosticsOffer;
        let sender = mp.players.at(offer.playerId);

        if (!sender) return;
        if (sender.currentCarServiceId == null) return sender.call('notifications.push.error', ['Вы не у мастерской', 'Ошибка']);
        if (sender.senderDiagnosticsOffer.targetPlayer != target) return;

        if (accept) {
            let serviceId = sender.currentCarServiceId;

            let productsAvailable = carservice.getProductsAmount(serviceId);
            if (productsAvailable < DEFAULT_DIAGNOSTICS_PRODUCTS) {
                sender.call('notifications.push.error', ['В мастерской недостаточно ресурсов', 'Ошибка']);
                target.call('notifications.push.error', ['В мастерской недостаточно ресурсов', 'Ошибка']);
                return;
            }

            let salaryMultiplier = carservice.getSalaryMultiplier(serviceId);
            let priceMultiplier = carservice.getPriceMultiplier(serviceId);
            let price = parseInt(DEFAULT_DIAGNOSTICS_PRODUCTS * PRODUCT_PRICE * priceMultiplier);
            let salary = parseInt(price * salaryMultiplier);

            if (target.character.cash < price) {
                target.call('notifications.push.error', [`Недостаточно денег`, `Автомастерская`]);
                sender.call('notifications.push.error', [`У клиента нет денег`, `Автомастерская`]);
                delete target.diagnosticsOffer;
                delete sender.senderDiagnosticsOffer;
                return;
            }

            carservice.removeProducts(serviceId, DEFAULT_DIAGNOSTICS_PRODUCTS);

            money.removeCash(target, price, function (result) {
                if (result) {
                    mp.events.call('carservice.diagnostics.preparation', sender, target);
                    let income = price - salary;
                    carservice.updateCashbox(serviceId, income); /// Начисление денег за диагностику в кассу
                    money.addMoney(sender, salary, function (result) {
                        if (result) {
                            sender.call('notifications.push.success', [`К зарплате добавлено $${salary}`, 'Автомастерская']);
                        } else {
                            sender.call('notifications.push.error', [`Ошибка выдачи зарплаты`, 'Автомастерская']);
                            console.log(`Ошибка начисления денег за диагностику игроку ${sender.name}`);
                        }
                    }, `Зарплата за диагностику транспорта`);
                    delete target.diagnosticsOffer;
                    delete sender.senderDiagnosticsOffer;
                } else {
                    target.call('notifications.push.error', [`Ошибка оплаты`, `Автомастерская`]);
                    sender.call('notifications.push.error', [`Ошибка оплаты`, `Автомастерская`]);
                    delete target.diagnosticsOffer;
                    delete sender.senderDiagnosticsOffer;
                }
            }, `Оплата диагностики транспорта`);
        } else {
            delete target.diagnosticsOffer;
            delete sender.senderDiagnosticsOffer;
        }
    },
    "carservice.diagnostics.preparation": (player, target) => {
        console.log('preparation');
        if (player.character.job != 1) return;
        if (!target.vehicle) return console.log('[CARSERVICE | DEBUG] У цели не было автомобиля (events: 146)');
        let vehId = target.vehicle.id;
        player.repairTargetVehicle = target.vehicle;
        target.repairVehicle = target.vehicle;
        if (target.vehicle.engine == true) {
            target.vehicle.engine = false;
            target.call('vehicles.engine.toggle', [false]);
            target.vehicle.setVariable("engine", false);
        }

        /// Для обработки выхода из игры
        player.mechanicRepairInfo = {
            target: target
        }

        target.targetRepairInfo = {
            mechanic: player
        }

        target.vehicle.isBeingRepaired = true;

        player.call('carservice.diagnostics.preparation', [vehId]);

        player.repairTarget = target;
    },
    "carservice.diagnostics.start": (player, animType) => {
        let target = player.repairTarget;
        let vehicle = player.repairTargetVehicle;
        //let vehicle = target.vehicle;
        //if (target.vehicle != vehicle) return;
        vehicle.setVariable("hood", true);

        player.lastRepairAnim = animType;
        player.call('notifications.push.success', [`Вы начали диагностику`, 'Автомастерская']);
        switch (animType) {
            case 0:
                mp.events.call('animations.play', player, 'mini@repair', 'fixing_a_ped', 1, 49);
                break;
            case 1:
                mp.events.call('animations.play', player, 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@', 'machinic_loop_mechandplayer', 1, 49);
                break;
            case 2:
                mp.events.call('animations.play', player, 'misscarsteal2fixer', 'confused_a', 1, 49);
                break;
            case 3:
                mp.events.call('animations.play', player, 'mini@repair', 'fixing_a_player', 1, 49);
                break;
        }
        timer.add(() => {
            try {
                mp.events.call('carservice.diagnostics.end', player);
            } catch (err) {
                console.log(err);
            }

        }, 12000)
    },
    "carservice.diagnostics.end": (player) => {
        let target = player.repairTarget;
        let vehicle = player.repairTargetVehicle;

        target.currentMechanic = player;

        let multiplier = carservice.getRepairPriceMultiplier(vehicle);
        let serviceId = player.currentCarServiceId;

        let priceMultiplier = carservice.getPriceMultiplier(serviceId);

        let checkData = {};
        target.repairPrice = 0;
        target.repairProducts = 0;
        if (vehicle.engineState) {
            let products = parseInt(DEFAULT_PRODUCTS.ENGINE * vehicle.engineState * multiplier);
            let price = products * PRODUCT_PRICE * priceMultiplier;
            target.repairPrice += price;
            target.repairProducts += products;
            checkData.engine = {
                state: vehicle.engineState,
                price: price
            }
        }
        if (vehicle.fuelState) {
            let products = parseInt(DEFAULT_PRODUCTS.FUEL * vehicle.fuelState * multiplier);
            let price = products * PRODUCT_PRICE * priceMultiplier;
            target.repairPrice += price;
            target.repairProducts += products;
            checkData.fuel = {
                state: vehicle.fuelState,
                price: price
            }
        }
        if (vehicle.steeringState) {
            let products = parseInt(DEFAULT_PRODUCTS.STEERING * vehicle.steeringState * multiplier);
            let price = products * PRODUCT_PRICE * priceMultiplier;
            target.repairPrice += price;
            target.repairProducts += products;
            checkData.steering = {
                state: vehicle.steeringState,
                price: price
            }
        }
        if (vehicle.brakeState) {
            let products = parseInt(DEFAULT_PRODUCTS.BRAKE * vehicle.brakeState * multiplier);
            let price = products * PRODUCT_PRICE * priceMultiplier;
            target.repairPrice += price;
            target.repairProducts += products;
            checkData.brake = {
                state: vehicle.brakeState,
                price: price
            }
        }
        if (vehicle.bodyHealth < 999) {
            let products = parseInt(DEFAULT_PRODUCTS.BODY * multiplier);
            let price = parseInt((1000 - vehicle.bodyHealth) * multiplier * priceMultiplier);
            target.repairPrice += price;
            target.repairProducts += products;
            checkData.body = {
                price: price
            }
        }
        mp.events.call('animations.stop', player);
        if (Object.keys(checkData).length == 0) {
            target.call('notifications.push.success', ['Т/с не нуждается в ремонте', 'Диагностика']);
            mp.events.call('carservice.service.end.mechanic', player, 1);
            mp.events.call('carservice.service.end.target', target, 1);
            return;
        }

        player.call('notifications.push.success', [`Выставлен счет в $${target.repairPrice}`, 'Автомастерская']);
        target.call('carservice.check.show', [checkData])
    },
    "carservice.check.accept": (player, state) => {
        console.log(`check accept: ${state}`);
        let target = player;
        let mechanic = player.currentMechanic;
        let vehicle = mechanic.repairTargetVehicle;
        if (!target) return;
        if (!mechanic) return;
        if (!vehicle) return;

        let serviceId = player.currentCarServiceId;
        let productsAvailable = carservice.getProductsAmount(serviceId);
        let salaryMultiplier = carservice.getSalaryMultiplier(serviceId);
        if (productsAvailable < target.repairProducts) {
            player.call('notifications.push.error', ['В мастерской недостаточно ресурсов', 'Ошибка']);
            target.call('notifications.push.error', ['В мастерской недостаточно ресурсов', 'Ошибка']);
            mp.events.call('carservice.service.end.mechanic', player, 1);
            mp.events.call('carservice.service.end.target', target, 1);
            return;
        }

        if (state) {
            /// Снять деньги
            if (target.character.cash < target.repairPrice) {
                target.call('notifications.push.error', [`Недостаточно денег`, `Автомастерская`]);
                mechanic.call('notifications.push.error', [`Клиент отказался`, `Автомастерская`]);
                mp.events.call('carservice.service.end.mechanic', mechanic, 1);
                mp.events.call('carservice.service.end.target', target, 1);
                return;
            }
            money.removeCash(target, target.repairPrice, function (result) {
                if (result) {
                    target.call('notifications.push.success', [`Вы заплатили $${target.repairPrice}`, `Автомастерская`]);
                    mechanic.call('notifications.push.success', [`Клиент оплатил ремонт`, `Автомастерская`]);

                    carservice.repairVehicle(vehicle);
                    let salary = parseInt(target.repairPrice * salaryMultiplier);
                    let bonus = carservice.calculateBonus(player);
                    let income = target.repairPrice - salary;
                    carservice.removeProducts(serviceId, target.repairProducts); /// Снятие продуктов
                    carservice.updateCashbox(serviceId, income); /// Начисление денег за ремонт
                    jobs.addJobExp(mechanic, 0.05);
                    money.addMoney(mechanic, parseInt(salary * (1 + bonus)), function (result) {
                        if (result) {
                            mechanic.call('notifications.push.success', [`К зарплате добавлено $${salary}`, 'Автомастерская']);
                            if (bonus) {
                                mechanic.call('notifications.push.info', [`Премия за навык механика составила ${bonus*100}%`, 'Автомастерская']);
                            }
                        } else {
                            mechanic.call('notifications.push.error', [`Ошибка выдачи зарплаты`, 'Автомастерская']);
                            console.log(`Ошибка выдачи зарплаты за починку ${mechanic.name}`);
                        }
                    }, `Зарплата за ремонт транспорта`);

                    switch (mechanic.lastRepairAnim) {
                        case 0:
                            mp.events.call('animations.play', mechanic, 'mini@repair', 'fixing_a_ped', 1, 49);
                            break;
                        case 1:
                            mp.events.call('animations.play', mechanic, 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@', 'machinic_loop_mechandplayer', 1, 49);
                            break;
                        case 2:
                            mp.events.call('animations.play', mechanic, 'misscarsteal2fixer', 'confused_a', 1, 49);
                            break;
                        case 3:
                            mp.events.call('animations.play', mechanic, 'mini@repair', 'fixing_a_player', 1, 49);
                            break;
                    }

                    timer.add(() => {
                        try {
                            mp.events.call('carservice.service.end.mechanic', mechanic, 0);
                            mp.events.call('carservice.service.end.target', target, 0);
                        } catch (err) {
                            console.log(err);
                        }
                    }, 12000);
                } else {
                    target.call('notifications.push.error', [`Ошибка оплаты`, `Автомастерская`]);
                    mechanic.call('notifications.push.error', [`Ошибка оплаты`, `Автомастерская`]);
                    mp.events.call('carservice.service.end.mechanic', mechanic, 1);
                    mp.events.call('carservice.service.end.target', target, 1);
                    return;
                }
            }, `Оплата ремонта транспорта`);

        } else {
            mechanic.call('notifications.push.warning', ['Клиент отказался от ремонта', 'Автомастерская'])
            target.call('notifications.push.warning', ['Вы отказались от ремонта', 'Автомастерская'])
            mp.events.call('carservice.service.end.mechanic', mechanic, 1);
            mp.events.call('carservice.service.end.target', target, 1);

        }

    },
    "carservice.service.end.mechanic": (player, result) => {
        delete player.mechanicRepairInfo;
        switch (result) {
            /// Ремонт завершен удачно
            case 0:
                player.call('notifications.push.success', [`Ремонт окончен`, 'Автомастерская']);
                break;
            /// Прерывание ремонта без дополнительных уведомлений
            case 1:
                break;
            /// Прерывание ремонта с уведомлением об окончании
            default:
                player.call('notifications.push.warning', [`Ремонт прерван`, 'Автомастерская']);
                break;
        }

        mp.events.call('animations.stop', player);
        player.call('carservice.service.end.mechanic');
    },
    "carservice.service.end.target": (player, result) => {
        let vehicle = player.repairVehicle;
        if (!vehicle) return;
        delete player.targetRepairInfo;
        switch (result) {
            /// Ремонт завершен удачно
            case 0:
                player.call('notifications.push.success', [`Ремонт окончен`, 'Автомастерская']);
                vehicle.repair();
                vehicle.isBeingRepaired = false;
                vehicle.setVariable('hood', false);
                break;
            /// Прерывание ремонта без дополнительных уведомлений
            case 1:
                vehicle.isBeingRepaired = false;
                vehicle.setVariable('hood', false);
                break;
            /// Прерывание ремонта с уведомлением об окончании
            default:
                player.call('notifications.push.warning', [`Ремонт прерван`, 'Автомастерская']);
                vehicle.isBeingRepaired = false;
                vehicle.setVariable('hood', false);
                break;
        }
    },
    "playerQuit": (player) => {
        if (player.targetRepairInfo) {
            mp.events.call('carservice.service.end.mechanic', player.targetRepairInfo.mechanic, 1);
            mp.events.call('carservice.service.end.target', player, 1);
        }

        if (player.mechanicRepairInfo) {
            mp.events.call('carservice.service.end.target', player.mechanicRepairInfo.target, 1);
            mp.events.call('carservice.service.end.mechanic', player, 1);
        }
    }
}
