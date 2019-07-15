module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [1]
        }
    });

    Post.associate = function(models) {
        Post.belongsTo(models.Student, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    Post.associate = function(models) {
        Post.belongsTo(models.Teacher, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Post;

};