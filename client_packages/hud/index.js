var prevValues = {};

mp.events.add('hud.load', () => {
    // TODO: считать якорь
    mp.callCEFVN({"hud.show" : true});
});

mp.events.add("hud.setData", (data) => {
    for (var key in data) {
        if (prevValues[key] == data[key]) continue;
        prevValues[key] = data[key];

        if (typeof data[key] == 'string') data[key] = `'${data[key]}'`;
        mp.callCEFV(`hud.${key} = ${data[key]}`);
    }
});

mp.events.add("hud.tick", () => {
    var pos = mp.players.local.position;
    mp.events.call("hud.setData", {
        street: getStreetName(pos),
        region: getRegionName(pos)
    });
});

// TEMP: Перенести в index/base

function getStreetName(pos) {
    var getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
    var streetName = mp.game.ui.getStreetNameFromHashKey(getStreet["streetName"]);
    return streetName;
}

function getRegionName(pos) {
    return mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z));
}

var mainTimerId = setInterval(() => { mp.events.call('hud.tick') }, 1000);