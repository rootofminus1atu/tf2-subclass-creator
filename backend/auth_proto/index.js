const express = require('express');
const cors = require('cors')
const app = express();
const { auth } = require('express-oauth2-jwt-bearer');

const port = process.env.PORT || 3000;

const jwtCheck = auth({
  audience: 'https://tf2scapi',
  issuerBaseURL: 'https://dev-fg28cspzvpoubaeb.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});


app.use(cors())

app.get('/ping', function (req, res) {
    res.send({ ping: 'pong' })
})

app.get('/authorized', jwtCheck, function (req, res) {
    res.json({ hi: "hi" });
});

app.get('/weapon/post', jwtCheck, function (req, res) {
  const userId = req.auth?.payload.sub
  console.log('uid', userId)
  res.json({ hi: "hi", userId: userId });
})


app.get('/api/v1/loadouts', function (req, res) {
  res.json({ hi: "can get" });
});

app.post('/api/v1/loadouts', jwtCheck, function (req, res) {
  res.json({ hi: "can post" });
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: "401 unauthorized" });
  } else {
    next(err);
  }
})

app.listen(port);

console.log('Running on port ', port);