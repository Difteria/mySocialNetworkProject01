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
      models.comments.belongsTo(models.Users, {
        foreignKey: {
          allowNull: false,
        }
      });
      models.comments.belongsTo(models.posts, {
        foreignKey: {
          allowNull: false,
        }
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