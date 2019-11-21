module.exports = (sequelize, DataTypes) => {

	const model = sequelize.define("InfoPoint", {
		id: {
			type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
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
	}, {timestamps: false});

	return model;
};
