// Require the libraries:
var SocketIOFileUpload = require('socketio-file-upload'),
    socketio = require('socket.io'),
    express = require('express'),
    spawn = require('child_process').spawn;
// Make your Express server:
var app = express()
    .use(SocketIOFileUpload.router)
    .use(express.static(__dirname + "/public"))
    .listen(5556);

// Start up Socket.IO:
var io = socketio.listen(app);
io.sockets.on("connection", function(socket){

    // Make an instance of SocketIOFileUpload and listen on this socket:
    var uploader = new SocketIOFileUpload();
    uploader.dir = "/var/www/uploadfiles";
    uploader.listen(socket);

    // Do something when a file is saved:
    uploader.on("saved", function(event){
        console.log(event.file);
        if(/.zip$/.test(event.file.name))
        {
            run_cmd(event.file,"file")
        }
    });

    // Error handler:
    uploader.on("error", function(event){
        console.log("Error from uploader", event)
    });

    socket.on("filepath",function(data){
         var reg = /.*\/([^\.\/]+)/g   //文件名
         var reg2 = /(http:\/\/).*(\/dujia)/g  //文件路径
         var url = data.Url
         data.filename = url.replace(reg,"$1")
         data.filepath = url.replace(reg2,"").replace(data.filename,"")
         run_cmd(data,"path")
    })
});





var run_cmd = function(file,type) {
  return new Promise(function(resolve,reject){
    if(type == "file")
    {
     var action = './unzip.sh',
     child = spawn('sh', [action,file.name]);
    }
    else if(type =="path")
    {
        var action = "./downfile.sh",
        child = spawn('sh', [action,file.Url,file.filename,file.filepath]);
    }
    var resp = '';
    child.stdout.on('data', function(buffer) {
        resp += buffer.toString()
        io.emit('data',{data:buffer.toString()})
    })
    child.stdout.on('end', function() {
        resolve(resp)
        
    })
    child.stdout.on('error',function(){
        reject('error')
    })
  })
}