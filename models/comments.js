'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Users.belongsToMany(models.posts, {
        through: models.comments,
        foreignKey: 'userId',
        otherkey: 'postId'
      });
      models.posts.belongsToMany(models.Users, {
        through: models.comments,
        foreignKey: 'postId',
        otherkey: 'userId'
      });
      models.comments.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user'
      });
      models.comments.belongsTo(models.posts, {
        foreignKey: 'postId',
        as: 'posts'
      });
    }
  }
  comments.init({
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};