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
    }
}