mp.game.graphics.transitionFromBlurred(500);

let controlsDisabled = false;
let isOpen = false;
let currentType;
let carPassList = [];

mp.events.add('documents.show', (type, data) => {
    if (isOpen) return;
    setTimeout(() => {
        isOpen = true;
    }, 500);
    controlsDisabled = true;
    mp.game.graphics.transitionToBlurred(500);
    mp.gui.cursor.show(true, true);
    mp.events.call("prompt.showByName", 'documents_close');

    currentType = type;
    if (type == 'carPass') {
        switch (data.vehType) {
            case 0:
                data.vehType = 'Автомобиль'
                break;
        }
        for (var key in data) {
            if (typeof data[key] == 'string') data[key] = `'${data[key]}'`;
            mp.callCEFV(`carPass.${key} = ${data[key]}`);
        }
        mp.callCEFV('carPass.show = true');
    }
    if (type == 'characterPass') {
        data.name = data.name.split(' ');
        data.fName = data.name[0];
        data.sName = data.name[1];
        delete data.name;
        for (var key in data) {
            if (typeof data[key] == 'string') data[key] = `'${data[key]}'`;
            mp.callCEFV(`characterPass.${key} = ${data[key]}`);
        }
        mp.callCEFV('characterPass.show = true');
    }
    if (type == 'driverLicense') {
        mp.chat.debug(data.categories);
        for (var key in data) {
            if (typeof data[key] == 'string') data[key] = `'${data[key]}'`;
            mp.callCEFV(`driverLicense.${key} = ${data[key]}`);
        }
        // for (let i = 0; i < data.categories.length; i++) {
        //     mp.callCEFV(`carPass.categories[${i}] = ${data.categories[i]}`);
        // }

        mp.callCEFV(`driverLicense.categories = [${data.categories[0]}, ${data.categories[1]}, ${data.categories[2]}, ${data.categories[3]}, ${data.categories[4]}, ${data.categories[5]}]`);
        mp.callCEFV('driverLicense.show = true');
    }
});

mp.events.add('documents.close', (type, data) => {
    if (!isOpen) return;
    setTimeout(() => {
        isOpen = false;
    }, 500);

    switch (currentType) {
        case 'carPass':
            mp.callCEFV('carPass.show = false');
            break;
        case 'characterPass':
            mp.callCEFV('characterPass.show = false');
            break;
        case 'driverLicense':
            mp.callCEFV('driverLicense.show = false');
            break;
    }

    mp.game.graphics.transitionFromBlurred(500);
    mp.gui.cursor.show(false, false);
    mp.events.call("prompt.hide");
    controlsDisabled = false;
});

mp.keys.bind(0x1B, false, function () {
    mp.chat.debug(isOpen);
    if (!isOpen) return;
    mp.events.call('documents.close');
});


mp.events.add('render', () => {
    if (controlsDisabled) {
        mp.game.controls.disableControlAction(1, 200, true);
    }
});

mp.events.add('documents.list', () => {
    mp.callCEFV('interactionMenu.menu = cloneObj(interactionMenu.menus["player_docs"])');

    let left = mp.getDefaultInteractionLeft();
    mp.chat.debug(left);
    mp.callCEFV(`interactionMenu.left = ${left}`);
    mp.events.call('interaction.menu.show');


});

mp.events.add('documents.showTo', (type) => {
    let target = mp.getCurrentInteractionEntity();
    //mp.events.call('documents.showTo', type, mp.players.local.remoteId)
    //mp.events.call('documents.showTo', type, mp.players.local.remoteId)
    switch (type) {
        case "carPass":
            //mp.events.call('documents.offer', "carPass", mp.players.local.remoteId, currentCarPassVehicle);
            mp.events.call('documents.carPass.list');
            break;
        case "characterPass":
            mp.events.call('documents.offer', "characterPass", target.remoteId);
            break;
        case "driverLicense":
            mp.events.call('documents.offer', "driverLicense", target.remoteId);
            break;
    }
});

mp.events.add('documents.offer', (type, id, data) => {
    mp.events.callRemote('documents.offer', type, id, data);
});


mp.events.add('documents.carPass.list', () => {
    mp.events.callRemote('documents.carPass.list');
});

mp.events.add('documents.carPass.list.show', (list) => {
    carPassList = list;
    if (!carPassList) return;
    let left = mp.getDefaultInteractionLeft();
    mp.callCEFV(`interactionMenu.left = ${left}`);
    mp.callCEFV('interactionMenu.menu = cloneObj(interactionMenu.menus["carPass_list"])');
    carPassList.forEach((current) => {
        mp.chat.debug(`${current.id} ${current.plate}`);
        mp.callCEFV(`interactionMenu.menu.items.push({
            text: "Т/С: ${current.plate}",
            icon: "car.png"
        });`);
    });
    mp.events.call('interaction.menu.show');
});

mp.events.add('documents.carPass.list.choose', (plate) => {
    mp.chat.debug(plate);
    for (let i = 0; i < carPassList.length; i++) {
        if (carPassList[i].plate == plate) {
            mp.events.callRemote('documents.offer', "carPass", mp.players.local.remoteId, JSON.stringify(carPassList[i]));
        }
    }
});