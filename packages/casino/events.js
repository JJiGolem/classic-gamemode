let casino = require('./index.js');
let money = call('money');
let notify = call('notifications');
let utils = call('utils');

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
            senderCharacterId: player.character.id,
            amount: data.amount
        }
        target.call(`offerDialog.show`, [`dice`, {
            id: player.id,
            amount: data.amount
        }]);
    },
    "casino.dice.offer.accept": (player, accept) => {
        let target = player;
        if (!target.diceOffer || !target.character) return;
        let offer = player.diceOffer;
        let sender = mp.players.at(offer.senderId);
        if (!sender || !sender.character || sender.character.id != offer.senderCharacterId)
            return notify.error(player, `Игрок отключился`);

        if (accept) {
            let targetCount = utils.randomInteger(1, 6);
            let senderCount = utils.randomInteger(1, 6);
            console.log(`sender ${senderCount} : target ${targetCount}`);
            let winner, loser;
            if (senderCount > targetCount) {
                winner = sender;
                loser = target;
                console.log('sender win')
            } else if (targetCount > senderCount) {
                winner = target;
                loser = sender;
                console.log('target win')
            } else {
                console.log('draw')
                // ничья
            }
        } else {
            notify.warning(sender, 'Игрок отказался от игры в кости');
            notify.warning(target, 'Вы отказались от игры в кости');
            delete target.diceOffer;
        }
    }
}