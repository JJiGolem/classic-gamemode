module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("ChangelistLike", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        changelistId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        likeAccountId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        model.belongsTo(models.Account, {
            foreignKey: "likeAccountId",
        });
    };

    return model;
};
