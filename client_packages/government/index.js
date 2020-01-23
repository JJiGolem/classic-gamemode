"use strict";


/*
    Модуль правительства (организации).

    created 05.10.19 by Carter Slade
*/

mp.government = {

    showServiceSelectMenu(data) {
        var items = [];
        data.fines.forEach(fine => {
            items.push({
                text: `Штраф #${fine.id}`
            });
        });
        items.push({
            text: "Вернуться"
        });
        mp.callCEFV(`selectMenu.setItems('governmentServiceFines', ${JSON.stringify(items)})`);
        mp.callCEFV(`selectMenu.setProp('governmentServiceFines', 'fines', ${JSON.stringify(data.fines)})`);

        var items = [];
        data.vehicles.forEach(veh => {
            items.push({
                text: veh.name,
                values: [veh.plate]
            });
        });
        items.push({
            text: "Вернуться"
        });
        mp.callCEFV(`selectMenu.setItems('governmentServiceVehKeys', ${JSON.stringify(items)})`);

        mp.callCEFV(`selectMenu.showByName('governmentService')`);
    },
};

mp.events.add({
    "government.service.showMenu": (data) => {
        mp.government.showServiceSelectMenu(data);
    },
});
