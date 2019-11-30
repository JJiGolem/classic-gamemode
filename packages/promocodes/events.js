let promocodes = call("promocodes");

// TODO: Временное решение
let tempWinters = [];

module.exports = {
    "init": async () => {
        tempWinters = await db.Models.TempWinter.findAll();
        await promocodes.init();
        inited(__dirname);
    },
    "characterInit.done": (player) => {
        promocodes.check(player);
    },
    "promocodes.activate": (player, code) => {
        // TODO: Временное решение
        if (code.toLowerCase() == 'winter') {
            var notifs = call("notifications");
            var utils = call("utils");
            var winter = call("winter");
            var header = `Промокод Winter`;
            if (tempWinters.find(x => x.characterId == player.character.id)) return notifs.error(player, `Награда уже получена`, header);

            var inventory = call('inventory');
            var params = {
                pockets: '[6,10,6,10]'
            };
            var cantAdd = inventory.cantAdd(player, 65, params);
            if (cantAdd) return notifs.error(player, cantAdd, header);

            var nextWeight = inventory.getCommonWeight(player) + inventory.getInventoryItem(6).weight + inventory.getInventoryItem(7).weight +
                inventory.getInventoryItem(8).weight + inventory.getInventoryItem(9).weight + inventory.getInventoryItem(65).weight;
            if (nextWeight > inventory.maxPlayerWeight) return notifs.error(player, `Превышение по весу (${nextWeight.toFixed(2)} из ${inventory.maxPlayerWeight} кг)`, header);

            inventory.addItem(player, 65, params, (e) => {
                if (e) return notifs.error(player, e, header);

                var hatList = winter.clothes[player.character.gender][0];
                var topList = winter.clothes[player.character.gender][1];
                var pantsList = winter.clothes[player.character.gender][2];
                var shoesList = winter.clothes[player.character.gender][3];

                var hat = hatList[utils.randomInteger(0, hatList.length - 1)];
                var top = topList[utils.randomInteger(0, topList.length - 1)];
                var pants = pantsList[utils.randomInteger(0, pantsList.length - 1)];
                var shoes = shoesList[utils.randomInteger(0, shoesList.length - 1)];


                call("money").addCash(player, 5000, (res) => {
                    if (!res) return notifs.error(player, `Ошибка начисления наличных`);;
                    inventory.addItem(player, hat.itemId, hat.params);
                    inventory.addItem(player, top.itemId, top.params);
                    inventory.addItem(player, pants.itemId, pants.params);
                    inventory.addItem(player, shoes.itemId, shoes.params);

                    notifs.success(player, `Получен зимний комплект и кейс!`, header);
                    var tempWinter = db.Models.TempWinter.build({
                        characterId: player.character.id
                    });
                    tempWinters.push(tempWinter);
                    tempWinter.save();
                }, `Использование промокода Winter`);
            });

            return;
        }
        promocodes.activate(player, code);
    },
};
