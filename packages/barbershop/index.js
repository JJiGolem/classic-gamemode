// let vehicles = call('vehicles');
// let money = call('money');

let shops;

module.exports = {
    async init() {
        await this.loadBarbershopsFromDB();
    },
    async loadBarbershopsFromDB() {
        shops = await db.Models.Barbershop.findAll();
        for (var i = 0; i < shops.length; i++) {
            this.createBarbershop(shops[i]);
        }
        console.log(`[BARBERSHOP] Загружено парикмахерских: ${i}`);
    },
    createBarbershop(shop) {
        mp.blips.new(71, new mp.Vector3(shop.x, shop.y, shop.z),
            {
                name: 'Парикмахерская',
                color: 0,
                shortRange: true,
            });
        let shape = mp.colshapes.newSphere(shop.x, shop.y, shop.z, 4);

        shape.isBarbershop = true;
        shape.barbershopId = shop.id;
    },
    getRawBarbershopData(shopId) {
        let shop = shops.find(x => x.id == shopId);

        let data = {
            pos: {
                x: shop.placeX,
                y: shop.placeY,
                z: shop.placeZ,
                h: shop.placeH
            },
            camera: {
                x: shop.cameraX,
                y: shop.cameraY,
                z: shop.cameraZ
            }
        }
        return data;
    },
    getBarbershopData(shopId) {
        return shops.find(x => x.id == shopId);
    }
}