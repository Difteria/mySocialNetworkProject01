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
      models.likes.belongsTo(models.Users, {
        foreignKey: {
          allowNull: false,
        }
      });
      models.likes.belongsTo(models.posts, {
        foreignKey: {
          allowNull: false,
        }
      });
    }
  }
  likes.init({
    isLiked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'likes',
  });
  return likes;
};