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
        player.setClothes(2, hairstyleId, 0, 2);
        player.call('barbershop.hairstyle.buy.ans', [0]);
    },
    "barbershop.facialHair.buy": (player, index) => {
        //player.setClothes(2, hairstyleId, 0, 2);
        player.setHeadOverlay(1, [index, 1.0, player.character.beardColor, 0]);
        player.call('barbershop.facialHair.buy.ans', [0]);
    }
}