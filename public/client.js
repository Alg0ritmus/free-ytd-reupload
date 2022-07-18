
var AJAXstate=1;
var Ajax_interval;
InfoAJAX=()=>{ 
if(AJAXstate===4){
    //refresh page
    console.log('reloading..');
    //window.location.reload(true);


}
else{
//document.getElementById('download-btn').disabled = true;
var d = new Date();
var n = String(d.getTime());
var r= String(Math.round(Math.random()*1000));
var sessionId = n+r;
Progress(sessionId);
}

}



Progress=(sessionID)=>{
const xhttp = new XMLHttpRequest();
var URL = 'http://192.168.1.183:8000/public/'+'status/'+sessionID+'.txt'; 

xhttp.open('GET', URL)

/*
xhr_send_session.open("POST", "public/testik.txt", true);
xhr_send_session.setRequestHeader("Content-type", "text/plain"); 
https://en.wikipedia.org/wiki/Comet_(programming)
*/

xhttp.onload = function() {
    if(this.status === 200){
        console.log(this.responseText,"dorazilo");
        document.getElementById("progress").innerHTML = this.responseText;
        
        if(this.status === 200 && this.responseText==="Preparing to download..."){
        console.log(this.responseText,"dorazilo prep");
        document.getElementById("progress").innerHTML = this.responseText;
        //document.getElementById('download-btn').disabled = false;
        Progress(sessionID);
        }
        else if(this.responseText==="downloaded"){
        console.log(this.responseText,"dorazilo down");
        document.getElementById("progress").innerHTML = this.responseText;
        document.getElementById("refresh-btn").style.display="block"
        document.getElementById("download-btn").style.display="none"
        document.getElementById("urlinput").value="";
        AJAXstate=1;
        //setInterval(location.reload(),5000);
        
        }
        
    }
    
    else if (this.status === 404){
        console.log("404");
    }
    else{
        console.log("error?");
    }
    
    //document.getElementById("progress").innerHTML = this.responseText;


    }
xhttp.setRequestHeader("Content-type", "text/plain"); 

xhttp.send();
console.log("sended..");

}

