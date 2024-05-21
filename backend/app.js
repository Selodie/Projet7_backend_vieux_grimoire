const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// app.use('/api/books', (req, res, next) => {
//   res.status(200);
//   next();
// });

// app.use((req, res, next) => {
//   res.json({ message: 'Votre requête a bien été reçue !' }); 
//   next();
// });

app.post('/api/signup', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'objet créé !'
  });
});

app.get('/api/signup', (req, res, next) => {
  const user = [
    {
      email: 'test@gmail.com',
      password: '1234',
    }
  ];
  res.status(200).json(user);
});

module.exports = app;
