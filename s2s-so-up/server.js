var io = require('socket.io').listen(8877);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs'),
spawn = require('child_process').spawn;

io.on('connection', function(socket) {
  var filepath = "/var/www/uploadfiles/";
  //var filepath = "";
  ss(socket).on('file', function(stream, data) {
    filepath = filepath + path.basename(data.name);
    var filename = path.basename(data.name);
    var writeStream = fs.createWriteStream(filepath);
    stream.pipe(writeStream);
    writeStream.on('close',function(obj){
      fs.exists(filepath, (exists) => {
       if(exists)
       {
         run_cmd(filename,function(data){
           if(data)
           {
             ss(socket).emit("data",{data:true})
           }
           else
           {
             ss(socket).emit("data",{data:"解压失败"})
           }
         })
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

var run_cmd = function(file,callback) {
  return new Promise(function(resolve,reject){
     var action = './unzip.sh',
     child = spawn('sh', [action,file]);
    var resp = '';
    child.stdout.on('data', function(buffer) {
        resp += buffer.toString()
        console.log(buffer.toString())
    })
    child.stdout.on('end', function() {
        resolve(resp)
        writeFiles(resp)
        callback&&callback(true)
    })
    child.stdout.on('error',function(){
        reject('error')
        callback&&callback(false)
    })
  })
}

var writeFiles = function(str){   
    var path = "../tchuplog/"
    //var path = "./"
    var dateday = new Date().toLocaleDateString().replace(/[^\d]/g,"")
    fs.exists(path+dateday, (exists) => {
       if(exists)
       {
           var date = new Date().toTimeString().replace(/[^\d]/g,"")
           var file = path+dateday+"/"+date+".txt"
           fs.writeFile(file, str, function(err){  
               if(err)  throw err;
               console.log("写入文件ok");  
            }); 
       }
       else
       {
            fs.mkdir(path+dateday,function(err){
                if(err) throw err;
                console.log("创建文件ok")
                var date = new Date().toLocaleTimeString().replace(/[^\d]/g,"")
                var file = path+dateday+"/"+date+".txt"
                fs.writeFile(file, str, function(err){  
                    if(err)  throw err;
                    console.log("写入文件ok");  
                });
            })
       }
    });
} 