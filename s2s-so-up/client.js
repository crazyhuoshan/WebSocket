var fs = require('fs');
var io = require('socket.io-client');
var ss = require('socket.io-stream');

var socket = io.connect('http://xx.xx.xx.xx:8877');
var stream = ss.createStream();
var filename = 'client.js';
var filepath = './client.js';

ss(socket).emit('file', stream, {name: "test"});
fs.createReadStream(filepath).pipe(stream);

// ss(socket).on('file', function(stream) {
//   fs.createReadStream('./client.js').pipe(stream);
// });