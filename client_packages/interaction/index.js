try {


const INTERACTION_RANGE = 3.5;
const classesToIgnore = [8, 13, 14, 15, 16];
const defaultLeft = 80;
const vehicleLeft = 95;

let currentInteractionEntity;
let currentVehicle;
let isOpen = false;

let occupantsToEject = [];

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
    mp.busy.add('interaction');
    isOpen = true;
    mp.gui.cursor.show(true, true);
    mp.callCEFV('interactionMenu.show = true');
});

mp.events.add('interaction.menu.close', () => {
    mp.busy.remove('interaction');
    isOpen = false;
    mp.gui.cursor.show(false, false);
    mp.callCEFV('interactionMenu.show = false');
});

mp.events.add('playerLeaveVehicle', () => {
    currentInteractionEntity = null;
});
mp.events.add('characterInit.done', () => { /// E
    mp.keys.bind(0x45, true, function () {
        if (isOpen) mp.busy.remove('interaction');
        if (mp.busy.includes()) return;
        if (isOpen) return mp.events.call('interaction.menu.close');;

        if (mp.players.local.vehicle) return;

        currentInteractionEntity = getClosestVehicle(mp.players.local.position);
        if (!currentInteractionEntity) return;


        mp.callCEFV('interactionMenu.menu = cloneObj(interactionMenu.menus["vehicle"])');
        mp.callCEFV(`interactionMenu.left = ${defaultLeft}`);
        mp.chat.debug(currentInteractionEntity.getClass());
        let vehClass = currentInteractionEntity.getClass();
        if (classesToIgnore.includes(vehClass)) {
            mp.callCEFV('interactionMenu.menu.items.splice(1, 2)');
        }
        mp.events.call('interaction.menu.show');

    });

    mp.keys.bind(0x4C, true, function () { /// L
        if (isOpen) mp.busy.remove('interaction');
        if (mp.busy.includes()) return;
        if (isOpen) return mp.events.call('interaction.menu.close');;

        if (!mp.players.local.vehicle) return;

        currentInteractionEntity = mp.players.local.vehicle;
        if (!currentInteractionEntity) return;

        mp.callCEFV(`interactionMenu.left = ${vehicleLeft}`);
        mp.callCEFV('interactionMenu.menu = cloneObj(interactionMenu.menus["vehicle_inside"])');

        mp.chat.debug(currentInteractionEntity.getClass());
        let vehClass = currentInteractionEntity.getClass();
        if (vehClass == 18) {
            mp.callCEFV(`interactionMenu.menu.items.push({
                text: "Звук сирены",
                icon: "siren.png"
            });`);
        }

        mp.events.call('interaction.menu.show');

    });
});


mp.events.add('render', () => {
    if (!currentInteractionEntity) return;
    try {
        let dist = vdist(mp.players.local.position, currentInteractionEntity.position);
        if (dist > INTERACTION_RANGE) {
            currentInteractionEntity = null;
            mp.events.call('interaction.menu.close');
        }
    } catch (err) {
        mp.chat.debug('Entity уничтожена');
        currentInteractionEntity = null;
    }
});

mp.events.add('interaction.ejectlist.get', () => {
    mp.events.callRemote('vehicles.ejectlist.get', currentInteractionEntity.remoteId);
});

mp.events.add('interaction.ejectlist.show', (list) => {
    occupantsToEject = list;


    mp.callCEFV(`interactionMenu.left = ${vehicleLeft}`);
    mp.callCEFV('interactionMenu.menu = cloneObj(interactionMenu.menus["vehicle_ejectlist"])');
    occupantsToEject.forEach((current) => {
        mp.chat.debug(`${current.id} ${current.name}`);
        mp.callCEFV(`interactionMenu.menu.items.push({
            text: "ID: ${current.id}",
            icon: "person.png"
        });`);
    });
    mp.events.call('interaction.menu.show');

});

mp.events.add('interaction.eject', (index) => {
    if (!currentInteractionEntity) return;
    if (currentInteractionEntity.type != 'vehicle') return;
    let playerToEject = occupantsToEject[index];
    mp.chat.debug(`${index}`);
    mp.chat.debug(`${occupantsToEject[index].name}`);
    mp.events.callRemote('vehicles.eject', JSON.stringify(playerToEject));
});
} catch(err) {
    mp.chat.debug(err);
}