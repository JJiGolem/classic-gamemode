const INTERACTION_RANGE = 3;
var currentInteractionEntity;
var isOpen = false;

mp.getCurrentInteractionEntity = () => {
    return currentInteractionEntity;
}

function vdist(posA, posB) {
    if (!posA || !posB) return Number.MAX_VALUE;
    return mp.game.system.vdist(posA.x, posA.y, posA.z, posB.x, posB.y, posB.z);
}

function getClosestVehicle(pos, range = INTERACTION_RANGE) {
    var closestVehicle;
    var minDist = 99999;
    mp.vehicles.forEachInStreamRange((veh) => {
        var distToVeh = vdist(pos, veh.position);
        mp.chat.debug(JSON.stringify(distToVeh));
        mp.chat.debug(veh.model);
        if (distToVeh < range) {
            if (distToVeh < minDist) {
                closestVehicle = veh;
                minDist = distToVeh;
            }
        }
    });
    mp.chat.debug('MINIMAL:');
    mp.chat.debug(closestVehicle.model);
    return closestVehicle;
}

mp.events.add('interaction.menu.show', () => {
    isOpen = true;
    mp.gui.cursor.show(true, true);
    mp.callCEFV('interactionMenu.show = true');
});

mp.events.add('interaction.menu.close', () => {
    isOpen = false;
    mp.gui.cursor.show(false, false);
    mp.callCEFV('interactionMenu.show = false');
});

mp.keys.bind(0x45, true, function () {
    if (mp.busy.includes()) return;
    if (mp.players.local.vehicle) return;
    if (isOpen) return mp.events.call('interaction.menu.close');
    currentInteractionEntity = getClosestVehicle(mp.players.local.position);
    mp.callCEFV('interactionMenu.menu = interactionMenu.menus["vehicle"]');
    mp.events.call('interaction.menu.show');
    if (!veh) return;
});

mp.events.add('render', () => {
    if (!currentInteractionEntity) return;
    let dist = vdist(mp.players.local.position, currentInteractionEntity.position);
    if (dist > INTERACTION_RANGE) {
        currentInteractionEntity = null;
        mp.events.call('interaction.menu.close');
    }
});