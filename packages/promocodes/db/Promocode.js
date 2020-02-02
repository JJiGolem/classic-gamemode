"use strict";
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Promocode", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        characterId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        promocode: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        rewardId: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1,
            allowNull: false
        },
        invited: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
        },
        completed: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
        },
        media: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        model.belongsTo(models.Character, {
            foreignKey: "characterId",
        });
        model.belongsTo(models.PromocodeReward, {
            foreignKey: "rewardId",
        });
    };
    return model;
};
