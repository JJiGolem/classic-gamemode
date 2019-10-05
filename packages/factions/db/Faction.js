module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Faction", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        ammo: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                var max = this.getDataValue('maxAmmo');
                val = Math.clamp(val, 0, max);
                this.setDataValue('ammo', val);
            }
        },
        maxAmmo: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1000,
            allowNull: false
        },
        medicines: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                var max = this.getDataValue('maxMedicines');
                val = Math.clamp(val, 0, max);
                this.setDataValue('medicines', val);
            }
        },
        maxMedicines: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1000,
            allowNull: false
        },
        cash: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        blip: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1,
            allowNull: false
        },
        blipColor: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1,
            allowNull: false
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
        },
        h: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        wX: {
            type: DataTypes.FLOAT,
            defaultValue: null,
            allowNull: true
        },
        wY: {
            type: DataTypes.FLOAT,
            defaultValue: null,
            allowNull: true
        },
        wZ: {
            type: DataTypes.FLOAT,
            defaultValue: null,
            allowNull: true
        },
        sX: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        sY: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        sZ: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        hX: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        hY: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        hZ: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        model.hasMany(models.FactionRank, {
            foreignKey: 'factionId',
            as: "ranks"
        });
    };

    return model;
};
