const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// on définit le schéma pour un utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// plugin qui ajoute une validation pour s'assurer que les champs sont uniques dans la bdd
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
