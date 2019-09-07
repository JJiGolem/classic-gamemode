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
};
