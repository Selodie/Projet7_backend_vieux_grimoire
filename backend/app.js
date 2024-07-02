// importe les modules nécessaires
const express = require('express');

const mongoose = require('mongoose');

const path = require('path');

const bookRoutes = require('./routes/book');

const userRoutes = require('./routes/user');

require('dotenv').config();

// connexion à mongoose la base de données
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_URL}/?retryWrites=true&w=majority&appName=${process.env.MONGODB_NAME}`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => {
    console.log('Connexion à MongoDB échouée %o !', error);
  });

// création d'une application express
const app = express();

// middleware pour analyser les corps des requêtes entrante en JSON
app.use(express.json());

// middleware CORS. on définit les en-têtes de réponse HTTP pour gérer les CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// on associe les routes aux bonnes URI
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
// permet d'aller récupérer les images contenue dans le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
