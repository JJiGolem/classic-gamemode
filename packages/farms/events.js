let farms = call('farms');
let money = call('money');
let notifs = call('notifications');

module.exports = {
    "init": () => {
        farms.init();
    },
    "farms.job.start": (player, index) => {
        var header = `Работа на ферме`
        if (!player.farm) return notifs.error(player, `Вы не у фермы`, header);
        if (player.farmJob) return notifs.error(player, `Увольтесь, чтобы сменить должность`, header);
        if (!player.farm.playerId) return notifs.error(player, `Ферма не имеет владельца`, header);

        player.farmJob = {
            type: Math.clamp(index, 0, 3),
            pay: 0,
            farm: player.farm,
        };

        farms.setJobClothes(player, true, player.farmJob.type);
        // player.utils.setLocalVar("farmJobType", player.farmJob.type);
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
        // player.utils.setLocalVar("farmJobType", null);
        notifs.success(player, `Работа на ферме завершена`, header);
        // player.utils.putObject();
        // if (player.farmJob.tractorColshape) {
        //     player.call("checkpoint.clearForTractor");
        //     player.farmJob.tractorColshape.destroy();
        // }
        delete player.farmJob;
    },
    "playerEnterVehicle": (player, vehicle, seat) => {
        if (!vehicle.db) return;
        if (vehicle.db.key != "farm") return;
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
            // player.call(`selectMenu.show`, [`farm_crop_loading`]);
        } else if (jobType == 2) { // тракторист
            // if (!vehicle.products.count) player.utils.info(`Загрузить зерно возможно у склада`);
            // player.utils.info(`Зерно: ${vehicle.products.count} / ${vehicle.products.maxCount} ед.`);
        }
    },
};
