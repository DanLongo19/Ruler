var bcrypt = require("bcrypt-nodejs");
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // MJ added "occupation" to contain users in one table;
        // ENUM Datatype will allow us to differentiate if each user is a teacher or a parent
        occupation: {
            type: DataTypes.ENUM('TEACHER', 'PARENT'),
            allowNull: false
        }
    });
    User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };
    User.addHook("beforeCreate", function(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });
    return User;
};