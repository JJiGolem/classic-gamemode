let carservice = require('./index.js');

let money = call('money');

let DEFAULT_PRICE = {
    BODY: 1,
    ENGINE: 120,
    FUEL: 80,
    STEERING: 110,
    BRAKE: 90
}

let DEFAULT_DIAGNOSTICS_PRICE = 50;

let DEFAULT_SALARY = {
    DIAGNOSTICS: 0.2,
    REPAIR: 0.1
}

let DEFAULT_INCOME = {
    DIAGNOSTICS: 0.3,
    REPAIR: 0.1
}

module.exports = {
    "init": () => {
        carservice.init();
    },
    // "carservice.jobshape.enter": (player) => {
    //     player.call("carservice.jobmenu.show");
    //     //mp.events.call("jobs.set", player, 1);
    // },
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
            if (player.character.job == 1) {
                player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп carService`]);
                player.call('carservice.shape.enter');
            }
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isCarService) {
            if (player.character.job == 1) {
                player.call('chat.message.push', [`!{#ffffff}${player.name} вышел с колшейпа carService`]);
                player.call('carservice.shape.leave');
            }
        }
    },
    "carservice.diagnostics.offer": (player, targetId) => {
        if (player.character.job != 1) return player.call('notifications.push.error', ['Вы не механик', 'Ошибка']);
        let target = mp.players.at(targetId);
        if (!target) return;
        let vehicle = target.vehicle;
        if (!vehicle) return;

        target.diagnosticsOffer = {
            playerId: player.id,
            vehicleToRepair: vehicle
        }

        player.senderDiagnosticsOffer = {
            targetPlayer: target
        };

        target.call('offerDialog.show', ["carservice_diagnostics", {
            name: player.character.name
        }]);
    },
    "carservice.diagnostics.accept": (player, accept) => {
        let target = player;
        let offer = target.diagnosticsOffer;
        let sender = mp.players.at(offer.playerId);
        let vehicleToRepair = target.vehicleToRepair;
        /// Снятие и передача денег


        //if (target.vehicle != vehicleToRepair) return;
        if (!sender) return;
        if (sender.senderDiagnosticsOffer.targetPlayer != target) return;

        if (accept) {
            let salary = parseInt(DEFAULT_DIAGNOSTICS_PRICE * DEFAULT_SALARY.DIAGNOSTICS);

            if (target.character.cash < DEFAULT_DIAGNOSTICS_PRICE) {
                target.call('notifications.push.error', [`Недостаточно денег`, `Автомастерская`]);
                sender.call('notifications.push.error', [`У клиента нет денег`, `Автомастерская`]);
                delete target.diagnosticsOffer;
                delete sender.senderDiagnosticsOffer;
                return;
            }

            money.removeCash(target, DEFAULT_DIAGNOSTICS_PRICE, function (result) {
                if (result) {
                    //sender.call('notifications.push.success', [`К зарплате добавлено $${salary}`, 'Автомастерская']);
                    console.log('accept');
                    mp.events.call('carservice.diagnostics.preparation', sender, target);
                    money.addMoney(sender, salary, function (result) {
                        if (result) {
                            sender.call('notifications.push.success', [`К зарплате добавлено $${salary}`, 'Автомастерская']);
                        } else {
                            sender.call('notifications.push.error', [`Ошибка выдачи зарплаты`, 'Автомастерская']);
                            console.log(`Ошибка начисления денег за диагностику игроку ${sender.name}`);
                        }
                    });
                    delete target.diagnosticsOffer;
                    delete sender.senderDiagnosticsOffer;
                } else {
                    target.call('notifications.push.error', [`Ошибка оплаты`, `Автомастерская`]);
                    sender.call('notifications.push.error', [`Ошибка оплаты`, `Автомастерская`]);
                    delete target.diagnosticsOffer;
                    delete sender.senderDiagnosticsOffer;
                }
            });
        } else {
            delete target.diagnosticsOffer;
            delete sender.senderDiagnosticsOffer;
        }
    },
    "carservice.diagnostics.preparation": (player, target) => {
        console.log('preparation');
        if (player.character.job != 1) return;
        //if (!target.vehicle) return;
        let vehId = target.vehicle.id;
        player.repairTargetVehicle = target.vehicle;
        target.repairVehicle = target.vehicle;
        if (target.vehicle.engine == true) {
            target.vehicle.engine = false;
            target.call('vehicles.engine.toggle', [false]);
            target.vehicle.setVariable("engine", false);
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
        setTimeout(() => {
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

        console.log(vehicle.bodyHealth);

        let multiplier = carservice.getRepairPriceMultiplier(vehicle);
        console.log(multiplier);
        let checkData = {};
        target.repairPrice = 0;
        if (vehicle.engineState) {
            let price = parseInt(DEFAULT_PRICE.ENGINE * vehicle.engineState * multiplier);
            console.log(price);
            target.repairPrice += price;
            checkData.engine = {
                state: vehicle.engineState,
                price: price
            }
        }
        if (vehicle.fuelState) {
            let price = parseInt(DEFAULT_PRICE.FUEL * vehicle.fuelState * multiplier);
            console.log(price);
            target.repairPrice += price;
            checkData.fuel = {
                state: vehicle.fuelState,
                price: price
            }
        }
        if (vehicle.steeringState) {
            let price = parseInt(DEFAULT_PRICE.STEERING * vehicle.steeringState * multiplier);
            console.log(price);
            target.repairPrice += price;
            checkData.steering = {
                state: vehicle.steeringState,
                price: price
            }
        }
        if (vehicle.brakeState) {
            let price = parseInt(DEFAULT_PRICE.BRAKE * vehicle.brakeState * multiplier);
            console.log(price);
            target.repairPrice += price;
            checkData.brake = {
                state: vehicle.brakeState,
                price: price
            }
        }
        if (vehicle.bodyHealth < 999) {
            let price = parseInt((1000 - vehicle.bodyHealth) * DEFAULT_PRICE.BODY * multiplier);
            console.log(price);
            target.repairPrice += price;
            checkData.body = {
                price: price
            }
        }
        console.log(target.repairPrice);
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

                    console.log(target.repairPrice);
                    carservice.repairVehicle(vehicle);
                    let salary = parseInt(target.repairPrice * DEFAULT_SALARY.REPAIR);

                    money.addMoney(mechanic, salary, function (result) {
                        if (result) {
                            mechanic.call('notifications.push.success', [`К зарплате добавлено $${salary}`, 'Автомастерская']);
                        } else {
                            mechanic.call('notifications.push.error', [`Ошибка выдачи зарплаты`, 'Автомастерская']);
                            console.log(`Ошибка выдачи зарплаты за починку ${mechanic.name}`);
                        }
                    });

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

                    setTimeout(() => {
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
            });

        } else {
            mechanic.call('notifications.push.warning', ['Клиент отказался от ремонта', 'Автомастерская'])
            target.call('notifications.push.warning', ['Вы отказались от ремонта', 'Автомастерская'])
            mp.events.call('carservice.service.end.mechanic', mechanic, 1);
            mp.events.call('carservice.service.end.target', target, 1);

        }

    },

    "carservice.service.end.mechanic": (player, result) => {
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
    }
}