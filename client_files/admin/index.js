mp.adminLevel = 0;

mp.events.add({
    'admin.set': (level) => {
        mp.adminLevel = level;
    },
    'slap': () => {
        var veh = mp.players.local.vehicle;
        (veh) ? veh.setVelocity(0, 0, 10) : mp.players.local.setVelocity(0, 0, 10);
    },
    'entityStreamIn': (entity) => {
        if (entity.type != 'player') return;
        if (entity == mp.players.local) return;
        let isVanished = entity.getVariable('isVanished') || false;
        entity.setAlpha(isVanished ? 0 : 255);
    },
    'render': () => {
        let isVanished = mp.players.local.getVariable('isVanished') || false;
        if (!isVanished) return;
        mp.game.graphics.drawText("INVISIBILITY ON", [0.93, 0.12], {
            font: 0,
            color: [252, 223, 3, 200],
            scale: [0.37, 0.37],
            outline: true
        });
    },
    'admin.stats.show': (data) => {
        data = JSON.parse(data);
        mp.callCEFV(`modal.modals["admin_stats"].header = '${data.name}'`);
        let content = '';
        let stats = {
            'Основное': {
                'Пол': `${data.gender ? 'женский' : 'мужской'}`,
                'Наличные': `$${data.cash}`,
                'Банк. счет': `$${data.bank}`,
                'Отыграно минут': `${data.minutes}`,
                'Номер телефона': `${data.phone ? data.phone : 'нет'}`,
                'Сытость': `${data.satiety}`,
                'Жажда': `${data.thirst}`,
                'Законопослушность': `${data.law}`,
                'Преступлений': `${data.crimes}`,
                'Розыск': `${data.wanted}`,
                'Причина розыска': `${data.wantedCause ? data.wantedCause : 'нет'}`,
            },
            'Лицензии': {
                'Легковые т/с': `${data.carLicense ? 'есть' : 'нет'}`,
                'Пассажирские т/с': `${data.passengerLicense ? 'есть' : 'нет'}`,
                'Мотоциклы': `${data.bikeLicense ? 'есть' : 'нет'}`,
                'Грузовые т/с': `${data.truckLicense ? 'есть' : 'нет'}`,
                'Воздушные т/с': `${data.airLicense ? 'есть' : 'нет'}`,
                'Водные т/с': `${data.boatLicense ? 'есть' : 'нет'}`,
                'Оружие': `${data.gunLicenseDate ? `до ${data.gunLicenseDate}` : 'нет'}`,
            },
            'Наказания': {
                'Количество варнов': `${data.warnNumber}`,
                'Дата окончания варна': `${data.warnDate ? data.warnDate : 'нет'}`,
                'Время ареста': `${data.arrestTime}`,
                'Тип ареста': `${data.arrestType}`,
            },
        }

        for (let category in stats) {
            content += `<h3>${category}</h3>`;
            let section = stats[category];
            for (let key in section) {
                content += `${key}: <b>${section[key]}</b><br>`;
            }
        }

        mp.callCEFV(`modal.modals["admin_stats"].content = \`${content}\``);
        mp.callCEFV('modal.showByName("admin_stats")')
    }
});

mp.events.addDataHandler('isVanished', (entity) => {
    let isVanished = entity.getVariable('isVanished');
    if (entity != mp.players.local) entity.setAlpha(isVanished ? 0 : 255);
});
