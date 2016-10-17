var fs = require('fs'),
    http = require('http')
   var readerStream  = fs.createReadStream('./style.css');
   readerStream.on('data',function(data){
       console.log(data.toString())
   })