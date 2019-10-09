mp.attachmentMngr = {
    attachments: {},

    addFor: function(entity, id) {
        if (this.attachments.hasOwnProperty(id)) {
            if (entity && entity.__attachmentObjects && !entity.__attachmentObjects.hasOwnProperty(id)) {
                let attInfo = this.attachments[id];
                let object = mp.objects.new(attInfo.model, entity.position);
                if (attInfo.lost) object.lost = attInfo.lost;

                object.attachTo(entity.handle,
                    (typeof(attInfo.boneName) === 'string') ? entity.getBoneIndexByName(attInfo.boneName) : entity.getBoneIndex(attInfo.boneName),
                    attInfo.offset.x, attInfo.offset.y, attInfo.offset.z,
                    attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z,
                    false, false, false, false, 2, true);

                entity.__attachmentObjects[id] = object;

                var a = attInfo.anim;
                if (a) {
                    entity.clearTasksImmediately();
                    mp.utils.requestAnimDict(a.dict, () => {
                        entity.taskPlayAnim(a.dict, a.name, a.speed, 0, -1, a.flag, 0, false, false, false);
                    });
                }
            }
        } else {
            mp.game.graphics.notify(`Static Attachments Error: ~r~Unknown Attachment Used: ~w~0x${id.toString(16)}`);
        }
    },

    removeFor: function(entity, id) {
        if (entity && entity.__attachmentObjects && entity.__attachmentObjects.hasOwnProperty(id)) {
            let obj = entity.__attachmentObjects[id];
            delete entity.__attachmentObjects[id];

            if (mp.objects.exists(obj)) {
                obj.destroy();
            }
            entity.clearTasksImmediately();
        }
    },

    initFor: function(entity) {
        for (let attachment of entity.__attachments) {
            mp.attachmentMngr.addFor(entity, attachment);
        }
    },

    shutdownFor: function(entity) {
        for (let attachment in entity.__attachmentObjects) {
            mp.attachmentMngr.removeFor(entity, attachment);
        }
    },

    register: function(id, model, boneName, offset, rotation, anim = null, lost = false) {
        if (typeof(id) === 'string') {
            id = mp.game.joaat(id);
        }

        if (typeof(model) === 'string') {
            model = mp.game.joaat(model);
        }

        if (!this.attachments.hasOwnProperty(id)) {
            if (mp.game.streaming.isModelInCdimage(model)) {
                this.attachments[id] = {
                    id: id,
                    model: model,
                    offset: offset,
                    rotation: rotation,
                    boneName: boneName,
                    anim: anim,
                    lost: lost,
                };
            } else {
                mp.game.graphics.notify(`Static Attachments Error: ~r~Invalid Model (0x${model.toString(16)})`);
            }
        } else {
            mp.game.graphics.notify("Static Attachments Error: ~r~Duplicate Entry");
        }
    },

    unregister: function(id) {
        if (typeof(id) === 'string') {
            id = mp.game.joaat(id);
        }

        if (this.attachments.hasOwnProperty(id)) {
            this.attachments[id] = undefined;
        }
    },

    addLocal: function(attachmentName) {
        if (typeof(attachmentName) === 'string') {
            attachmentName = mp.game.joaat(attachmentName);
        }

        let entity = mp.players.local;

        if (!entity.__attachments || entity.__attachments.indexOf(attachmentName) === -1) {
            mp.events.callRemote("staticAttachments.Add", attachmentName.toString(36));
        }
    },

    removeLocal: function(attachmentName) {
        if (typeof(attachmentName) === 'string') {
            attachmentName = mp.game.joaat(attachmentName);
        }

        let entity = mp.players.local;

        if (entity.__attachments && entity.__attachments.indexOf(attachmentName) !== -1) {
            mp.events.callRemote("staticAttachments.Remove", attachmentName.toString(36));
        }
    },

    getAttachments: function() {
        return Object.assign({}, this.attachments);
    }
};

mp.events.add("entityStreamIn", (entity) => {
    if (entity.__attachments) {
        mp.attachmentMngr.initFor(entity);
    }

    entity.hasAttachment = (name) => {
        if (!entity.__attachmentObjects) return false;
        return entity.__attachmentObjects.hasOwnProperty(mp.game.joaat(name));
    };
});

mp.events.add("entityStreamOut", (entity) => {
    if (entity.__attachmentObjects) {
        mp.attachmentMngr.shutdownFor(entity);
    }
});

mp.events.add("render", () => {
    var player = mp.players.local;
    if (!player.__attachmentObjects) return;
    for (var id in player.__attachmentObjects) {
        id = parseInt(id);
        var object = player.__attachmentObjects[id];
        if (!object.lost) continue;
        if (player.isJumping() || player.isShooting() || player.isSwimming() || player.isFalling()) {
            mp.attachmentMngr.removeLocal(id);
            mp.attachmentMngr.removeFor(player, id);
            mp.notify.error(`Вы уронили груз`);
        }
    }
});

mp.events.add("playerStartEnterVehicle", () => {
    var player = mp.players.local;
    if (!player.__attachmentObjects) return;
    for (var id in player.__attachmentObjects) {
        id = parseInt(id);
        var object = player.__attachmentObjects[id];
        if (!object.lost) continue;
        mp.attachmentMngr.removeLocal(id);
        mp.attachmentMngr.removeFor(player, id);
    }
});

mp.events.addDataHandler("attachmentsData", (entity, data) => {
    let newAttachments = (data.length > 0) ? data.split('|').map(att => parseInt(att, 36)) : [];

    if (entity.handle !== 0) {
        let oldAttachments = entity.__attachments;

        if (!oldAttachments) {
            oldAttachments = [];
            entity.__attachmentObjects = {};
        }

        // process outdated first
        for (let attachment of oldAttachments) {
            if (newAttachments.indexOf(attachment) === -1) {
                mp.attachmentMngr.removeFor(entity, attachment);
            }
        }

        // then new attachments
        for (let attachment of newAttachments) {
            if (oldAttachments.indexOf(attachment) === -1) {
                mp.attachmentMngr.addFor(entity, attachment);
            }
        }
    }

    entity.__attachments = newAttachments;
});

function InitAttachmentsOnJoin() {
    mp.players.forEach(_player => {
        let data = _player.getVariable("attachmentsData");

        if (data && data.length > 0) {
            let atts = data.split('|').map(att => parseInt(att, 36));
            _player.__attachments = atts;
            _player.__attachmentObjects = {};
        }
        _player.hasAttachment = (name) => {
            if (!_player.__attachmentObjects) return false;
            return _player.__attachmentObjects.hasOwnProperty(mp.game.joaat(name));
        };
    });
}

InitAttachmentsOnJoin();

// для настройки аттачей
mp.events.add({
    "attaches.test": (model, bone, x, y, z, rX, rY, rZ) => {
        var player = mp.players.local;
        bone = player.getBoneIndex(bone);
        if (player.testAttach) player.testAttach.destroy();
        player.testAttach = mp.objects.new(mp.game.joaat(model), player.position, {
            rotation: new mp.Vector3(0, 0, 30),
            dimension: -1
        });
        player.testAttach.attachTo(player.handle, bone, x, y, z, rX, rY, rZ,
            false, false, false, false, 2, true);
    },
    "attaches.testoff": () => {
        var player = mp.players.local;
        if (player.testAttach) {
            player.testAttach.destroy();
            delete player.testAttach;
        }
    },
});
