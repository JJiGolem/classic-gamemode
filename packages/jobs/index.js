let money = require('../money');
let notifs = require('../notifications');

module.exports = {
    // Работы
    jobs: [],
    // Бонус к скиллам (1 - x1)
    bonusSkill: 2,
    // Бонус к ЗП (1 - x1)
    bonusPay: 1,

    async init() {
        await this.loadJobsFromDB();
    },
    async loadJobsFromDB() {
        var dbJobs = await db.Models.Job.findAll();
        this.jobs = dbJobs;
        console.log(`[JOBS] Работы загужены (${dbJobs.length} шт.)`);
    },
    getJob(id) {
        return this.jobs[id - 1];
    },
    addMember(player, job) {
        if (!player.character) return;
        if (player.character.factionId) return;
        if (typeof job == 'number') job = this.getJob(job);
        if (player.farmJob && job.id != 5) mp.events.call("farms.job.stop", player);

        player.character.job = job.id;
        player.character.save();

        mp.events.call("player.job.changed", player);
    },
    deleteMember(player) {
        if (!player.character) return;
        if (player.farmJob) mp.events.call("farms.job.stop", player);

        player.character.job = null;
        player.character.save();

        mp.events.call("player.job.changed", player);
    },
    async initJobSkills(player) {
        player.character.jobSkills = [];
        for (var i = 0; i < this.jobs.length; i++) {
            var job = this.jobs[i];
            var skill = await db.Models.JobSkill.findOrCreate({
                where: {
                    characterId: player.character.id,
                    jobId: job.id
                }
            });
            player.character.jobSkills.push(skill[0]);
        }
        mp.events.call("jobSkillsInit.done", player);
    },
    getJobSkill(player, job = null) {
        if (!player.character) return;
        if (!job) job = player.character.job;
        if (typeof job == 'number') job = this.getJob(job);
        var skills = player.character.jobSkills;
        for (var i = 0; i < skills.length; i++) {
            if (skills[i].jobId == job.id) return skills[i];
        }
        return null;
    },
    addJobExp(player, exp = 1) {
        if (!player.character.job) return;
        var skill = this.getJobSkill(player);
        skill.exp += exp * this.bonusSkill;
        skill.save();

        mp.events.call("player.jobSkill.changed", player, skill);
    },
    setJobExp(player, skill, exp) {
        var oldExp = skill.exp;

        skill.exp = oldExp + (exp - oldExp) * this.bonusSkill;
        skill.save();

        mp.events.call("player.jobSkill.changed", player, skill);
    },
    pay(player) {
        if (!player.character.pay) return;

        money.addMoney(player, player.character.pay, (res) => {
            if (!res) return console.log(`[jobs] Ошибка выдачи ЗП для ${player.name}`);
            notifs.info(player, `Получена зарплата`, `Работа`);
            player.character.pay = 0;
            player.character.save();
        }, `Зарплата работ`);
    },
    clearJobApps(player) {
        if (!player.character) return;
        if (player.character.job == 2) {
            player.call('phone.app.remove', ['taxi']);
        }
    },
    getJobName(player) {
        if (!player.character.job) return null;
        return this.getJob(player.character.job).name;
    },
    getJobNameById(jobId) {
        let job = this.getJob(jobId);
        if (job == null) return null;
        return job.name;
    },
    sayRadio(player, text) {
        let job = player.character.job;
        if (!job) return;
        let jobName = this.getJobNameById(job);
        mp.players.forEach(current => {
            if (!current.character) return;
            if (current.character.job != job) return;
            current.call('chat.action.walkietalkie', [player.name, player.id, jobName, text, true]);
        });
    },
}
