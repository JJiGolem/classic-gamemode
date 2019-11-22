let points;

module.exports = {
    async init() {
        await this.loadInfoPointsFromDB();
    },
    async loadInfoPointsFromDB() {
        points = await db.Models.InfoPoint.findAll();
        for (var i = 0; i < points.length; i++) {
            this.createInfoPoint(points[i]);
        }
        console.log(`[INFOPEDS] Загружено точек с информацией: ${i}`);
    },
    createInfoPoint(point) {
        let blip = mp.blips.new(456, new mp.Vector3(point.x, point.y, point.z),
            {
                name: "Информация",
                color: 5,
                shortRange: true,
            });
        blip.infoPointId = point.id;
        let marker = mp.markers.new(1, new mp.Vector3(point.x, point.y, point.z), 0.4,
            {
                color: [252, 227, 3, 200],
                visible: true
            });
        marker.infoPointId = point.id;
        let shape = mp.colshapes.newSphere(point.x, point.y, point.z, 1.4);
        shape.isInfoPointShape = true;
        shape.infoPointId = point.id;
    },
    getPointsData() {
        return points;
    },
    addPointsData(point) {
        points.push(point);
    }
}