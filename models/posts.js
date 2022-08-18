'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.posts.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user'
      });
      models.posts.hasMany(models.comments);
      models.posts.hasMany(models.likes);
    }
  }
  posts.init({
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    picture: DataTypes.STRING,
    likesCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};