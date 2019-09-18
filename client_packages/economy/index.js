"use strict";

mp.events.add("economy.show", (data) => {
    if (mp.busy.includes()) return;
    if (!mp.busy.add('economy')) return;
    let items = "";
    JSON.parse(data).forEach(element => {
        items += `{
            dataType: "${element.type}",
            text: "${element.name}",
            values: ["${element.value}"],
            i: 0,
            type: "editable" // возможность редактирования значения пункта меню
        },`
    });
    mp.callCEFV(`selectMenu.menu = {
        name: "economy",
        header: "Экономические показатели",
        items: [${items}
        {
            text: "Сохранить"
        },
        {
            text: "Отмена"
        }],
        i: 0,
        j: 0,
        handler(eventName) {
            var item = this.items[this.i];
            var e = {
                menuName: this.name,
                itemName: item.text,
                itemIndex: this.i,
                itemValue: (item.i != null && item.values) ? item.values[item.i] : null,
                valueIndex: item.i,
            };
            if (eventName == 'onItemSelected') {
                if (e.itemName == 'Сохранить') {
                    let data = [];
                    for(let i = 0; i < selectMenu.menu.items.length - 2; i++) {
                        data.push({type: selectMenu.menu.items[i].dataType, value: selectMenu.menu.items[i].values[0]});
                    }

                    selectMenu.show = false;
                    mp.trigger("economy.change", JSON.stringify(data));
                }
                if (e.itemName == 'Отмена') {
                    selectMenu.show = false;
                    busy.remove("economy", true);
                }
            }
        }
    }`);
    mp.callCEFV(`selectMenu.show = true;`);
});

mp.events.add("economy.change", (data) => {
    mp.busy.remove('economy');
    mp.events.callRemote("economy.change", data);
});