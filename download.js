var https = require('https');
const fs = require("fs");
const ytdl = require("ytdl-core");
var http =require('http');
var qs= require('querystring');
const path =require('path');
const mime = require('mime');
//var converter = require('video-converter');
var FfmpegCommand = require('fluent-ffmpeg');

var RRoute = require('./routing');


var server;

var msg ="Preparing to download...";

server = http.createServer((req,res)=>{
    if (req.method==='POST'){
        var reqBody="";
        req.on("data",data=>{
            reqBody+=data;
            
        });
        req.on("end",err=>{
            if(err) throw err;
            
            
            var youtubeURLobj= qs.parse(reqBody);
            
            youtubeURL=String(youtubeURLobj.downloadURL);
            
            down(youtubeURL,res,ConvertToMP3);
            //console.log("downloading...");
            //console.log('download was written 1');
            
        });
    }
    else{
        RRoute.Route(req,res);

       
        //console.log(req);

            
    }

}).listen(process.env.PORT || 8000, console.log("server is running...",process.env.PORT || 8000 ));





//download from YT function

down = async(url_d,response,ConvertToMP3)=>{
    if(!ytdl.validateURL(url_d)){
        console.log("bad URL")
    }
    else{
        let info = await ytdl.getInfo(url_d);
        //console.log(info);
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        //console.log(audioFormats);

        var file;
        //DOWNLOADING TO SERVER
        
        YTvidTitle=path.join(info.player_response.videoDetails.title.toString()+'.mp3');
        
        YTvidTitleId= String(Math.round(Math.random()*1000));
        var YTurl = path.join(__dirname,YTvidTitleId.toString()+'.mp4').replace("|","");
        file = fs.createWriteStream(YTurl);
        let downloaded = await https.get(audioFormats[0].url, function(res,err) { 
            if (err) throw err; 
            stream_=res.pipe(file);
            
            res.on("end",(err)=>{
                if (err) throw err;
                else{ 
                
                //console.log('download was written 2');
                
        

                
                
                }
            });
            stream_.on('finish', ()=>{
                ConvertToMP3(response,YTurl,YTvidTitle);
            });
            //console.log(downloaded);
            
        });
    } 
   
    
}

//upload to clients

uploadToClient = async (response,YTurl,YTtitle) => {

    var filePath = path.join(__dirname,YTurl);
    
    var filename = path.basename(filePath);
    console.log("filename: ",filename,"yturl: ",YTurl,"YTtitle: ",YTtitle);
    var mimetype = 'audio/mpeg';


  
    response.setHeader('Content-disposition', 'attachment; filename=' + YTtitle);
    response.setHeader('Content-type', mimetype);

    
    var readStream = await fs.createReadStream(path.join(__dirname,filename));
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(response);
    
    //AJAX MSG
    msg = "downloaded"
    module.exports.msg = msg;
    //console.log("!!success!!");
    
    //console.log("done!!!!");
    for (let i =3; i<5;i++){
        fs.unlink(path.join(filename.replace('mp3','mp'+String(i))), (err)=>{
            if(err) throw err;
        });
        

 
    }    
}


ConvertToMP3=(response,YTurl,YTvidTitle)=>{
    //CONVERT mp4 to mp3
    /* fs.chmod(YTurl,'777',()=>{
        converter.setFfmpegPath(path.join(__dirname,'/ffmpeg/bin/ffmpeg.exe'), function(err) {
            if (err) throw err;
        });

        converter.convert(YTurl, path.join(YTurl.replace('mp4','mp3')), function(err) {
            if (err) throw err;
            //console.log("coverted...done");
            // upload to client
            // response , 819.mp3 , title
            
            
            uploadToClient(response,path.join(YTurl.replace('mp4','mp3')),YTvidTitle);
        });
    }); */
    

    proc = new FfmpegCommand({source:YTurl});
    proc.setFfmpegPath(path.join(__dirname,'ffmpeg','bin','ffmpeg.exe'));

    proc.saveToFile(path.join(YTurl.replace('mp4','mp3')), (stdout, stderr)=>{
        if (stderr) throw stderr;
        
        
    });
    proc.on("end",()=>{
        
            console.log("converted");
            uploadToClient(response,path.join(YTurl.replace('mp4','mp3')),YTvidTitle);
        
    });

}

module.exports.msg = msg;
// https://www.codegrepper.com/code-examples/javascript/node+js+send+file+to+client