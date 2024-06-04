const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  // on indique la destinaion où enregistrer les fichiers, dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // indique à multer d'utilisier le nom d'origine, de remplacer les espaces par des underscores et
  // d'ajouter un timestamp comme nom de fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    // utilisation de la constante de type MIME pour résoudre l'extension du fichier approprié
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name + Date.now()}.${extension}`);
  },
});

// on lui passe comme constante storage et on lui indique de gérer uniquement les 
// téléchargements de fichiers image
module.exports = multer({ storage }).single('image');
