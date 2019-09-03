// let vehicles = call('vehicles');
// let money = call('money');

let customs;

module.exports = {
    async init() {
        await this.loadCustomsFromDB();
    },
    async loadCustomsFromDB() {
        customs = await db.Models.LosSantosCustoms.findAll();
        for (var i = 0; i < customs.length; i++) {
            this.createLSC(customs[i]);
        }
        console.log(`[TUNING] Загружено LSC: ${i}`);
    },
    createLSC(LSC) {
        mp.blips.new(72, new mp.Vector3(LSC.x, LSC.y, LSC.z),
            {
                name: 'Los Santos Customs',
                color: 0,
                shortRange: true,
            });
        let shape = mp.colshapes.newSphere(LSC.x, LSC.y, LSC.z, 4);

        shape.isCustoms = true;
        shape.customsId = LSC.id;
    },
    getCustomsDataById(id) {
        return customs.find(x => x.id == id);
    }
}