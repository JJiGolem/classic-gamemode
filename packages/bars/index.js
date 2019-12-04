"use strict";

let money;
let notifs;
let inventory;


let bars = [];
module.exports = {
    alcohol: [{
            price: 390,
            params: {
                name: "Мохито",
                alcohol: 30
            },
        },
        {
            price: 400,
            params: {
                name: "Апероль Шпритц",
                alcohol: 35
            },
        },
        {
            price: 395,
            params: {
                name: "Негрони",
                alcohol: 40
            },
        },
        {
            price: 410,
            params: {
                name: "Мартини & Тоник",
                alcohol: 25
            },
        },
        {
            price: 415,
            params: {
                name: "Бьянко Санрайз",
                alcohol: 45
            },
        },
        {
            price: 385,
            params: {
                name: "Валентино",
                alcohol: 30
            },
        },
        {
            price: 390,
            params: {
                name: "Амиго",
                alcohol: 40
            },
        },
        {
            price: 415,
            params: {
                name: "Эль-бандито",
                alcohol: 45
            },
        },
        {
            price: 395,
            params: {
                name: "Маргарита",
                alcohol: 30
            },
        },
        {
            price: 410,
            params: {
                name: "Пина-колада",
                alcohol: 25
            },
        },
        {
            price: 385,
            params: {
                name: "Сангрита",
                alcohol: 30
            },
        },
        {
            price: 400,
            params: {
                name: "Палома",
                alcohol: 35
            },
        },
        {
            price: 395,
            params: {
                name: "Отвёртка",
                alcohol: 40
            },
        },
        {
            price: 385,
            params: {
                name: "Холодное лето 1986 года",
                alcohol: 30
            },
        },
        {
            price: 400,
            params: {
                name: "Российский флаг",
                alcohol: 45
            },
        },
        {
            price: 390,
            params: {
                name: "Балалайка",
                alcohol: 25
            },
        },
        {
            price: 415,
            params: {
                name: "Кровавая мэри",
                alcohol: 35
            },
        },
        {
            price: 410,
            params: {
                name: "Белый туман",
                alcohol: 30
            },
        }
    ],
    alcoholItemId: 133,
    async init() {
        money = call('money');
        notifs = call('notifications');
        inventory = call('inventory');

        let infoBars = await db.Models.Bar.findAll();
        for (let i = 0; i < infoBars.length; i++) {
            this.addBar(infoBars[i]);
        }
    },
    getInfo() {
        return this.alcohol;
    },
    addBar(barInfo) {
        let colshape = mp.colshapes.newSphere(barInfo.x, barInfo.y, barInfo.z, 2.0);
        colshape.isBar = true;
        let marker = mp.markers.new(1, new mp.Vector3(barInfo.x, barInfo.y, barInfo.z), 0.5, {
            rotation: new mp.Vector3(0, 0, 0),
            dimension: 0,
            color: [246, 68, 164, 128],
        });
        let blip = mp.blips.new(93, new mp.Vector3(barInfo.x, barInfo.y, barInfo.z), {
            name: "Банк",
            shortRange: true,
            dimension: 0,
            color: 48
        });
        bars.push({
            marker: marker,
            blip: blip,
            colshape: colshape,
            info: barInfo
        });
    },
    buyDrink(player, index) {
        index = Math.clamp(index, 0, this.alcohol.length - 1);
        let item = this.alcohol[index];
        if (player.character.cash < item.price) return notifs.error(player, `Необходимо $${item.price}`, "Недостаточно средств");

        let cantAdd = inventory.cantAdd(player, this.alcoholItemId, item.params);
        if (cantAdd) return notifs.error(player, cantAdd, "Ошибка");

        money.removeCash(player, item.price, (res) => {
            if (!res) out(`Ошибка списания наличных`);

        }, `Покупка напитка в баре`);

        inventory.addItem(player, this.alcoholItemId, item.params, (e) => {
            if (e) notifs.error(player, e);
        });

        notifs.success(player, `Вы приобрели ${item.params.name}`, "Бар");
    }
}