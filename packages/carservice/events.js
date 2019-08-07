var carservice = require('./index.js');

let DEFAULT_PRICE = {
    BODY: 1,
    ENGINE: 120,
    FUEL: 80,
    STEERING: 110,
    BRAKE: 90
}
module.exports = {
    "init": () => {
        carservice.init();
    },
    "carservice.jobshape.enter": (player) => {
        player.call("carservice.jobmenu.show");
        //mp.events.call("jobs.set", player, 1);
    },
    "carservice.jobshape.enter": (player) => {
        if (player.character.job == 0) {
            player.call("carservice.jobmenu.show", [0]);
        } else {
            player.call("carservice.jobmenu.show", [1]);
            console.log('показываем увольнение')
        }
    },
    "carservice.jobshape.employment": (player) => {
        if (player.character.job == 1) {
            mp.events.call("jobs.leave", player);
        } else {
            mp.events.call("jobs.set", player, 1);
        }
    },
    "playerEnterColshape": (player, shape) => {
        if (shape.isCarService) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} зашел в колшейп carService`]);
            player.call('carservice.shape.enter');
        }
    },
    "playerExitColshape": (player, shape) => {
        if (shape.isCarService) {
            player.call('chat.message.push', [`!{#ffffff}${player.name} вышел с колшейпа carService`]);
            player.call('carservice.shape.leave');
        }
    },
    "carservice.diagnostics.offer": (player, targetId) => {
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
        //if (target.vehicle != vehicleToRepair) return;
        if (!sender) return;
        if (sender.senderDiagnosticsOffer.targetPlayer != target) return;

        if (accept) {
            console.log('accept');
            mp.events.call('carservice.diagnostics.preparation', sender, target);
            delete target.diagnosticsOffer;
            delete sender.senderDiagnosticsOffer;
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
        setTimeout(() => {
            console.log('отправляем preparation')
            player.call('carservice.diagnostics.preparation', [vehId]);
        }, 6000);

        player.repairTarget = target;
    },
    "carservice.diagnostics.start": (player, animType) => {
        let target = player.repairTarget;
        let vehicle = player.repairTargetVehicle;
        //let vehicle = target.vehicle;
        //if (target.vehicle != vehicle) return;
        //vehicle.setVariable('hood', true);
        vehicle.setVariable("hood", true);
        //player.heading = vehicle.heading - 180;
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

        }, 5000)
    },
    "carservice.diagnostics.end": (player) => {
        let target = player.repairTarget;
        let vehicle = player.repairTargetVehicle;
        //console.log(vehicle);
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

        if (Object.keys(checkData).length == 0) return target.call('notifications.push.success', ['Т/с не нуждается в ремонте', 'Диагностика']);
        target.call('carservice.check.show', [checkData])
    }

}