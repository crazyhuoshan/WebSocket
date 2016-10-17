document.addEventListener("DOMContentLoaded", function(){

    // Initialize instances:
    var socket = io.connect("http://xxx.xxx.xx.xx:5556");
    var siofu = new SocketIOFileUpload(socket);
    
    // Configure the three ways that SocketIOFileUpload can read files:
    document.getElementById("upload_btn").addEventListener("click", siofu.prompt, false);
    siofu.listenOnInput(document.getElementById("upload_input"));
    siofu.listenOnDrop(document.getElementById("file_drop"));

    // Do something on upload progress:
    siofu.addEventListener("progress", function(event){
        var percent = event.bytesLoaded / event.file.size * 100;
        console.log("File is", percent.toFixed(2), "percent loaded");
        progressbar(percent/100);
    });

    // Do something when a file is uploaded:
    siofu.addEventListener("complete", function(event){
        console.log(event.success);
        console.log(event.file);
    });

    document.getElementById("cpfile").addEventListener("click",function(event) {
        var url = document.getElementById("urlpath").value;
        socket.emit("filepath",{Url:url});
        alert("复制成功！");
    });
    
}, false);

var progressbar = function(percent) {
    document.getElementById("bar").style.width=300*percent+'px';
}