'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Book extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Book.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						// custom error message
						msg: 'Looks like you forgot a title for your book.',
					},
					notEmpty: {
						// custom error message
						msg: 'Looks like you forgot a title for your book.',
					},
				},
			},
			author: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						// custom error message
						msg: 'Looks like you forgot an author for your book.',
					},
					notEmpty: {
						// custom error message
						msg: 'Looks like you forgot an author for your book.',
					},
				},
			},
			genre: DataTypes.STRING,
			year: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Book',
		}
	);
	return Book;
};
