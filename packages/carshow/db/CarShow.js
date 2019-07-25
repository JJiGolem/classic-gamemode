module.exports = (sequelize, DataTypes) => {

	const model = sequelize.define("CarShow", {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true
        },
        name: {
			type: DataTypes.STRING(128),
			allowNull: true
        },
        x: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        y: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        z: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        blipId: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1,
			allowNull: false
        },
        blipColor: {
            type: DataTypes.INTEGER(11),
            defaultValue: 4,
			allowNull: false
        }
	}, {timestamps: false});


	return model;
};
