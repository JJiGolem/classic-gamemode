"use strict";

module.exports = {

    convertCharactersToResultData(characters) {
        var result = [];
        for (var i = 0; i < characters.length; i++) {
            var character = characters[i];
            var number = (character.Phone) ? character.Phone.number : null;
            var housePos = null;
            if (character.House) {
                var h = character.House;
                housePos = new mp.Vector3(h.pickupX, h.pickupY, h.pickupZ);
            }
            result.push({
                id: character.id,
                name: character.name,
                phone: number,
                housePos: housePos
            });
        }
        return result;
    }
};
