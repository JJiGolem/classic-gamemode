let vehicles = call('vehicles');
let bizes = call('bizes');
let jobs = call('jobs');

let dbCarServices;

module.exports = {
    /// Объект который показывает, что данный модуль отвечает за конкретный бизнес
    business: {
        type: 3,
        name: "СТО",
        productName: "Запчасти",
    },

    rentPerDayMultiplier: 0.01,
    productPrice: 10,
    maxPriceMultiplier: 2.0,
    minPriceMultiplier: 1.0,
    maxSalaryMultiplier: 0.3,
    minSalaryMultiplier: 0.1,
    defaultProducts: {
        DIAGNOSTICS: 5,
        BODY: 1,
        ENGINE: 12,
        FUEL: 8,
        STEERING: 11,
        BRAKE: 9
    },
    async init() {
        this.loadCarServicesFromDB();
    },
    async loadCarServicesFromDB() {
        dbCarServices = await db.Models.CarService.findAll();

        for (var i = 0; i < dbCarServices.length; i++) {
            this.createCarService(dbCarServices[i]);
        }
        console.log(`[CARSERVICE] Загружено автомастерских: ${i}`);
    },
    createCarService(carService) {
        mp.blips.new(402, new mp.Vector3(carService.x, carService.y, carService.z),
            {
                name: "Автомастерская",
                shortRange: true,
            });

        let shape = mp.colshapes.newSphere(carService.x, carService.y, carService.z, carService.radius);
        shape.isCarService = true;
        shape.carServiceId = carService.id;
    },
    getRepairPriceMultiplier(vehicle) {
        let price = vehicle.properties.price;
        let multiplier;

        if (price < 5000) {
            multiplier = 1;
        }
        if (price >= 5000 && price < 15000) {
            multiplier = 1.5;
        }
        if (price >= 5000 && price < 15000) {
            multiplier = 2;
        }
        if (price >= 15000 && price < 30000) {
            multiplier = 4;
        }
        if (price >= 30000 && price < 60000) {
            multiplier = 6;
        }
        if (price >= 60000 && price < 120000) {
            multiplier = 12;
        }
        if (price >= 120000 && price < 250000) {
            multiplier = 25;
        }
        if (price >= 250000 && price < 500000) {
            multiplier = 60;
        }
        if (price >= 500000 && price < 1000000) {
            multiplier = 120;
        }
        if (price >= 1000000) {
            multiplier = 250;
        }
        return multiplier;
    },
    repairVehicle(vehicle) {
        try {
            if (vehicle.db) {
                vehicle.db.update({
                    engineState: 0,
                    fuelState: 0,
                    steeringState: 0,
                    brakeState: 0
                });
            }
            vehicle.engineState = 0;
            vehicle.fuelState = 0;
            vehicle.steeringState = 0;
            vehicle.brakeState = 0;
            vehicles.updateConsumption(vehicle);
        } catch (err) {
            console.log(err);
        }
    },
    getBizParamsById(id) {
        let service = dbCarServices.find(x => x.bizId == id);
        if (!service) return;
        let params = [
            {
                key: 'priceMultiplier',
                name: 'Наценка на услуги',
                max: this.maxPriceMultiplier,
                min: this.minPriceMultiplier,
                current: service.priceMultiplier
            },
            {
                key: 'salaryMultiplier',
                name: 'Коэффициент зарплаты',
                max: this.maxSalaryMultiplier,
                min: this.minSalaryMultiplier,
                current: service.salaryMultiplier
            },
        ]
        return params;
    },
    setBizParam(id, key, value) {
        let service = dbCarServices.find(x => x.bizId == id);
        if (!service) return;
        service[key] = value;
        service.save();
    },
    getProductsAmount(id) {
        let service = dbCarServices.find(x => x.id == id);
        let bizId = service.bizId;
        let products = bizes.getProductsAmount(bizId);
        return products;
    },
    removeProducts(id, products) {
        let service = dbCarServices.find(x => x.id == id);
        let bizId = service.bizId;
        bizes.removeProducts(bizId, products);
    },
    getPriceMultiplier(id) {
        let service = dbCarServices.find(x => x.id == id);
        return service.priceMultiplier;
    },
    getSalaryMultiplier(id) {
        let service = dbCarServices.find(x => x.id == id);
        return service.salaryMultiplier;
    },
    updateCashbox(id, money) {
        let service = dbCarServices.find(x => x.id == id);
        let bizId = service.bizId;
        bizes.bizUpdateCashBox(bizId, money);
    },
    calculateBonus(player) {
        let skill = jobs.getJobSkill(player, 3).exp;
        return +(skill / 500).toFixed(2);
    }
}