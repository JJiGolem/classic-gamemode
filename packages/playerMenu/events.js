let playerMenu = call('playerMenu');

module.exports = {
    "characterInit.done": (player) => {
        playerMenu.init(player);
    },
    "jobSkillsInit.done": (player) => {
        playerMenu.setSkills(player);
    },
    "player.faction.changed": (player) => {
        playerMenu.setFaction(player);
    },
    "player.factionRank.changed": (player) => {
        playerMenu.setFactionRank(player);
    },
    "player.job.changed": (player) => {
        playerMenu.setJob(player);
    },
    "player.biz.changed": (player) => {
        debug(`player.biz.changed`)
        playerMenu.setBiz(player);
    },
    "player.house.changed": (player) => {
        debug(`player.house.changed`)
        playerMenu.setHouse(player);
    },
    "player.jobSkill.changed": (player, skill) => {
        playerMenu.setSkill(player, skill);
    },
}
