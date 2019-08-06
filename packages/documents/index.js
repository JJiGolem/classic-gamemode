"use strict";

const PASS_ID = 2608180000;
const CARPASS_ID = 1703190000;
const LIC_ID = 2206180000;

module.exports = {
    async init() {
    },
    getPassIdentificator() {
        return PASS_ID;
    },
    getCarPassIdentificator() {
        return CARPASS_ID;
    },
    getLicIdentificator() {
        return LIC_ID;
    }
}