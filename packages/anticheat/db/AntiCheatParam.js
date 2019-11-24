"use strict";
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("AntiCheatParam", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        enable: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        punish: {
            type: DataTypes.STRING(20),
            defaultValue: "notify",
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {

    };
    return model;
};
