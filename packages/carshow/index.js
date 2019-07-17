var vehicles = call('vehicles');
var dbCarList;
var carList = [];
module.exports = {
    async init() {
        await this.loadCarShowsFromDB();
        await this.loadCarListsFromDB();
    },
    async loadCarShowsFromDB() { /// Загрузка автомобилей фракций/работ из БД 
        var dbCarShow = await db.Models.CarShow.findAll();
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
                id: dbCarList[i].id,
                carShowId: dbCarList[i].carShowId,
                count: dbCarList[i].count,
                vehiclePropertyModel: dbCarList[i].vehiclePropertyModel
            });
        }
        for (var i = 0; i < carList.length; i++) {
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
    }
}