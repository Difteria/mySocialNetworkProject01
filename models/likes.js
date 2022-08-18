'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Users.belongsToMany(models.posts, {
        through: models.likes,
        foreignKey: 'userId',
        otherkey: 'postId'
      });
      models.posts.belongsToMany(models.Users, {
        through: models.likes,
        foreignKey: 'postId',
        otherkey: 'userId'
      });
      models.likes.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user'
      });
      models.likes.belongsTo(models.posts, {
        foreignKey: 'postId',
        as: 'posts'
      });
    }
  }
  likes.init({
  }, {
    sequelize,
    modelName: 'likes',
  });
  return likes;
};