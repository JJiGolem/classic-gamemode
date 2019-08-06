/// Пример создания NPC

mp.events.add("NPC.create", (data) => {
    let ped = mp.peds.new(mp.game.joaat(data.model), new mp.Vector3(data.position.x, data.position.y, data.position.z), data.heading, 0);

    if (data.defaultScenario) {
        ped.defaultScenario = data.defaultScenario;
    }

    if (data.marker) {
        mp.markers.new(1, new mp.Vector3(data.marker.x, data.marker.y, data.marker.z), 0.4,
            {
                direction: new mp.Vector3(data.marker.x, data.marker.y, data.marker.z),
                rotation: 0,
                color: data.marker.color,
                visible: true,
                dimension: 0
            });
        let shape = mp.colshapes.newSphere(data.marker.x, data.marker.y, data.marker.z + 1, 0.7);
        shape.pos = new mp.Vector3(data.marker.x, data.marker.y, data.marker.z);
        shape.isNPC = true;
        shape.NPCid = ped.id;
        shape.NPCevent = data.marker.eventName;
    }
});

mp.events.add("playerEnterColshape", (shape) => {
    if (shape.isNPC && shape.NPCevent) {
        mp.chat.debug('1');
        mp.events.call(shape.NPCevent);
        mp.peds.at(shape.NPCid).setComponentVariation(0, 2, 0, 0);
        mp.peds.at(shape.NPCid).setComponentVariation(3, 2, 0, 0);
    }
});


mp.events.add("entityStreamIn", (entity) => {
    if (entity.type == 'ped') {
        if (entity.defaultScenario) {
            entity.taskStartScenarioInPlace(entity.defaultScenario, 0, false);
        }
    }
});