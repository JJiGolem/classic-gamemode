module.exports = {
    // Работы
    jobs: [],

    init() {
        this.loadJobsFromDB();
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
        if (typeof job == 'number') job = this.getJob(job);

        player.character.job = job.id;
        player.character.job.save();
    },
    deleteMember(player) {
        if (!player.character) return;

        player.character.job = null;
        player.character.job.save();
    },
}
