let isInCasinoArea = false;

mp.events.add({
    "casino.area.enter": (enter) => {
        mp.chat.debug(`casino enter: ${enter}`);
        isInCasinoArea = enter;
        if (enter) {
            let items = [{
                text: `Бросить кости`,
                icon: `dice.svg`
            }];
            mp.callCEFV(`interactionMenu.addItems('player_interaction', ${JSON.stringify(items)})`);
        } else {
            mp.callCEFV(`interactionMenu.deleteItem('player_interaction', 'Бросить кости'`);
        }
    },
    "casino.dice.offer.create": () => {
        let entity = mp.getCurrentInteractionEntity();
        if (!entity || entity.type != 'player') return;
        mp.callCEFV(`inputWindow.name = 'dice';
        inputWindow.header = "Игра в кости (ID: ${entity.remoteId})";
        inputWindow.hint = "Введите сумму";
        inputWindow.inputHint = "Сумма игры...";
        inputWindow.value = "";
        inputWindow.show = true;
        inputWindow.playerId = ${entity.remoteId}
        `);
    }
});