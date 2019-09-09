let farms = call('farms');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Farm", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        grains: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, farms.grainsMax);
                this.setDataValue('grains', val);
            }
        },
        productA: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, farms.productsMax);
                this.setDataValue('productA', val);
            }
        },
        productB: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, farms.productsMax);
                this.setDataValue('productB', val);
            }
        },
        productC: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, farms.productsMax);
                this.setDataValue('productC', val);
            }
        },
        productAPrice: {
            type: DataTypes.INTEGER(11),
            defaultValue: 10,
            allowNull: false
        },
        productBPrice: {
            type: DataTypes.INTEGER(11),
            defaultValue: 10,
            allowNull: false
        },
        productCPrice: {
            type: DataTypes.INTEGER(11),
            defaultValue: 10,
            allowNull: false
        },
        grainPrice: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER(11),
            defaultValue: 2000000,
            allowNull: false
        },
        playerId: {
            type: DataTypes.INTEGER(11),
            defaultValue: null,
            allowNull: true
        },
        balance: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        taxBalance: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1000,
            allowNull: false
        },
        pay: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 1, 300);
                this.setDataValue('pay', val);
            }
        },
        farmerPay: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 1, 300);
                this.setDataValue('farmerPay', val);
            }
        },
        tractorPay: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 1, 300);
                this.setDataValue('tractorPay', val);
            }
        },
        pilotPay: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 1, 300);
                this.setDataValue('pilotPay', val);
            }
        },
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
        }
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        model.belongsTo(models.Character, {
            as: "owner",
            foreignKey: "playerId",
        });
        model.hasMany(models.FarmField, {
            as: "fields",
            foreignKey: "farmId"
        });
    };

return model;
};
