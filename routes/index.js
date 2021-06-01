var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

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

/* GET root directory - Redirect to "/books" */
router.get(
	'/',
	asyncHandler(async (req, res, next) => {
		res.redirect('/books');
	})
);

// /* GET books page with list of books */
// router.get(
// 	'/books',
// 	asyncHandler(async (req, res, next) => {
// 		// const books = await Book.findAll({ order: [['createdAt', 'DESC']] });
// 		res.render('index');
// 		// console.log(books.map(book => book.toJSON()));
// 	})
// );

// /*GET generated error route - create and throw 500 server error for testing*/
// router.get('/error', (req, res, next) => {
// 	// Log out a custom error handler
// 	console.log('Custom error route was called');
// 	const err = new Error();
// 	err.message = `Custom 500 error thrown`;
// 	err.status = 500;
// 	throw err;
// });

module.exports = router;
