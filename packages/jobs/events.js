var jobs = require('./index.js');
var notifs = require('../notifications');

module.exports = {
    "init": () => {
        jobs.init();
    },
    "characterInit.done": (player) => {
        jobs.initJobSkills(player);
    },
    "jobs.set": (player, jobId) => {
        var header = `Устройство на работу`;
        var job = jobs.getJob(jobId);
        if (!job) return notifs.error(player, `Работа #${jobId} не найдена`, header);
        if (player.character.job == job.id) return notifs.error(player, `Вы уже ${job.name}`, header);

        jobs.addMember(player, job);
        notifs.success(player, `Вы устроились на работу`, job.name);
    },
    "jobs.leave": (player) => {
        var header = `Увольнение с работы`;
        if (!player.character.job) return notifs.error(player, `Вы не работаете`, header);
        var job = jobs.getJob(player.character.job);
        notifs.success(player, `Вы уволились с работы`, job.name);
        jobs.deleteMember(player);
    }
}
