var express = require('express');
var router = express.Router();
const { Book } = require('../models'); // Import Book Model from models
const { Op } = require('sequelize'); // Import Operators from Sequelize for querying database

/* Handler function to wrap each route. */
function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (error) {
			// Forward error to the global error handler
			next(error);
		}
	};
}

/* GET - listing of all books */
router.get(
	'/',
	asyncHandler(async (req, res) => {
		const page = parseInt(req.query.page || 1);
		const { count, rows: books } = await Book.findAndCountAll({
			limit: 5,
			offset: page * 5 - 5,
			order: [['createdAt', 'DESC']],
		});
		const totalPages = Math.ceil(count / 5);
		res.render('books/index', { books, title: 'Books', page, totalPages });
	})
);

/* GET - Find books from search listing*/
router.get(
	'/search',
	asyncHandler(async (req, res, next) => {
		if (req.query.query === '') {
			res.redirect('/');
		} else {
			const query = req.query.query;
			const page = parseInt(req.query.page || 1);
			const { count, rows: books } = await Book.findAndCountAll({
				limit: 5,
				offset: page * 5 - 5,
				order: [['createdAt', 'DESC']],
				where: {
					[Op.or]: [
						{ title: { [Op.substring]: query } },
						{ author: { [Op.substring]: query } },
						{ genre: { [Op.substring]: query } },
						{ year: { [Op.eq]: query } },
					],
				},
			});
			const totalPages = Math.ceil(count / 5);
			console.log(totalPages);
			res.render('books/index', {
				books,
				title: 'Books',
				query,
				page,
				totalPages,
			});
		}
	})
);

/* GET - create a new book form */
router.get('/new', (req, res) => {
	res.render('books/new_book', { title: 'Add a New Book' });
});

/* POST - add a book to library */
router.post(
	'/new',
	asyncHandler(async (req, res) => {
		let book;
		try {
			book = await Book.create(req.body);
			res.redirect('/');
		} catch (error) {
			if (error.name === 'SequelizeValidationError') {
				// check error type
				book = await Book.build(req.body);
				res.render('books/new_book', {
					book,
					errors: error.errors,
					title: 'New Book',
				});
			} else {
				throw error; // error caught in the asyncHandler's catch block
			}
		}
	})
);

/* GET - edit book form - */
router.get(
	'/:id',
	asyncHandler(async (req, res) => {
		const book = await Book.findByPk(req.params.id);
		if (book) {
			res.render('books/update_book', { book, title: 'Update a book' });
		} else {
			res.sendStatus(404);
		}
	})
);

/* POST - update a book */
router.post(
	'/:id',
	asyncHandler(async (req, res) => {
		let book;
		try {
			book = await Book.findByPk(req.params.id);
			if (book) {
				await book.update(req.body);
				res.redirect('/books');
			} else {
				res.sendStatus(404);
			}
		} catch (error) {
			if (error.name === 'SequelizeValidationError') {
				book = await Book.build(req.body);
				book.id = req.params.id;
				res.render('books/edit', {
					book,
					errors: error.errors,
					title: 'Edit Book',
				});
			} else {
				throw error;
			}
		}
	})
);

/* POST - delete individual article */
router.post(
	'/:id/delete',
	asyncHandler(async (req, res) => {
		const book = await Book.findByPk(req.params.id);
		if (book) {
			await book.destroy();
			res.redirect('/');
		} else {
			res.sendStatus(404);
		}
	})
);
module.exports = router;
