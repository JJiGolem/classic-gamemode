let isInFuelStationColshape = false;

let menuIsOpen = false;

mp.events.add('fuelstations.shape.enter', () => {
    isInFuelStationColshape = true;
});

mp.events.add('fuelstations.shape.leave', () => {
    isInFuelStationColshape = false;
    mp.events.call('fuelstations.menu.close');
});

mp.keys.bind(0x45, true, () => { /// E
    if (mp.game.ui.isPauseMenuActive()) return;
    if (mp.busy.includes()) return;
    if (isInFuelStationColshape) {
        let player = mp.players.local;
        let vehicle = player.vehicle;
        if (vehicle && vehicle.getPedInSeat(-1) == player.handle) {
            mp.events.call('fuelstations.menu.show');
        } else {
            mp.prompt.showByName('fuelstation_control');
        }
    }
});

mp.events.add('fuelstations.menu.show', () => {
    if (mp.busy.includes()) return;
    mp.callCEFV(`selectMenu.menu = cloneObj(selectMenu.menus["fuelStationMenu"])`);
    mp.callCEFV(`selectMenu.show = true`);
    menuIsOpen = true;
});

mp.events.add('fuelstations.menu.close', () => {
    if (menuIsOpen) {
        mp.callCEFV(`selectMenu.show = false`);
        menuIsOpen = false;
    }
});

mp.events.add('fuelstations.fill.litres.show', () => {
    mp.events.call('fuelstations.menu.close');
    //if (mp.busy.includes()) return;
    mp.busy.add('fuelstations.litres', true);
    mp.callCEFV(`inputWindow.name = 'fuelstations_litres';
inputWindow.header = "Заправка";
inputWindow.hint = "Введите количество литров";
inputWindow.inputHint = "Количество...";
inputWindow.value = "";
inputWindow.show = true;
`);
});

mp.events.add('fuelstations.fill.litres.close', () => {
    mp.callCEFV(`inputWindow.show = false;`);
    mp.busy.remove('fuelstations.litres');
});

mp.events.add('fuelstations.fill.litres.send', (value) => {
    let litres = parseInt(value);
    if (isNaN(litres) || litres < 1) return mp.notify.error('Некорректное значение', 'Ошибка');

    mp.events.call('fuelstations.fill.litres.close');
    mp.callCEFV('loader.show = true');
    mp.events.callRemote('fuelstations.fill.litres', litres);
});

mp.events.add('fuelstations.fill.litres.ans', (ans, data) => {

    mp.callCEFV('loader.show = false');
    switch (ans) {
        case 0:
            mp.notify.error('Вы не на АЗС', 'Ошибка');
            break;
        case 1:
            mp.notify.error('Вы не в транспорте', 'Ошибка');
            break;
        case 2:
            mp.notify.warning('Заправка не требуется', 'Бак полон');
            break;
        case 3:
            mp.notify.success(`Заправлено ${data.litres} л за $${data.total}`, 'АЗС');
            break;
        case 4:
            mp.notify.error(`Недостаточно денег`, 'Ошибка');
            break;
        case 5:
            mp.notify.error(`Не удалось заправиться`, 'Ошибка');
            break;
        case 6:
            mp.notify.error(`Некорректное значение`, 'Ошибка');
            break;
        case 7:
            mp.notify.error(`Бак не вмещает столько бензина`, 'Ошибка');
            break;
        case 8:
            mp.notify.error(`На заправке кончилось топливо`, 'АЗС');
            break;
        case 9:
            mp.notify.error(`Нельзя заправить электромобиль`, 'АЗС');
            break;
    }
});


mp.events.add('fuelstations.fill.fulltank', () => {
    mp.events.call('fuelstations.menu.close');
    mp.callCEFV('loader.show = true');
    mp.events.callRemote('fuelstations.fill.fulltank');
});

mp.events.add('fuelstations.fill.fulltank.ans', (ans, data) => {

    mp.callCEFV('loader.show = false');
    switch (ans) {
        case 0:
            mp.notify.error('Вы не на АЗС', 'Ошибка');
            break;
        case 1:
            mp.notify.error('Вы не в транспорте', 'Ошибка');
            break;
        case 2:
            mp.notify.warning('Заправка не требуется', 'Бак полон');
            break;
        case 3:
            mp.notify.success(`Заправлено ${data.litres} л за $${data.total}`, 'АЗС');
            break;
        case 4:
            mp.notify.error(`Недостаточно денег`, 'Ошибка');
            break;
        case 5:
            mp.notify.error(`Не удалось заправиться`, 'Ошибка');
            break;
        case 6:
            mp.notify.error(`На заправке кончилось топливо`, 'АЗС');
            break;
        case 7:
            mp.notify.error(`Нельзя заправить электромобиль`, 'АЗС');
            break;
    }
});