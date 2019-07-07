mp.events.add('playerEnterVehicle', (vehicle, seat) => { ///Убираем автозаведение автомобиля персонажем
    if (mp.players.local.getSeatIsTryingToEnter() !== -1 || vehicle.getIsEngineRunning()) {
        return;
    }
    vehicle.setEngineOn(false, true, true);
});

mp.keys.bind(0x32, true, function () {
    mp.events.callRemote('vehicle.engine.toggle'); // TODO: проверки
});
// TEMP
var indicators = {
    show: true,
    fuel: 0
}
mp.events.add('vehicles.indicators.show', (state) => {
    indicators.show = state;
});

mp.events.add('vehicles.indicators.update', (litres) => {
    indicators.fuel = litres;
});

mp.events.add('render', () => {
    if (indicators.show && mp.players.local.vehicle) {

        mp.game.graphics.drawText(`SPEED: ${Math.floor(mp.players.local.vehicle.getSpeed() * 2.236936)}km/h FUEL: ${indicators.fuel}`, [0.85, 0.9],
            {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [0.5, 0.5],
                outline: true
            });
    }
});