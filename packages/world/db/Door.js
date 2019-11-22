module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Door", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        hash: {
            type: DataTypes.INTEGER(11),
            defaultValue: null,
            allowNull: true,
            set(val) {
                if (!val) val = null;

                this.setDataValue('hash', val);
            },
        },
        locked: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                if (typeof val == 'boolean') val = (val) ? 1 : 0;
                val = Math.clamp(val, 0, 1);
                this.setDataValue('locked', val);
            },
        },
        pos: {
            type: DataTypes.STRING(128),
            allowNull: false,
            get() {
                var val = this.getDataValue('pos');
                return JSON.parse(val);
            },
            set(val) {
                if (typeof val == 'object') val = JSON.stringify(val);

                this.setDataValue('pos', val);
            }
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {

    };

    return model;
};
