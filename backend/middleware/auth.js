const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // on récupère le token JWT de l'en-tête authorization de la requête
    const token = req.headers.authorization.split(' ')[1];
    // on vérifie le token en utilisant une clé secrète. Si le token est valide
    // la fonction retourne un objet contenant les données codées dans le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // on extrait le userId du token décodé
    const userId = decodedToken.userId;
    // on ajouter ce userId à l'objet auth sur la requête
    req.auth = {
      userId: userId
    };
    // passe au middleware suivant
    next();
  } catch(error) {
    res.status(401).json({ error });
  }
};
