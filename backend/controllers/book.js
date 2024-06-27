const fs = require('fs');

const Book = require('../models/Book');

// Création d'un livre
// req -> requête HTTP entrante, res -> réponse HTTP à renvoyer, next -> passe au middleware suivant
exports.createBook = (req, res, next) => {
  // conversion des données json du livre en objet
  const bookObject = JSON.parse(req.body.book);
  // on supprime les propriétés _id et _userId si elles existent
  delete bookObject._id;
  delete bookObject._userId;
  // création d'un nouvel objet Book avec les données fournies, l'ajout de l'id
  // de l'utilisateur et de l'URL de l'image
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    // chemin de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`
  });
  // sauvegarde le livre dans la BDD
  book.save()
    .then(() => { res.status(201).json({ message: 'Livre enregistré !' })})
    .catch((error) => { res.status(400).json( { error })})
};

// modification d'un livre
exports.modifyBook = (req, res, next) => {
  // on vérifie si un fichier à été téléchargé
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`
    // si aucun fichié n'est téléchargé, on utilise directement les données du
    // corps de la requête
  } : { ...req.body };

  delete bookObject._userId;
  // utilisation de la méthode findOne() de Mongoose pour rechercher un livre par rapport
  // à son id
  Book.findOne({_id: req.params.id})
    .then((book) => {
      // on vérifie si l'utilisateur authentifié est celui qui a ajouté le livre
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message : 'Not authorized'});
      } else {
        // on récupère le nom du fichier de l'image actuelle du livre
        const filename = book.imageUrl.split("/images/")[1];
        // s'il y a un nouveau fichier
        if (req.file) {
          // on supprime l'ancienne image
          fs.unlink(`images/${filename}`, (err) => {
            if (err) console.log(err);
          });
        }
        // si l'utilisateur est autorisé, mise à jour du livre
        Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Livre modifié!'}))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// suppression d'un livre
exports.deleteBook = (req, res, next) => {
  // recherche du livre par son id
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // on vérifie si l'utilisateur est autorisé à supprimer le livre
      if (book.userId != req.auth.userId) {
        res.status(401).json({message: 'Not authorized'});
      } else {
        // suppression de l'image associée au livre
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          // suppression du livre de la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Livre supprimé !' })})
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch( (error) => {
      res.status(500).json({ error });
    });
};

// obtenir un livre par rapport à son id
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// pour obtenir tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// pour obtenir les livres classées par note moyenne
exports.getBestRating = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// pour ajouter une nouvelle note et calculer la moyenne qui est ensuite
// mise à jour dans la base de données
exports.createBestRating = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // on vérifie que l'id de l'utilisateur qui a ajouté le livre est différent
      // de l'id de l'utilisateur qui est actuellement authentifié
      if (book.userId !== req.auth.userId) {
        // on ajoute un nouvel objet au tableau rating
        book.ratings.push({
          userId: req.auth.userId,
          grade: req.body.rating,
        });
        // calcul de la moyenne des notes contenues dans grade
        // on calcule la somme total des notes contenues dans grade
        let totalGrades = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        // on divise le total des notes par le nombre d'éléments dans le tableau ratings
        // puis on multiplie le résultat par 10 pour déplacer le point décimal
        let averageGradeNumber = (totalGrades / book.ratings.length) * 10;

        // // on arrondi à l'entier le plus proche
        averageGradeNumber = Math.round(averageGradeNumber);

        // on divise par 10 pour rétablir le point décimal
        averageGradeNumber /= 10;

        // on ajoute le résultat a averageRating qui contient la moyenne du livre
        book.averageRating = averageGradeNumber;

        // on sauvegarde dans la BDD
        book.save()
          .then(() => { res.status(200).json(book)})
          .catch((error) => { res.status(400).json({ error })});
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
