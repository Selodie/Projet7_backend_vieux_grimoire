// importation des modules nécessaires
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

// fonction pour inscrire un nouvel utilisateur
exports.signup = (req, res, next) => {
  // hachage du mot de passe
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // création d'un nouvel utilisateur
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // sauvegarde l'utilisateur dans la base de données
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// pour se connecter
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      // on vérifie si l'utilisateur existe, si n'existe pas -> erreur.
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // on compare le mot de passe entré par l'utilisateur avec le hash existant dans la BDD
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            //  si ne correspond pas -> erreur
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // si correspond -> réponse 200 contenant l'id de l'utilisateur et un token
          res.status(200).json({
            userId: user._id,
            // fonction sign permet de chiffrer un nouveau token
            token: jwt.sign(
              { userId: user._id },
              // clé secrète pour l'encodage
              'RANDOM_TOKEN_SECRET',
              // argument de configuration, chaque token expire au bout de 24 heures
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
