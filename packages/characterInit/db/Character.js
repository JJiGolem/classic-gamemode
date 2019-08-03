"use strict";
const Sequelize = require('sequelize');

/// Модель персоонажа аккаунта
module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Character", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        accountId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        /// Финансы
        cash: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        bank: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        /// Последние сохраненные координаты
        x: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        y: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        z: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        /// Статус
        status: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        admin: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        /// Ограничения
        warnDate: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        warnNumber: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        /// Статистика
        minutes: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        dateCreate: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        /// Лицензии

        /// Внешность
        gender: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        father: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        mother: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        similarity: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        skin: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        hair: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        hairColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        hairHighlightColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        eyebrowColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        beardColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        eyeColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        blushColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        lipstickColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        chestHairColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
    }, 
    {
        timestamps: false
    });

    model.associate = (models) => {
        model.belongsTo(models.Account, {
            foreignKey: "accountId"
        });
        model.hasMany(models.Feature, {
            foreignKey: "characterId"
        });
        model.hasMany(models.Appearance, {
            foreignKey: "characterId"
        });
    };
    return model;
};