module.exports = function(sequelize, DataTypes) {
    var Teacher = sequelize.define("Teacher", {
        teacher_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Teacher.associate = function(models) {
        Teacher.belongsTo(models.User, {
            onDelete: "cascade"
        });

        Teacher.hasMany(models.Post, {
            onDelete: "cascade"
        });

        Teacher.hasMany(models.Student, {
            onDelete: "cascade"
        });
    };
    return Teacher;

};