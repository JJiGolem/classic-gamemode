var vehicles = call('vehicles');
var dbCarList;

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
        let blip = mp.blips.new(carShow.blipId, new mp.Vector3(carShow.x, carShow.y, carShow.z),
            {
                name: carShow.name,
                color: carShow.blipColor,
                shortRange: true,
            });
    },
    async loadCarListsFromDB() {
        dbCarList = await db.Models.CarList.findAll();

        for (var i = 0; i < dbCarList.length; i++) {
            dbCarList[i].properties = vehicles.setVehiclePropertiesByModel(dbCarList[i].vehiclePropertyModel);
            console.log(dbCarList[i].properties.maxFuel);
        }
        console.log(`[CARSHOW] Загружено моделей авто для автосалонов: ${i}`);
    },
    getCarShowList(carShowId) {
        var list = [];
        for (var i = 0; i < dbCarList.length; i++) {
            if (dbCarList[i].carShowId == carShowId)
                list.push(dbCarList[i]);
        }
        return list;
    }
}