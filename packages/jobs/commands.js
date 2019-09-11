let jobs = call('jobs');
let notifs = call('notifications');

module.exports = {
    "/jadd": {
        access: 4,
        description: "Сменить работу игрока.",
        args: "[ид_игрока]:n [ид_работы]:n",
        handler: (player, args, out) => {
            var job = jobs.getJob(args[1]);
            if (!job) return out.error(`Работа #${args[1]} не найдена`, player);
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            jobs.addMember(rec, job);
            out.info(`${player.name} устроил ${rec.name} на работу ${job.name}`);
            notifs.info(rec, `${player.name} устроил вас на работу`, job.name);
        }
    },
}
