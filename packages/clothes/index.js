"use strict";

module.exports = {
    // Список одежды
    list: {
        // жен.
        "0": {
            "bracelets": [],
            "ears": [],
            "glasses": [],
            "hats": [],
            "masks": [],
            "pants": [],
            "shoes": [],
            "ties": [],
            "tops": [],
            "watches": [],
        },
        // муж.
        "1": {
            "bracelets": [],
            "ears": [],
            "glasses": [],
            "hats": [],
            "masks": [],
            "pants": [],
            "shoes": [],
            "ties": [],
            "tops": [],
            "watches": [],
        }
    },

    async init() {
        var pants = await db.Models.ClothesPants.findAll();
        pants.forEach(el => {
            this.list[el.sex]["pants"].push(el);
        });
        var shoes = await db.Models.ClothesShoe.findAll();
        shoes.forEach(el => {
            this.list[el.sex]["shoes"].push(el);
        });
        var tops = await db.Models.ClothesTop.findAll();
        tops.forEach(el => {
            this.list[el.sex]["tops"].push(el);
        });
    },
    getTypes() {
        return Object.keys(this.list[0]);
    },
    getClothes(type, id) {
        var el = this.list[1][type].find(x => x.id == id);
        if (!el) el = this.list[0][type].find(x => x.id == id);
        return el;
    },
};
