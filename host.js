
var path = require('path');
var app = require('express')();
var ws = require('express-ws')(app);
var fs = require('fs');
var wsController = require('./ws-controller/ws-controller');
app.get('/', (s, res) => {
  res.sendFile(path.join(__dirname, '/ClientSide/client.html'));
});
app.get('/ClientSide/client.css', (s, res) => {
  res.sendFile(path.join(__dirname, '/ClientSide/client.css'));
});
app.get('/ClientSide/client.js', (s, res) => {
  res.sendFile(path.join(__dirname, '/ClientSide/client.js'));
});
app.get('/ClientSide/game.css', (s, res) => {
  res.sendFile(path.join(__dirname, '/ClientSide/game.css'));
});
app.ws('/', wsController);



 app.listen(8080, () => console.error('Listening on http://localhost:8080'));
 


