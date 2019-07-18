var vehicles = call('vehicles');
var dbCarList;
var dbCarShow;
var carShow = [];
var carList = [];

const CARLIST_UPDATE_INTERVAL = 60 * 60 * 1000; /// Интервал заполнения автосалона автомобилями (в секундах)

module.exports = {
    async init() {
        await this.loadCarShowsFromDB();
        await this.loadCarListsFromDB();
        this.startCarListUpdating();
    },
    async loadCarShowsFromDB() { /// Загрузка автосалонов из БД
        dbCarShow = await db.Models.CarShow.findAll();
        for (var i = 0; i < dbCarShow.length; i++) {
            carShow.push({
                sqlId: dbCarShow[i].id,
                name: dbCarShow[i].name,
                x: dbCarShow[i].x,
                y: dbCarShow[i].y,
                z: dbCarShow[i].z,
                blipId: dbCarShow[i].blipId,
                blipColor: dbCarShow[i].blipColor
            });
        }
        for (var i = 0; i < dbCarShow.length; i++) {
            this.createCarShow(dbCarShow[i]);
        }
        console.log(`[CARSHOW] Загружено автосалонов: ${i}`);
    },
    createCarShow(carShow) {
        mp.blips.new(carShow.blipId, new mp.Vector3(carShow.x, carShow.y, carShow.z),
            {
                name: carShow.name,
                color: carShow.blipColor,
                shortRange: true,
            });
        mp.markers.new(1, new mp.Vector3(carShow.x, carShow.y, carShow.z), 2,
            {
                direction: new mp.Vector3(carShow.x, carShow.y, carShow.z),
                rotation: 0,
                color: [255, 255, 255, 255],
                visible: true,
                dimension: 0
            });
        let shape = mp.colshapes.newSphere(carShow.x, carShow.y, carShow.z, 2);
        shape.isCarShow = true;
        shape.carShowId = carShow.id;
    },
    async loadCarListsFromDB() {
        dbCarList = await db.Models.CarList.findAll();

        for (var i = 0; i < dbCarList.length; i++) {
            carList.push({
                sqlId: dbCarList[i].id,
                carShowId: dbCarList[i].carShowId,
                count: dbCarList[i].count,
                vehiclePropertyModel: dbCarList[i].vehiclePropertyModel,
                percentage: dbCarList[i].percentage,
                db: dbCarList[i]
            });
        }

        for (var i = 0; i < carList.length; i++) { /// Устанавливаем характеристики для каждого автомобиля, расположенного в автосалоне
            carList[i] = this.setCarListProperties(carList[i]);
        }
        console.log(`[CARSHOW] Загружено моделей авто для автосалонов: ${i}`);
    },
    getCarShowList(carShowId) {
        var list = [];
        for (var i = 0; i < carList.length; i++) {
            if (carList[i].carShowId == carShowId) {
                list.push(carList[i]);
            }
        }
        return list;
    },
    setCarListProperties(veh) {
        let properties = vehicles.setVehiclePropertiesByModel(veh.vehiclePropertyModel);
        veh.properties = properties;
        return veh;
    },
    startCarListUpdating() {
        setInterval(() => {
            try {
                this.updateCarList();
            } catch (err) {
                console.log(err);
            }
        }, CARLIST_UPDATE_INTERVAL);

        /* ДЛЯ ТЕСТОВ
                for (let j = 0; j < 720; j++) {
                    this.updateCarList();
                }
        */
    },
    updateCarList() {
        console.log("[CARSHOW] Запуск обновления автосалонов");
        for (var i = 0; i < carList.length; i++) {
            let randomInt = this.generateRandomInt();
            console.log(randomInt);
            if (randomInt <= carList[i].percentage) {
                console.log(`[CARSHOW] В автосалон добавлен т/c ${carList[i].vehiclePropertyModel}`);
                carList[i].count = carList[i].count + 1;
                carList[i].db.update({
                    count: carList[i].count + 1
                });
            }
        }
        console.log("[CARSHOW] Обновление автосалонов завершено");
    },
    generateRandomInt() {
        return Math.floor(Math.random() * 1000);
    },
    getCarShowPropertyBySqlId(prop, sqlId) {
        for (var i = 0; i < carShow.length; i++) {
            if (carShow[i].sqlId == sqlId) {
                return carShow[i][prop];
            }
        }
    }
}