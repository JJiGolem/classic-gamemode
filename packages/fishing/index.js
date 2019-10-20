// Модуль рыбалки

"use strict"

// "amb@world_human_stand_fishing@base base" - стоит
// "amb@world_human_stand_fishing@idle_a idle_a" - медленно крутит
// "amb@world_human_stand_fishing@idle_a idle_b" - медленно крутит и иногда тянет
// "amb@world_human_stand_fishing@idle_a idle_c" - быстро крутит и тянет (вытягивает рыбу)

let money = call('money');
let notifs = call('notifications');
let inventory = call('inventory');

const ROD_ID = 5;

module.exports = {
    async init() {
        this.initFishersFromDB();
        this.initFishesFromDB();
    },

    rodPrice: 100,

    fishes: [],

    colshapes: [],

    getRodId() {
        return ROD_ID;
    },

    async initFishesFromDB() {
        this.fishes = await db.Models.Fish.findAll();
    },

    async initFishersFromDB() {
        let fishers = await db.Models.Fisher.findAll({ raw: true });

        fishers.forEach(fisher => {
            let colshape = this.createFisherColshape(fisher);
            this.colshapes.push(colshape);
            this.createMarker(fisher);
            this.createBlip(fisher);
        });

        console.log(fishers);

        mp.players.forEach(player => {
            player.call('fishing.fishers.init', [fishers]);
        })
    },

    createFisherColshape(fisher) {
        let pos = new mp.Vector3(fisher.x, fisher.y, fisher.z);
        let colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 2);
        
        colshape.isFisher = true;

        return colshape;
    },

    createMarker(fisher) {
        let heading = fisher.heading + 90;

        let markerX = fisher.x + 0.8*Math.cos(heading * Math.PI / 180.0);
        let markerY = fisher.y + 0.8*Math.sin(heading * Math.PI / 180.0);

        mp.markers.new(1, new mp.Vector3(markerX, markerY, fisher.z - 1.2), 0.4,
            {
                direction: new mp.Vector3(markerX, markerY, fisher.z),
                rotation: 0,
                color: [255, 255, 125, 200],
                visible: true,
                dimension: 0
            });
    },

    createBlip(blip) {
        mp.blips.new(68, new mp.Vector3(blip.x, blip.y, blip.z),
        {
            name: 'Рыбалка',
            shortRange: true,
            color: 26
        });
    },

    async buyRod(player) {
        money.removeCash(player, this.rodPrice,  (result) => { 
            if (result) {
                inventory.addItem(player, ROD_ID, { health: 100 }, (e) => {
                    if (!e) {
                        player.call('fishing.rod.buy.ans', [1]);
                        notifs.success(player, "Удочка добавлена в инвентарь", "Покупка");
                    } else {
                        notifs.error(player, e, "Ошибка");
                        player.call('fishing.rod.buy.ans', [0]);
                    }
                });
            } else {
                player.call('fishing.rod.buy.ans', [0]);
                notifs.error(player, "Недостаточно денег", "Ошибка");
            }
        }, `Buy fishing rod by player with id ${player.id}`);
    },

    async sellFish(player) {
        let fishes = inventory.getArrayByItemId(player, 15);
        let sum = 0;

        if (fishes && fishes.length > 0) {
            fishes.forEach(fish => {
                let fishName = inventory.getParam(fish, 'name').value;
                let fishWeight = inventory.getParam(fish, 'weight').value;
                let fishPrice = this.fishes.find(fish => fish.name == fishName).price;
                sum += fishPrice * fishWeight;
            });

            sum = parseInt(sum);

            money.addCash(player, sum, async function(result) {
                if (result) {
                    fishes.forEach(fish => inventory.deleteItem(player, fish.id));
                    player.call('fishing.fish.sell.ans', [1]);
                    return notifs.success(player, `Вы продали рыбы на ${sum}$`, 'Продажа')
                } else {
                    player.call('fishing.fish.sell.ans', [0]);
                    return notifs.error(player, 'Ошибка', 'Продажа');
                }
            }, `Sell fish by player with id ${player.id}`)
        } else {
            player.call('fishing.fish.sell.ans', [0]);
            return notifs.error(player, 'У вас нет рыбы', 'Ошибка');
        }
    }
}