"use strict";
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("TempPayDay", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        characterId: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {

    };
    return model;
};
