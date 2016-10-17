var fs = require('fs'),
    io = require('socket.io-client'),
    util = require('util'),
    events = require('events'),
    ss = require('socket.io-stream');
    
    var SocketUpFile = function (pathcfg,callback){
        //var socket = io.connect(pathcfg.socketip),
        var socket = io.connect("http://xx.xx.xx.xx:8878"),
        stream = ss.createStream();
        ss(socket).emit('file', stream, {name: pathcfg.filename});
        fs.createReadStream(pathcfg.filepath).pipe(stream);
        ss(socket).on("data",function(data){
              callback&&callback(data.data);
        })
    }

util.inherits(SocketUpFile, events.EventEmitter);

module.exports = SocketUpFile;