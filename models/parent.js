module.exports = function(sequelize, DataTypes) {
    var Parent = sequelize.define("Parent", {
        parent_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Parent.associate = function(models) {
        Parent.belongsTo(models.User, {
            onDelete: "cascade",
            allowNull: true
        });

        Parent.hasMany(models.Student, {
            onDelete: "cascade"
        });
    };
    return Parent;
}