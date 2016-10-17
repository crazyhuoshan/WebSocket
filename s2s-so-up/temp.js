var io = require('socket.io').listen(8877);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs'),
spawn = require('child_process').spawn;

io.on('connection', function(socket) {
  var filename = "/var/www/uploadfiles/";
  //var filename = "";
  ss(socket).on('file', function(stream, data) {
    filename = filename + path.basename(data.name);
    var upfile = path.basename(data.name);
    var writeStream = fs.createWriteStream(filename);
    stream.pipe(writeStream);
    writeStream.on('close',function(obj){
      fs.exists(filename, (exists) => {
       if(exists)
       {
         ss(socket).emit("data",{data:true})
        run_cmd(upfile)
       }
       else
       {
         ss(socket).emit("data",{data:"服务器文件未生成！"})         
       }
    })
    });
    writeStream.on("error",function(err)
    {
      ss(socket).emit("data",{data:err})
    })
  });
});

var run_cmd = function(file) {
  return new Promise(function(resolve,reject){
     var action = './unzip.sh',
     child = spawn('sh', [action,file]);
    var resp = '';
    child.stdout.on('data', function(buffer) {
        resp += buffer.toString()
    })
    child.stdout.on('end', function() {
        resolve(resp)
    })
    child.stdout.on('error',function(){
        reject('error')
    })
  })
}
