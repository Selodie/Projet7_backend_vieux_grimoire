const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// on définit les types MIME pour les extensiosn de fichiers
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// on configure le type de stockage des fichiers
const storage = multer.diskStorage({
  // on indique la destinaion où enregistrer les fichiers, dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // indique à multer d'utilisier le nom d'origine, de remplacer les espaces par des underscores,
  // d'ajouter un timestamp comme nom de fichier et de sélectionner l'extension appropriée
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    // utilisation de la constante de type MIME pour résoudre l'extension du fichier approprié
    const extension = MIME_TYPES[file.mimetype];
    // nom du fichier généré
    callback(null, `${name + Date.now()}.${extension}`);
  },
});

// on lui passe comme constante storage et on lui spécifie que ne doit gérer qu'un
// seul fichier téléchargé dans le champ image
module.exports = multer({ storage }).single('image');

// on redimensionne l'image
module.exports.resizePicture = (req, res, next) => {
  // On vérifie si un fichier a été téléchargé
  if (!req.file) {
    //  aucun fichier trouvé, on passe au middleware suivant
    return next();
  }

  // chemin du fichier téléchargé
  const filePath = req.file.path;
  // nom du fichier
  const fileName = req.file.filename;
  // chemin où le fichier redimensionné sera enregistré
  const outputFilePath = path.posix.join('images', `resized_${fileName.split('.')[0]}.webp`);
  console.log(outputFilePath);

  // désactivation du cache
  sharp.cache(false);
  // redimension, conversion au format webP et enregistrement de l'image
  sharp(filePath)
    .resize({height: 800})
    .toFormat('webp')
    .toFile(outputFilePath)
    .then(() => {
      // supprime le fichier original
      fs.unlink(filePath, () => {
        // met à jour le chemin du fichier dans la requête
        req.file.path = outputFilePath;
        console.log(`Image ${fileName} supprimée avec succès !`);
        next();
      });
    })
    .catch(err => {
      console.log(err);
      return next();
    });
}
