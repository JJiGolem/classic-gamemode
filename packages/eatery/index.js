let shops;
let bizes;

module.exports = {
    business: {
        type: 2,
        name: "Закусочная",
        productName: "Продукты питания",
    },
    rentPerDayMultiplier: 0.01,
    minPriceMultiplier: 1.0,
    maxPriceMultiplier: 2.0,
    productPrice: 5,
    productsConfig: {
        hamburger: 4,
        pizza: 3,
        hotdog: 3,
        chips: 2,
        cola: 2
    },
    itemIds: {
        hamburger: 126,
        pizza: 127,
        hotdog: 128,
        chips: 129,
        cola: 130
    },
    defaultProductsAmount: 1,
    async init() {
        bizes = call('bizes');
        await this.loadEateriesFromDB();
    },
    async loadEateriesFromDB() {
        shops = await db.Models.Eatery.findAll();
        for (var i = 0; i < shops.length; i++) {
            this.createEatery(shops[i]);
        }
        console.log(`[EATERY] Загружено закусочных: ${i}`);
    },
    createEatery(shop) {
        mp.blips.new(93, new mp.Vector3(shop.x, shop.y, shop.z),
            {
                name: 'Закусочная',
                color: 5,
                shortRange: true,
            });
        
        mp.markers.new(1, new mp.Vector3(shop.x, shop.y, shop.z), 0.8,
        {
            color: [255, 174, 0, 200],
            visible: true,
            dimension: 0
        });

        let shape = mp.colshapes.newSphere(shop.x, shop.y, shop.z, 1.8);
        shape.isEatery = true;
        shape.eateryId = shop.id;
    },
    getRawShopData(id) {
        let shop = shops.find(x => x.id == id);
        return {
            bType: shop.bType,
            priceMultiplier: shop.priceMultiplier
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
    getProductsConfig() {
        return this.productsConfig;
    },
    getPriceConfig() {
        let priceConfig = {}; 
        for (let key in this.productsConfig) {
            priceConfig[key] = this.productsConfig[key] * this.productPrice;
        }
        return priceConfig;
    },
    addShopToList(shop) {
        shops.push(shop);
    }
}