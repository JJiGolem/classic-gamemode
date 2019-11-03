let casino = require('./index.js');
let money = call('money');
let notify = call('notifications');

module.exports = {
    "init": () => {
        casino.init();
        inited(__dirname);
    },
    "casino.dice.offer.send": (player, data) => {
        data = JSON.parse(data);
        if (!data) return;

        let target = mp.players.at(data.targetId);
        if (!target || !target.character) return notify.error(player, `Игрок не найден`);
        // self dice check
        // area check
        // char check
        // amount check
        // offer timeout
        // target has offer check
        target.diceOffer = {
            senderId: player.id,
            amount: data.amount
        }
        target.call(`offerDialog.show`, [`dice`, {
            id: player.id,
            amount: data.amount
        }]);
    } 
}