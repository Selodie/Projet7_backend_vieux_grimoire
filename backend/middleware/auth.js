const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // on récupère le token, il est extrait du header dela requpete entrante
    // utilisation de la fonction split pour tout récupérer après l'espace dans le header
    const token = req.headers.authorization.split('')[1];
    //  on décode le token
    const decodedToken = jwt.verify(token, 'RADOM_TOKEN_SECRET');
    const { userId } = decodedToken;
    req.auth = {
      userId,
    };
  } catch (error) {
    res.status(401).json({ error });
  }
};
