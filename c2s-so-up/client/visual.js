var socket = io('http://xx.xx.xx.xx:8891');
var str = "";
socket.on('data', function (data) {
    str+= "<div class=\"logline\">"+data.data+"</div>";
    document.getElementById("content").innerHTML=str;
    if(data.data)
    {
       e = document.getElementById("content")   
       e.scrollTop = e.scrollHeight;
    }
});

