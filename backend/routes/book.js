const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookController = require('../controllers/book');

// on définit les routes pour gérer les opérations CRUD sur les livres
// on utilise des middleware pour l'authentification et le traitement des fichiers
// ainsi que des fonctions de controller

// on récupère tous les livres
router.get('/', bookController.getAllBooks);
// on récupère les livres classés par moyenne
router.get('/bestrating', bookController.getBestRating);
// pour la création d'un livre
router.post('/', auth, multer, multer.resizePicture, bookController.createBook);
// pour attribuer un note à un livre
router.post('/:id/rating', auth, multer, bookController.createBestRating);
// pour récupérer un livre par rapport à son id
router.get('/:id', bookController.getOneBook);
// pour modifier un livre
router.put('/:id', auth, multer, multer.resizePicture, bookController.modifyBook);
// pour supprimer un livre
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
