const maxDistance = 25 * 25;
const width = 0.03;
const height = 0.0065;
const border = 0.001;
const color = [255, 255, 255, 255];

var FONT = 4;
var SIZE = 0.4;

mp.nametags.enabled = false;

let showNametags = true;
let localPlayer = mp.players.local;

function getCorrectName(player) {
    var factionId = localPlayer.getVariable("factionId");
    var isMember = factionId && factionId == player.getVariable("factionId");
    return (player.isFamiliar || isMember)? `${player.name} (${player.remoteId})` : `ID: ${player.remoteId}`;
}

mp.events.add('render', (nametags) => {

    if (!showNametags) return;

    const graphics = mp.game.graphics;
    const screenRes = graphics.getScreenResolution(0, 0);

    nametags.forEach(nametag => {
        let [player, x, y, distance] = nametag;

        if (distance <= maxDistance) {
            let scale = (distance / maxDistance);
            if (scale < 0.6) scale = 0.6;

            var health = player.getHealth() <= 100 ? player.getHealth() / 100 : ((player.getHealth() - 100) / 100);


            var armour = player.getArmour() / 100;

            y -= scale * (0.005 * (screenRes.y / 1080));
            var playerName = getCorrectName(player);
            var nameColor = player.nameColor || [255, 255, 255, 255];
            mp.game.graphics.drawText(playerName, [x, y],
                {
                    font: FONT,
                    color: nameColor,
                    scale: [SIZE, SIZE],
                    outline: true
                });

            if (mp.game.player.isFreeAimingAtEntity(player.handle)) {
                let y2 = y + 0.042;

                if (armour > 0) {
                    let x2 = x - width / 2 - border / 2;

                    graphics.drawRect(x2, y2, width + border * 2, 0.0085, 0, 0, 0, 200);
                    graphics.drawRect(x2, y2, width, height, 150, 150, 150, 255);
                    graphics.drawRect(x2 - width / 2 * (1 - health), y2, width * health, height, 255, 255, 255, 200);

                    x2 = x + width / 2 + border / 2;

                    graphics.drawRect(x2, y2, width + border * 2, height + border * 2, 0, 0, 0, 200);
                    graphics.drawRect(x2, y2, width, height, 41, 66, 78, 255);
                    graphics.drawRect(x2 - width / 2 * (1 - armour), y2, width * armour, height, 48, 108, 135, 200);
                }
                else {
                    graphics.drawRect(x, y2, width + border * 2, height + border * 2, 0, 0, 0, 200);
                    graphics.drawRect(x, y2, width, height, 150, 150, 150, 255);
                    graphics.drawRect(x - width / 2 * (1 - health), y2, width * health, height, 255, 255, 255, 200);
                }
            }
        }
    })
})

/*mp.keys.bind(0x75, true, function () { /// Включение/отключение ников на F6
    if (showNametags) {
        showNametags = false;
    } else {
        showNametags = true
    }
});*/

mp.events.add({
    "nametags.show": (val) => {
        showNametags = val;
    },
});
