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

        jobs.addMember(player, job);
        notifs.success(player, `Вы устроились на работу - ${job.name}`, header);
    },
    "jobs.leave": (player) => {
        notifs.success(player, `Вы уволились с работы`, header);
        jobs.deleteMember(player);
    }
}
