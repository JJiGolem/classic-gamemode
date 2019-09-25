"use strict";
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("CharacterSettings", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        characterId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        // Место спавна (0 - улица, 1 - дом, 2 - организация)
        spawn: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        model.belongsTo(models.Character, {
            as: "settings",
            foreignKey: "characterId",
        });
    };
    return model;
};
