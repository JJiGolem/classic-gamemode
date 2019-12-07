let isInChargeStationColshape = false;

mp.events.add('chargestations.shape.enter', (enter) => {
    isInChargeStationColshape = enter;
});

mp.keys.bind(0x45, true, () => { /// E
    if (mp.game.ui.isPauseMenuActive()) return;
    if (mp.busy.includes()) return;
    if (!isInChargeStationColshape) return;
    let player = mp.players.local;
    let vehicle = player.vehicle;
    if (vehicle && vehicle.getPedInSeat(-1) == player.handle) {
        mp.events.callRemote('chargestations.charge');
    } else {
        mp.prompt.show('Чтобы зарядить транспортное средство, вы должны находиться в нем');
    }
});