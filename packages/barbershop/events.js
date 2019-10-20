let barbershop = require('./index.js');
let money = call('money');
let inventory = call('inventory');

module.exports = {
    "init": () => {
        barbershop.init();
        inited(__dirname);
    },
    "playerEnterColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isBarbershop) {
                player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} зашел в колшейп BS ${shape.barbershopId}`]);
                player.call('prompt.show', ['Нажмите <span>E</span> для того, чтобы сменить прическу']);
                player.call('barbershop.shape', [true]);
                player.currentBarbershopId = shape.barbershopId;
        }
    },
    "playerExitColshape": (player, shape) => {
        if (!player.character) return;

        if (shape.isBarbershop) {
                player.call('chat.message.push', [`!{#ffffff}[debug]${player.name} вышел с колшейпа BS ${shape.barbershopId}`]);
                player.call('barbershop.shape', [false]);
                player.call('prompt.hide');
        }
    },
    "barbershop.enter": (player) => {
        let id = player.currentBarbershopId;
        if (!id) return;
        let shopData = barbershop.getRawBarbershopData(id);
        player.dimension = player.id + 1;
        let gender = player.character.gender;
        console.log(gender);
        let appearanceData = {
            hairColor: player.character.hairColor,
            hairHighlightColor: player.character.hairHighlightColor,
            facialHairColor: player.character.beardColor
        }
        let productPrice = barbershop.productPrice;
        let multiplier = barbershop.getPriceMultiplier(id);
        let priceData = {
            hairstylePrice: barbershop.hairstyleProducts * productPrice * multiplier,
            facialHairPrice: barbershop.facialHairProducts * productPrice * multiplier,
            colorChangePrice: barbershop.colorChangeProducts * productPrice * multiplier
        }
        player.call('barbershop.enter', [shopData, gender, appearanceData, priceData]);
    },
    "barbershop.exit": (player) => {
        player.dimension = 0;
        inventory.updateAllView(player);
    },
    "barbershop.hairstyle.buy": (player, hairstyleId) => {
        let barbershopId = player.currentBarbershopId;
        if (barbershopId == null) return;

        let price = barbershop.hairstyleProducts * barbershop.productPrice * barbershop.getPriceMultiplier(barbershopId);
        if (player.character.cash < price) return player.call('barbershop.hairstyle.buy.ans', [1]);
        let productsAvailable = barbershop.getProductsAmount(barbershopId);
        if (barbershop.hairstyleProducts > productsAvailable) return player.call('barbershop.hairstyle.buy.ans', [3]);
        money.removeCash(player, price, function(result) {
            if (result) {
                barbershop.removeProducts(barbershopId, barbershop.hairstyleProducts);
                barbershop.updateCashbox(barbershopId, price);
                player.character.hair = hairstyleId;
                player.character.save();
                player.setClothes(2, hairstyleId, 0, 2);
                player.call('barbershop.hairstyle.buy.ans', [0]);
            } else {
                player.call('barbershop.hairstyle.buy.ans', [2]);
            }
        }, `Смена прически на #${hairstyleId}`);
    },
    "barbershop.facialHair.buy": (player, index) => {
        let barbershopId = player.currentBarbershopId;
        if (barbershopId == null) return;
        
        let price = barbershop.facialHairProducts * barbershop.productPrice * barbershop.getPriceMultiplier(barbershopId);
        if (player.character.cash < price) return player.call('barbershop.facialHair.buy.ans', [1]);
        let productsAvailable = barbershop.getProductsAmount(barbershopId);
        if (barbershop.facialHairProducts > productsAvailable) return player.call('barbershop.facialHair.buy.ans', [3]);
        money.removeCash(player, price, function (result) {
            if (result) {
                barbershop.removeProducts(barbershopId, barbershop.facialHairProducts);
                barbershop.updateCashbox(barbershopId, price);
                player.setHeadOverlay(1, [index, 1.0, player.character.beardColor, 0]);
                player.character.Appearances[1].value = index;
                player.character.Appearances[1].save();
                player.call('barbershop.facialHair.buy.ans', [0]);
            } else {
                player.call('barbershop.facialHair.buy.ans', [2]);
            }
        }, `Смена бороды на #${index}`);

    },
    "barbershop.color.buy": (player, type, index) => {
        let barbershopId = player.currentBarbershopId;
        if (barbershopId == null) return;

        let price = barbershop.colorChangeProducts * barbershop.productPrice * barbershop.getPriceMultiplier(barbershopId);
        if (player.character.cash < price) return player.call('barbershop.color.buy.ans', [3]);
        let productsAvailable = barbershop.getProductsAmount(barbershopId);
        if (barbershop.colorChangeProducts > productsAvailable) return player.call('barbershop.color.buy.ans', [5]);
        money.removeCash(player, price, function (result) {
            if (result) {
                barbershop.removeProducts(barbershopId, barbershop.colorChangeProducts);
                barbershop.updateCashbox(barbershopId, price);
                switch (type) {
                    case 0:
                        player.setHairColor(index, player.character.hairHighlightColor);
                        player.character.hairColor = index;
                        player.character.save();
                        player.call('barbershop.color.buy.ans', [0]);
                        break;
                    case 1:
                        player.setHairColor(player.character.hairColor, index);
                        player.character.hairHighlightColor = index;
                        player.character.save();
                        player.call('barbershop.color.buy.ans', [1]);
                        break;
                    case 2:
                        player.call('barbershop.color.buy.ans', [2]);
                        player.setHeadOverlay(1, [player.character.Appearances[1].value, 1.0, index, 0]);
                        player.character.beardColor = index;
                        player.character.save();
                        break;
                }
            } else {
                player.call('barbershop.color.buy.ans', [4]);
            }
        }, `Смена цвета растительности типа #${type} на #${index}`);
    }
}