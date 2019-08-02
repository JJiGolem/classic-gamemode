const INTERACTION_RANGE = 3.5;
const classesToIgnore = [8, 13, 14, 15, 16];
const defaultLeft = 50;
const vehicleLeft = 60;

let currentInteractionEntity;
let currentVehicle;
let isOpen = false;

let occupantsToEject = [];

mp.getCurrentInteractionEntity = () => {
    return currentInteractionEntity;
}

mp.getDefaultInteractionLeft = () => {
    return defaultLeft;
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
    return closestVehicle;
}

function getClosestPlayer(pos, range = INTERACTION_RANGE) {
    var closestPlayer;
    var minDist = 99999;
    mp.players.forEachInStreamRange((current) => {
        if (current == mp.players.local) return;
        var distToPlayer = vdist(pos, current.position);
        if (distToPlayer < range) {
            if (distToPlayer < minDist) {
                closestPlayer = current;
                minDist = distToPlayer;
            }
        }
    });
    return closestPlayer;
}


function getClosestPlayerOrVehicle(pos) {
    mp.chat.debug('ищем');
    var closestPlayer = getClosestPlayer(pos);
    var closestVehicle = getClosestVehicle(pos);
    if (!closestPlayer) {
        mp.chat.debug('возвращаем тс')
        return closestVehicle;
    };
    if (!closestVehicle) {
        mp.chat.debug('возвращаем игрока')
        return closestPlayer;
    }
    var distToPlayer = vdist(pos, closestPlayer.position);
    mp.chat.debug(`player ${distToPlayer}`);

    var distToVehicle = vdist(pos, closestVehicle.position);
    mp.chat.debug(`vehicle ${distToVehicle}`);
    if (distToPlayer <= distToVehicle) {
        mp.chat.debug('возвращаем игрока')
        return closestPlayer;
    } else return closestVehicle;
}

mp.events.add('interaction.menu.show', () => {
    mp.chat.debug('show');
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


        let veh = mp.players.local.getVehicleIsTryingToEnter();
        if (veh) return;


        if (mp.players.local.vehicle) return;
        //getClosestPlayer(mp.players.local.position);
        //currentInteractionEntity = getClosestVehicle(mp.players.local.position);
        currentInteractionEntity = getClosestPlayerOrVehicle(mp.players.local.position);
        if (!currentInteractionEntity) return;

        if (currentInteractionEntity.type == 'vehicle') {
            mp.callCEFV('interactionMenu.menu = cloneObj(interactionMenu.menus["vehicle"])');
            mp.callCEFV(`interactionMenu.left = ${defaultLeft}`);

            let vehClass = currentInteractionEntity.getClass();
            if (classesToIgnore.includes(vehClass)) {
                mp.callCEFV('interactionMenu.menu.items.splice(1, 2)');
            }
            mp.events.call('interaction.menu.show');
        } else if (currentInteractionEntity.type == 'player') {
            mp.callCEFV('interactionMenu.menu = cloneObj(interactionMenu.menus["player_interaction"])');
            mp.callCEFV(`interactionMenu.left = ${defaultLeft}`);
            mp.events.call('interaction.menu.show');
        }

    });

    mp.keys.bind(0x4C, true, function () { /// L
        if (isOpen) mp.busy.remove('interaction');
        if (mp.busy.includes()) return;
        if (isOpen) return mp.events.call('interaction.menu.close');;

        if (!mp.players.local.vehicle) {
            currentInteractionEntity = mp.players.local;
            mp.callCEFV(`interactionMenu.left = ${defaultLeft}`);
            mp.callCEFV('interactionMenu.menu = cloneObj(interactionMenu.menus["player_ownmenu"])');
            mp.events.call('interaction.menu.show');
        } else if (mp.players.local.vehicle.getPedInSeat(-1) == mp.players.local.handle) {
            currentInteractionEntity = mp.players.local.vehicle;
            if (!currentInteractionEntity) return;

            mp.callCEFV(`interactionMenu.left = ${vehicleLeft}`);
            mp.callCEFV('interactionMenu.menu = cloneObj(interactionMenu.menus["vehicle_inside"])');

            let vehClass = currentInteractionEntity.getClass();
            if (vehClass == 18) {
                mp.callCEFV(`interactionMenu.menu.items.push({
                    text: "Звук сирены",
                    icon: "siren.png"
                });`);
            }
            mp.events.call('interaction.menu.show');
        }
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