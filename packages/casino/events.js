let casino = require('./index.js');
let money = call('money');
let notify = call('notifications');
let utils = call('utils');
let timer = call('timer');

module.exports = {
    "init": () => {
        casino.init();
        inited(__dirname);
    },
    "casino.dice.offer.send": (player, data) => {
        if (typeof(data) == 'string') data = JSON.parse(data);
        if (!data || !player.character) return;

        let target = mp.players.at(data.targetId);
        if (!target || !target.character) return notify.error(player, `Игрок не найден`);
        if (player == target) return notify.error(player, `Нельзя играть в кости с самим собой`); //comment for tests
        if (!casino.isPlayerInCasinoArea(player)) return notify.error(player, `Вы не в казино`);
        if (!casino.isPlayerInCasinoArea(target)) return notify.error(player, `Игрок не в казино`);
        if (player.dist(target.position) > 5) return notify.error(player, `Игрок далеко`);
        if (data.amount < casino.minDiceCash) return notify.warning(player, `Минимальная сумма: $${casino.minDiceCash}`);
        if (data.amount > casino.maxDiceCash) return notify.warning(player, `Максимальная сумма: $${casino.maxDiceCash}`);
        if (data.amount > player.character.cash) return notify.error(player, `У вас недостаточно денег`);
        if (data.amount > target.character.cash) return notify.error(player, `У игрока недостаточно денег`);
        if (player.hasActiveDiceOffer) return notify.error(player, `Вы уже отправили предложение`);
        if (target.hasActiveDiceOffer) return notify.error(player, `Игрок отправил предложение`);
        if (player.diceOffer) return notify.error(player, `Вам отправлено предложение`);
        if (target.diceOffer) return notify.error(player, `Игроку уже отправлено предложение`);

        notify.info(player, `Вы предложили игру в кости`);
        player.hasActiveDiceOffer = true;
        player.diceOfferTimeout = timer.add(() => {
            hasActiveDiceOffer = false;
        }, 10000);

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
            
        timer.remove(sender.diceOfferTimeout);

        if (accept) {
            let winner, loser, isDraw;
            let targetCount = utils.randomInteger(1, 6);
            let senderCount = utils.randomInteger(1, 6);
            //console.log(`sender ${senderCount} : target ${targetCount}`);

            if (senderCount > targetCount) {
                winner = sender;
                loser = target;
            } else if (targetCount > senderCount) {
                winner = target;
                loser = sender;
            } else {
                notify.info(target, `Вы сыграли в ничью`);
                notify.info(sender, `Вы сыграли в ничью`);
                isDraw = true;
            }
            
            if (!isDraw) {
                money.moveCash(loser, winner, offer.amount, function (result) {
                    if (result) {
                        notify.success(winner, `Поздравляем, вы выиграли!`);
                        notify.warning(loser, `К сожалению, вы проиграли!`);                      
                    } else {
                        notify.error(winner, `Финансовая ошибка`);
                        notify.error(loser, `Финансовая ошибка`);
                    }
                }, `Проигрыш в кости ID ${winner.character.id}`, `Победа в кости ${loser.character.id}`);
            }

            let data = {
                senderName: sender.name,
                senderId: sender.id,
                senderCount: senderCount,
                targetName: target.name,
                targetId: target.id,
                targetCount: targetCount
            }

            mp.players.forEachInRange(target.position, 5, (current) => {
                //console.log('push txt')
                current.call(`casino.dice.text.show`, [JSON.stringify(data)]);
            });
        } else {
            notify.warning(sender, 'Игрок отказался от игры в кости');
            notify.warning(target, 'Вы отказались от игры в кости');
            
        }
        sender.hasActiveDiceOffer = false;
        delete target.diceOffer;
    },
    "playerQuit": (player) => {
        timer.remove(player.diceOfferTimeout);
    }
}