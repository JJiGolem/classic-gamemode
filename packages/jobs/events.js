var jobs = require('./index.js');
module.exports = {
    "init": () => {
        jobs.init();
    },
    "jobs.set": (player, jobId) => {
        try {
            player.character.update({
                job: jobId
            });
            player.character.job = jobId;
            player.call('notifications.push.success', ['Вы устроились на работу', 'Успешно']);
        } catch (err) {
            console.log(err);
            player.call('notifications.push.error', ['Не удалось устроиться', 'Ошибка']);
        }
    }
}