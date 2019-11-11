module.exports = (sequelize, DataTypes) => {

	const model = sequelize.define("RentPoint", {
		id: {
			type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            defaultValue: "Аренда",
			allowNull: false
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
        blip: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
			allowNull: false
        },
        blipColor: {
            type: DataTypes.INTEGER(11),
            defaultValue: 4,
			allowNull: false
        },
	}, {timestamps: false});

	return model;
};
