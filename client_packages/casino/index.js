let isInCasinoArea = false;

let peds = [{
    model: "s_m_y_valet_01",
    position: {
        x: 1088.1507568359375,
        y: 221.13722229003906,
        z: -49.200416564941406,
        d: 1
    },
    heading: 179.3302764892578,
}
];

let infoMarker = mp.markers.new(1, new mp.Vector3(1088.2305908203125, 219.5839080810547, -49.200382232666016 - 1.1), 0.4,
    {
        color: [255, 143, 190, 111],
        visible: true,
        dimension: 1
    });

mp.events.add({
    "casino.area.enter": (enter) => {
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
    },
    "casino.dice.text.show": (data) => {
        data = JSON.parse(data);
        data.senderName = mp.chat.correctName(data.senderName);
        data.targetName = mp.chat.correctName(data.targetName);
        mp.events.call('chat.message.push',
            `!{#dd90ff}${data.senderName}[${data.senderId}] и ${data.targetName}[${data.targetId}] бросили кости. Результат: !{#fff5a6}${data.senderCount}:${data.targetCount}`);
    },
    "characterInit.done": () => {
        peds.forEach((current) => {
            mp.events.call('NPC.create', current);
        })
    },
    "casino.info.show": (show) => {
        if (show) {
            mp.callCEFV(`modal.showByName('casino_help')`)
        } else {
            mp.callCEFV(`modal.show = false`)
        }    
    }
});