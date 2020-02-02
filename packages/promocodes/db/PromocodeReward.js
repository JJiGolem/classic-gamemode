"use strict";
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("PromocodeReward", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        ownerSum: {
            type: DataTypes.INTEGER(11),
            defaultValue: 10000,
            allowNull: false
        },
        playerSum: {
            type: DataTypes.INTEGER(11),
            defaultValue: 10000,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {

    };
    return model;
};
