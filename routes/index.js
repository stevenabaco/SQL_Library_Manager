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
router.get('/', (req, res, next) => {
	res.redirect('/books');
});

module.exports = router;
