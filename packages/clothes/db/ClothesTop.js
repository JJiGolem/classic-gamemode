let farms = call('farms');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("ClothesTop", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        variation: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        pockets: {
            type: DataTypes.STRING(128),
            allowNull: false,
            get() {
                var val = this.getDataValue('pockets');
                return JSON.parse(val);
            },
            set(val) {
                if (typeof val == 'object') val = JSON.stringify(val);

                this.setDataValue('pockets', val);
            }
        },
        price: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        textures: {
            type: DataTypes.STRING(128),
            allowNull: false,
            get() {
                var val = this.getDataValue('textures');
                return JSON.parse(val);
            },
            set(val) {
                if (typeof val == 'object') val = JSON.stringify(val);

                this.setDataValue('textures', val);
            }
        },
        sex: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
        },
        torso: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
        },
        class: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1,
            allowNull: false,
        }
    }, {
        timestamps: false
    });

    return model;
};
