const clothesShopInfo = require("./info");

function startDressing(player, interiorId) {
	const dressingPlace = clothesShopInfo.dressingPlaces[interiorId];

	if (!dressingPlace) {
		player.utils.error("Неправильный интерьер магазина");
		console.log(`Clothes_Shop: Invalid place ${dressingPlace}`);
		return false;
	}

	player.inDressingRoom = true;
	player.dimension = player.id + 1;
	player.call("clothes_shop::dressing_start", [ dressingPlace.position, dressingPlace.heading ]);

	return true;
};

mp.events.add("clothes_shop::stopDressing", (player) => {
	player.inDressingRoom = undefined;
	player.dimension = 0;
	player.body.loadItems(); 
	player.call("clothes_shop::stopDressing");
});

module.exports = {
	startDressing
};
