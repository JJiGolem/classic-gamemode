let farms = call('farms');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("FarmField", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        labelPos: {
            type: DataTypes.STRING(128),
            allowNull: false,
            get() {
                var val = this.getDataValue('labelPos');
                return JSON.parse(val);
            },
            set(val) {
                this.setDataValue('labelPos', JSON.stringify(val));
            }
        },
        p1: {
            type: DataTypes.STRING(128),
            allowNull: false,
            get() {
                var val = this.getDataValue('p1');
                return JSON.parse(val);
            },
            set(val) {
                this.setDataValue('p1', JSON.stringify(val));
            }
        },
        p2: {
            type: DataTypes.STRING(128),
            allowNull: false,
            get() {
                var val = this.getDataValue('p2');
                return JSON.parse(val);
            },
            set(val) {
                this.setDataValue('p2', JSON.stringify(val));
            }
        },
        p3: {
            type: DataTypes.STRING(128),
            allowNull: false,
            get() {
                var val = this.getDataValue('p3');
                return JSON.parse(val);
            },
            set(val) {
                this.setDataValue('p3', JSON.stringify(val));
            }
        },
        p4: {
            type: DataTypes.STRING(128),
            allowNull: false,
            get() {
                var val = this.getDataValue('p4');
                return JSON.parse(val);
            },
            set(val) {
                this.setDataValue('p4', JSON.stringify(val));
            }
        },
        type: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 3);
                this.setDataValue('type', val);
            },
        },
        count: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, farms.cropMax);
                this.setDataValue('count', val);
            },
        },
        farmId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        model.belongsTo(models.Farm, {
            as: "farm",
            foreignKey: "farmId",
        });
    };

    return model;
};
