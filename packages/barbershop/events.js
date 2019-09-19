let barbershop = require('./index.js');

module.exports = {
    "init": () => {
        barbershop.init();
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
        player.call('barbershop.enter', [shopData, gender, appearanceData]);
    },
    "barbershop.exit": (player) => {
        player.dimension = 0;
        //inventory.updateAllView(player);
    },
    "barbershop.hairstyle.buy": (player, hairstyleId) => {
        player.character.hair = hairstyleId;
        player.character.save();
        player.setClothes(2, hairstyleId, 0, 2);
        player.call('barbershop.hairstyle.buy.ans', [0]);
    },
    "barbershop.facialHair.buy": (player, index) => {
        player.setHeadOverlay(1, [index, 1.0, player.character.beardColor, 0]);
        player.character.Appearances[1].value = index;
        player.character.Appearances[1].save();
        player.call('barbershop.facialHair.buy.ans', [0]);
    },
    "barbershop.color.buy": (player, type, index) => {
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
        //player.setHeadOverlay(1, [index, 1.0, player.character.beardColor, 0]);
    }
}