let notifs = call('notifications');
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
    "player.donate.changed": (player) => {
        playerMenu.setDonate(player);
    },
    "player.warns.changed": (player) => {
        playerMenu.setWarns(player);
    },
    "player.slots.changed": (player) => {
        playerMenu.setSlots(player);
    },
    "player.promocode.activated": (player, promocode) => {
        var owner = mp.players.getBySqlId(promocode.characterId);
        if (owner && owner.character) {
            owner.character.Promocode = promocode;

            playerMenu.setInvited(owner);
            notifs.success(owner, `${player.name} активировал ваш промокод`);
        }
    },
    "player.promocode.changed": (player) => {
        playerMenu.setPromocode(player);
    },
    "player.completed.changed": (player) => {
        playerMenu.setCompleted(player);
    },
    "player.media.changed": (player) => {
        playerMenu.setMedia(player);
    },
    "player.password.changed": (player) => {
        playerMenu.setPasswordDate(player);
    },
    "player.email.changed": (player) => {
        playerMenu.setEmail(player);
    },
    "player.name.changed": (player) => {
        playerMenu.setName(player);
    },
}
