mp.events.add('playerEnterVehicle', (vehicle, seat) => { ///Убираем автозаведение автомобиля персонажем
        if (mp.players.local.getSeatIsTryingToEnter() !== -1 || vehicle.getIsEngineRunning()) {
            return;
        }
        vehicle.setEngineOn(false, true, true);
    });