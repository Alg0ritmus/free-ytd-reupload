const http = require('http');
const fs = require('fs');
const path = require('path');
var LPAjax = require('./LongPollAJAX');



module.exports = {
Route: ((req,res)=>{
    let contentType= 'text/html';
    var myPath = path.join(__dirname,"public",req.url === '/' ? "index.html" : req.url);
    let extname = path.extname(myPath);
    
    switch(extname){
        case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".svg":
        contentType = "image/svg+xml";
    }
    //console.log("myPath",myPath);
    fs.readFile(myPath,(err,content)=>{
        if (err){
          
          if (err.code == 'ENOENT'){
            if((req.url.includes("status") && req.method==='GET')){
              //console.log("ReoutingAJAX");
              LPAjax.checkFile(req,res);
              
            }
            else{
              res.writeHead(404,{'Content-Type':'text/html'});
              res.end('Page not found!')
            }
          }
          else {
            //  Some server error
              res.writeHead(500);
              res.end(`Server Error: ${err.code}`);
            
          }
        }
        else{
          //AJAX file
          if((req.url.includes("status") && req.method==='GET')){
            //console.log("ReoutingAJAX2");
            LPAjax.checkFile(req,res);
          }
          else{
            //console.log("vsetko fajn");
            res.writeHead(200,{'Content-Type':contentType});
            res.end(content,"utf8");
            
          }
        }
        
    });
    

})


};



  
