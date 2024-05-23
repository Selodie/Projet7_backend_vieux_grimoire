const express = require('express');

const auth = require('../middleware/auth');

const bookController = require('../controllers/book');

const router = express.Router();

router.get('/', bookController.getAllBook);
// attention remettre le auth !!
router.post('/', bookController.createBook);
router.get('/:id', auth, bookController.getOneBook);
router.put('/:id', auth, bookController.modifyBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
