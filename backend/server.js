const http = require('http');
const app = require('./app');

// renvoie un port valide qu'il soit sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
  // convertit la valeur en nombre entier
  const port = parseInt(val, 10);

  // si la valeur n'est pas un nombre, la fonction renvoie la valeur telle quelle
  if (isNaN(port)) {
    return val;
  }
  // si le port est un nombre entier positif, la fonction renvoie ce nombre
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '4000');
// configure l'application express pour utiliser ce port
app.set('port', port);

// recherche les différentes erreures et les gère de manière appropriées
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// création du serveur HTTP
const server = http.createServer(app);

// gestion des erreurs
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// démarre le serveur et "écoute" les connexions sur le port spécifié
server.listen(port);
