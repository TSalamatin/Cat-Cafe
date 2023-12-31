const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')
const sequelize = require('../config/connection');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password)
  }
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cat_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cat',
        key: 'id',
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (newData) => {
        try {
          newData.password = await bcrypt.hash(newData.password, 10);
        } catch (err) {
          console.log(err);
        }
      },
      beforeBulkCreate: (bulk) => {
          bulk.forEach((user) => {
            user.dataValues.password = bcrypt.hashSync(user.dataValues.password, 10)
          }
          )
      },
      beforeUpdate: async (updatedUserData) => {
        try {
          updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        } catch (error) {
          console.log(error);
        }
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  },
);




// User.beforeBulkCreate( (user) => {
//   user.forEach((user) => {
//     user.dataValues.password = bcrypt.hashSync(user.dataValues.password,10 )
//   })
// })


module.exports = User;
