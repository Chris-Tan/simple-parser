'use strict';

// Initial Setup
var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

// Routes
const routes = require('./routes/index');
const api = require('./routes/api');

app.use('/', routes);
app.use('/api', api);

server.listen(app.get('port'), function(err) {
  if (err) {
    console.error("Something went wrong! Error: " + err.message);
  } else {
    console.info('Express server listening on port ' + server.address().port);
  }
});