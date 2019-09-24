"use strict";
const Sequelize = require('sequelize');

/// Модель персоонажа аккаунта
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
        // Собственный промокод
        promocode: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        // Кол-во приглашённых
        invited: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
        },
        // Кол-во выполнивших условие
        completed: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        
    };
    return model;
};
