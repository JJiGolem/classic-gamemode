"use strict";


let bizes = new Array();
let bizInfos = new Array();
module.exports = {
    async init() {
        let bizesInfo = await db.Models.Biz.findAll();
        for (let i = 0; i < bizesInfo.length; i++) {
            this.addBiz(bizesInfo[i]);
            //this.setTimer(i);
        }
        bizInfos[0] = await db.Models.FuelStation.findAll();
        bizInfos[1] = await db.Models.CarService.findAll();
    },
    async createBiz() {

    },
    getBizById(id) {
        return bizes.find(x => x.id == id);
    },
    getTypeName(type) {
        /// Список с расшифровкой типов бизнесов
        switch(type) {
            case 0: return "FuelStation";
            case 1: return "CarService";
            default: return null;
        }
    },
    addBiz(bizInfo) {
        let colshape = mp.colshapes.newSphere(bizInfo.x, bizInfo.y, bizInfo.z, 4.0, 0);
        bizes.push({
                colshape: colshape,
                info: bizInfo
            }
        );
    },
}