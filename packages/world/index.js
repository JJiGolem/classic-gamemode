"use strict";

module.exports = {
    // Объекты мира ГТА
    objects: {},
    // Колшейпы объектов (objId: colshape)
    colshapes: {},

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
            this.createObjColshape(obj);
        });

        console.log(`[WORLD] Объекты мира загружены (${objects.length} шт.)`);
    },
    async addObject(data) {
        var obj = await db.Models.WorldObject.create({
            region: data.region,
            street: data.street,
            type: data.type,
            name: data.name,
            pos: JSON.stringify(data.pos),
            radius: data.radius,
            hash: parseInt(data.hash) || null,
        });

        if (!this.objects[obj.region]) this.objects[obj.region] = {};
        if (!this.objects[obj.region][obj.street]) this.objects[obj.region][obj.street] = {};
        if (!this.objects[obj.region][obj.street][obj.type]) this.objects[obj.region][obj.street][obj.type] = [];

        this.objects[obj.region][obj.street][obj.type].push(obj);
        this.createObjColshape(obj);
    },
    deleteObject(id) {
        if (!this.colshapes[id]) return;

        var colshape = this.colshapes[id];
        var obj = colshape.db;
        var list = this.objects[obj.region][obj.street][obj.type];

        var i = list.indexOf(obj);
        if (i != -1) list.splice(i, 1);
        colshape.destroy();
        obj.destroy();
        delete this.colshapes[id];
    },
    createObjColshape(obj) {
        var pos = obj.pos;

        var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
        colshape.onEnter = (player) => {
            if (player.vehicle) return;

            debug(`enter obj`)
        };
        colshape.onExit = (player) => {
            debug(`exit obj`)
        };
        colshape.db = obj;

        this.colshapes[obj.id] = colshape;
    },
    setObjectPos(data) {
        if (!this.colshapes[data.id]) return;

        var colshape = this.colshapes[data.id];
        var obj = colshape.db;
        var list = this.objects[obj.region][obj.street][obj.type];

        var i = list.indexOf(obj);
        if (i != -1) list.splice(i, 1);
        colshape.destroy();
        delete this.colshapes[obj.id];

        obj.region = data.region;
        obj.street = data.street;
        obj.pos = data.pos;
        obj.radius = data.radius;
        obj.save();

        if (!this.objects[obj.region]) this.objects[obj.region] = {};
        if (!this.objects[obj.region][obj.street]) this.objects[obj.region][obj.street] = {};
        if (!this.objects[obj.region][obj.street][obj.type]) this.objects[obj.region][obj.street][obj.type] = [];

        this.objects[obj.region][obj.street][obj.type].push(obj);
        this.createObjColshape(obj);
    },
}
