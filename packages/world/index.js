"use strict";

module.exports = {
    // Объекты мира ГТА
    objects: {},

    init() {
        this.loadWorldObjectsFromDB();
    },
    async loadWorldObjectsFromDB() {
        var objects = await db.Models.WorldObject.findAll();
        objects.forEach(obj => {
            if (!this.objects[obj.region]) this.objects[obj.region] = {};
            if (!this.objects[obj.region][obj.street]) this.objects[obj.region][obj.street] = {};
            if (!this.objects[obj.region][obj.street][obj.type]) this.objects[obj.region][obj.street][obj.type] = [];

            this.objects[obj.region][obj.street][obj.type].push(obj);
        });

        console.log(`[WORLD] Объекты мира загружены (${objects.length} шт.)`);
    },
}
