'use strict';
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan'); // formerly express.logger
var errorhandler = require('errorhandler');
var app = express();
// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
// express/connect middleware
app.use(favicon(__dirname + '/favicon.ico'));
app.use(morgan('dev'));
// serve up static assets
app.use(express.static(path.join(__dirname, '')));
 
var server  = require('http').createServer(app);
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
  socket.on('flip', function(msg){
    io.emit('flip', msg);
  });
  socket.on('unflip', function(msg){
    io.emit('unflip', msg);
  });
  socket.on('playerHasWon', function(msg){
    io.emit('playerHasWon', msg);
  });
});

server.listen(app.get('port'), function(){
  console.log('listening on *:4000');
});
