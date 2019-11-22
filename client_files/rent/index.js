
mp.events.add({
    'rent.rentmenu.show': (data) => {
        if (!data) return;
        let vehicle = mp.players.local.vehicle;
        let maxSpeed = 0;
        mp.busy.add('rent.rentmenu', false);
        if (vehicle) {
            mp.players.local.vehicle.freezePosition(true);
            maxSpeed = (mp.game.vehicle.getVehicleModelMaxSpeed(vehicle.model) * 3.6 * 1.05).toFixed(0);
        }
        mp.callCEFV(`carSpecifications.body = {
            name: { header: 'Название', value: '${data.name}', unit: '' },
            maxSpeed: { header: 'Макс. скорость', value: \`${maxSpeed}\`, unit: 'км/ч' },
            mileage: { header: 'Пробег', value: '${data.mileage.toFixed()}', unit: 'км' },
        };
        carSpecifications.price = '${data.price.toFixed()}'
        `);
        mp.events.call('selectMenu.show', 'rentMenu');
        mp.callCEFV(`carSpecifications.show = true`);
    },
    'rent.rentmenu.close': () => {
        mp.busy.remove('rent.rentmenu');
        mp.callCEFV(`carSpecifications.show = false`);
        mp.events.call('selectMenu.hide');
    },
    'rent.vehicle.rent.ans': (ans, data) => {
        if (ans != 1) mp.events.call('rent.rentmenu.close');
        switch (ans) {
            case 0:
                mp.notify.error('Вы не в т/с аренды');
                return;
            case 1:
                if (mp.players.local.vehicle)
                    mp.players.local.vehicle.freezePosition(false);
                mp.events.call('rent.rentmenu.close');
                mp.notify.success('Транспорт успешно арендован');
                mp.notify.info('Вы можете пользоваться этим транспортом до выхода из игры');
                return;
            case 2:
                mp.notify.error(`Необходима лицензия на ${data}`);
                return;
            case 3:
                mp.notify.error('Недостаточно денег');
                return;
            case 4:
                mp.notify.error('Ошибка финансовой операции');
                return;
        }
    }
});