const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookController = require('../controllers/book');

router.get('/', bookController.getAllBooks);
router.post('/', auth, multer, bookController.createBook);
router.get('/:id', bookController.getOneBook);
router.put('/:id', auth, multer, bookController.modifyBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
