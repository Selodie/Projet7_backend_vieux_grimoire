// on importe les modules dont on va se servir
const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');

// on définit les routes pour gérer les inscriptions et connexions des utilisateurs
// les requêtes sont traitées à l'aide des controller

// pour l'inscritpion d'un utilisateur
router.post('/signup', userCtrl.signup);
// pour la connexion d'un utilisteur
router.post('/login', userCtrl.login);

// on exporte l'objet routeur pour qu'il puisse être utilisé ailleurs dans l'appli
module.exports = router;
