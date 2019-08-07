var carservice = require('./index.js');
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
    }
}