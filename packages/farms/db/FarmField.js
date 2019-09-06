module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("FarmField", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        labelPos: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        p1: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        p2: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        p3: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        p4: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        count: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
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
