let shops;
let bizes;

module.exports = {
    business: {
        type: 5,
        name: "Магазин оружия",
        productName: "Боеприпасы",
    },
    rentPerDayMultiplier: 0.01,
    minPriceMultiplier: 1.0,
    maxPriceMultiplier: 2.0,
    productPrice: 10,
    ammoProducts: 1,
    weaponsConfig: {
        1: {
            name: 'Combat Pistol',
            itemId: 20,
            gameId: 'weapon_combatpistol',
            products: 10
        },
        2: {
            name: 'SMG',
            itemId: 48,
            gameId: 'weapon_smg',
            products: 10
        },
        3: {
            name: 'Pump Shotgun',
            itemId: 21,
            gameId: 'weapon_pumpshotgun',
            products: 10
        },
        4: {
            name: 'Carbine Rifle',
            itemId: 22,
            gameId: 'weapon_carbinerifle',
            products: 10
        },
    },
    async init() {
        bizes = call('bizes');
        await this.loadAmmunationsFromDB();
    },
    async loadAmmunationsFromDB() {
        shops = await db.Models.Ammunation.findAll();
        for (var i = 0; i < shops.length; i++) {
            this.createAmmunation(shops[i]);
        }
        console.log(`[AMMUNATION] Загружено магазинов оружия: ${i}`);
    },
    createAmmunation(shop) {
        mp.blips.new(110, new mp.Vector3(shop.x, shop.y, shop.z),
            {
                name: 'Магазин оружия',
                color: 0,
                shortRange: true,
            });
        
        mp.markers.new(1, new mp.Vector3(shop.x, shop.y, shop.z), 0.8,
        {
            color: [232, 46, 46, 128],
            visible: true,
            dimension: 0
        });

        let shape = mp.colshapes.newSphere(shop.x, shop.y, shop.z, 1.8);
        shape.isAmmunation = true;
        shape.ammunationId = shop.id;
    },
    getRawShopData(id) {
        let shop = shops.find(x => x.id == id);
        return {
            priceMultiplier: shop.priceMultiplier,
            productPrice: this.productPrice
        }
    },
    getBizParamsById(id) {
        let shop = shops.find(x => x.bizId == id);
        if (!shop) return;
        let params = [
            {
                key: 'priceMultiplier',
                name: 'Наценка на товары',
                max: this.maxPriceMultiplier,
                min: this.minPriceMultiplier,
                current: shop.priceMultiplier
            }
        ]
        return params;
    },
    setBizParam(id, key, value) {
        let shop = shops.find(x => x.bizId == id);
        if (!shop) return;
        shop[key] = value;
        shop.save();
    },
    getProductsAmount(id) {
        let shop = shops.find(x => x.id == id);
        let bizId = shop.bizId;
        let products = bizes.getProductsAmount(bizId);
        return products;
    },
    removeProducts(id, products) {
        let shop = shops.find(x => x.id == id);
        let bizId = shop.bizId;
        bizes.removeProducts(bizId, products);
    },
    getPriceMultiplier(id) {
        let shop = shops.find(x => x.id == id);
        return shop.priceMultiplier;
    },
    updateCashbox(id, money) {
        let shop = shops.find(x => x.id == id);
        let bizId = shop.bizId;
        bizes.bizUpdateCashBox(bizId, money);
    },
    getWeaponsConfig() {
        return this.weaponsConfig;
    }
}