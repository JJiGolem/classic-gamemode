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
            case 1:
                data.vehType = 'Мотоцикл'
                break;
            case 2:
                data.vehType = 'Велосипед'
                break;
        }
        let newDate = data.regDate ? data.regDate.slice(0, 10) : null;
        data.regDate = dateFormatter(newDate);
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

        let newDate = data.regDate.slice(0, 10);
        data.regDate = dateFormatter(newDate);
        for (var key in data) {
            if (typeof data[key] == 'string') data[key] = `'${data[key]}'`;
            mp.callCEFV(`characterPass.${key} = ${data[key]}`);
        }
        mp.callCEFV('characterPass.show = true');
    }
    if (type == 'driverLicense') {
        for (var key in data) {
            if (typeof data[key] == 'string') data[key] = `'${data[key]}'`;
            mp.callCEFV(`driverLicense.${key} = ${data[key]}`);
        }
        mp.callCEFV(`driverLicense.categories = [${data.categories[0]}, ${data.categories[1]}, ${data.categories[2]}, ${data.categories[3]}, ${data.categories[4]}, ${data.categories[5]}]`);
        mp.callCEFV('driverLicense.show = true');
    }
    if (type == 'gunLicense') {
        let newDate = data.date ? data.date.slice(0, 10) : null;
        data.date = dateFormatter(newDate);
        for (var key in data) {
            if (typeof data[key] == 'string') data[key] = `'${data[key]}'`;
            mp.callCEFV(`gunLicense.${key} = ${data[key]}`);
        }
        mp.callCEFV('gunLicense.show = true');
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
        case 'gunLicense':
            mp.callCEFV('gunLicense.show = false');
            break;
    }

    mp.game.graphics.transitionFromBlurred(500);
    mp.gui.cursor.show(false, false);
    mp.events.call("prompt.hide");
    controlsDisabled = false;
});

mp.keys.bind(0x1B, false, function () {
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
    mp.callCEFV(`interactionMenu.left = ${left}`);
    mp.events.call('interaction.menu.show');


});

mp.events.add('documents.showTo', (type) => {
    let target = mp.getCurrentInteractionEntity();
    switch (type) {
        case "carPass":
            mp.events.call('documents.carPass.list');
            break;
        case "characterPass":
            mp.events.call('documents.offer', "characterPass", target.remoteId);
            break;
        case "driverLicense":
            mp.events.call('documents.offer', "driverLicense", target.remoteId);
            break;
        case "gunLicense":
            mp.events.call('documents.offer', "gunLicense", target.remoteId);
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
        mp.callCEFV(`interactionMenu.menu.items.push({
            text: "Т/С: ${current.plate}",
            icon: "car.png"
        });`);
    });
    mp.events.call('interaction.menu.show');
});

mp.events.add('documents.carPass.list.choose', (plate) => {
    for (let i = 0; i < carPassList.length; i++) {
        if (carPassList[i].plate == plate) {
            let target = mp.getCurrentInteractionEntity();
            if (target.type != 'player') return;
            mp.events.callRemote('documents.offer', "carPass", target.remoteId, JSON.stringify(carPassList[i]));
        }
    }
});

function dateFormatter(date) {
    if (!date) return '11/09/2001';
    date = date.split('-');
    let newDate = `${date[2]}/${date[1]}/${date[0]}`;

    return newDate;
}