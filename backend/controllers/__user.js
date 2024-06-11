const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// exports.login = (req, res, next) => {
//   console.log('exportlogin %o', req);
//   User.findOne({ email: req.body.email })
//     .then((user) => {
//       // on vérifie si l'utilisateur existe, si n'existe pas -> erreur. 
//       // On ne précise pas l'erreur pour ne pas laisser entendre si utilisateur existe ou non
//       if (user === null) {
//         res.status(401).json({ message: 'Paire identifiant/ mot de passe incorrecte' })
//       } else {
//         // on compare le mot de passe entré par l'utilisateur avec le hash existant dans la BDD
//         bcrypt.compare(req.body.password, user.password)
//           .then((valid) => {
//             //  si ne correspond pas -> erreur
//             if (!valid) {
//               res.status(401).json({ message: 'Paire identifiant/ mot de passe incorrecte' })
//             } else {
//               // si correspond -> réponse 200 contenant l'id de l'utilisateur et un token
//               res.status(200).json({
//                 userId: user.id,
//                 // fonction sign permet de chiffrer un nouveau token
//                 token: jwt.sign(
//                   // le token contien l'id de l'utilisateur
//                   { userId: user.id },
//                   // clé secrète pour l'encodage
//                   'RANDOM_TOKEN_SECRET',
//                   // argument de configuration, chaque token expire au bout de 24 heures
//                   { expiresIn: '24h' },
//                 ),
//               });
//             }
//           })
//           .catch((error) => {
//             res.status(500).json({ error });
//           });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });
// };

exports.login = (req, res, next) => {
  console.log(req.body.email);
  User.findOne({ email: req.body.email })
    .then(user => {
      // on vérifie si l'utilisateur existe, si n'existe pas -> erreur.
      // On ne précise pas l'erreur pour ne pas laisser entendre si utilisateur existe ou non
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
            userId: user.id,
            // fonction sign permet de chiffrer un nouveau token
            token: jwt.sign(
              { userId: user.id },
              // clé secrète pour l'encodage
              'RANDOM_TOKEN_SECRET',
              // argument de configuration, chaque token expire au bout de 24 heures
              { expiresIn: '24h' }
            ),
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
