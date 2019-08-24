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
        /// Работа
        job: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        // Организация
        factionId: {
            type: DataTypes.INTEGER(11),
            defaultValue: null,
            allowNull: true
        },
        factionRank: {
            type: DataTypes.INTEGER(11),
            defaultValue: null,
            allowNull: true
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
        creationDate: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        /// Лицензии
        carLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        passengerLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        bikeLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        truckLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        airLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        boatLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        gunLicenseDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
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
        // Здоровье, сытость, голод
        health: {
            type: DataTypes.INTEGER(11),
            defaultValue: 100,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 100);
                this.setDataValue('health', val);
            },
        },
        satiety: {
            type: DataTypes.INTEGER(11),
            defaultValue: 100,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 100);
                this.setDataValue('satiety', val);
            },
        },
        thirst: {
            type: DataTypes.INTEGER(11),
            defaultValue: 100,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 100);
                this.setDataValue('thirst', val);
            },
        },
        // Уровень розыска
        wanted: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 5);
                this.setDataValue('wanted', val);
            },
        },
        // Оставшееся время ареста
        arrestTime: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                if (val < 0) val = 0;
                this.setDataValue('arrestTime', val);
            }
        },
        // Типа ареста: 0 - КПЗ, 1 - тюрьма, 2 - деморган
        arrestType: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
    }, {
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
        model.belongsTo(models.Faction, {
            foreignKey: "factionId",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
        });
        model.belongsTo(models.FactionRank, {
            foreignKey: "factionRank",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        });
        model.hasOne(models.Phone, {
            foreignKey: "characterId",
        });
        model.hasOne(models.House, {
            foreignKey: "characterId",
        });
    };
    return model;
};
