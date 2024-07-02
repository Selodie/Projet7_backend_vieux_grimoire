const mongoose = require('mongoose');

// // on définit le schéma pour des livres
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true, validate: {
    validator(v) {
      // on vérifie que le champ n'est pas seulement rempli d'espaces
      return v.trim().length > 0;
    },
    message: 'Ce champ doit contenir le titre du livre.'
  } },
  author: { type: String, required: true, validate: {
    validator(v) {
      // on vérifie que le champ n'est pas seulement rempli d'espaces
      return v.trim().length > 0;
    },
    message: "Ce champ doit contenir le nom de l'auteur."
  } },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true, validate: {
    validator(v) {
      // on vérifie que le champ n'est pas seulement rempli d'espaces
      return v.trim().length > 0;
    },
    message: 'Ce champ doit contenir le genre du livre.'
  } },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true, min: 0, max: 5 },
    },
  ],
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model('Book', bookSchema);
