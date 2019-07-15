module.exports = function(sequelize, DataTypes) {
    var Student = sequelize.define("Student", {
        student_name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Student.associate = function(models) {
        Student.hasMany(models.Post, {
            onDelete: "cascade"
        });

        Student.belongsTo(models.Parent, {
            foreignKey: {
                allowNull: false
            }
        });

        Student.belongsTo(models.Teacher, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Student;

};