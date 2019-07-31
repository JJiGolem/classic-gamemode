let controlsDisabled = false;
let isOpen = false;
let currentType;

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
        mp.callCEFV('carPass.show = true');
        for (var key in data) {
            if (typeof data[key] == 'string') data[key] = `'${data[key]}'`;
            mp.callCEFV(`carPass.${key} = ${data[key]}`);
        }
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