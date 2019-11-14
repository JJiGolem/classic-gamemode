module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Club", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        bizId: {
            type: DataTypes.INTEGER(11),
            defaultValue: null,
            allowNull: true
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
        model.belongsTo(models.Biz, {
            foreignKey: "bizId"
        });
    };

    return model;
};
