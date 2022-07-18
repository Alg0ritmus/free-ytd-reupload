const fs = require('fs');
const path = require('path');
var index=0;


module.exports = {

    checkFile: checkFile = (req, res) =>{
        var downloadMSG = require('./download');
        if (downloadMSG.msg==='done'){
            downloadMSG.msg="Preparing to download...";
            //clearInterval(myInterval);
            
        }
    
        var file = fs.access(__dirname+String(req.url), fs.F_OK, (err) => {
            if(err){
                
                if (err.code === 'ENOENT'){
                    //console.log('vytvaram file');
                    //Ak subor neexistuje tak ho vytvor
                    var writeFile=fs.createWriteStream(__dirname+String(req.url));
                    writeFile.write(downloadMSG.msg);
                    writeFile.close();
                    res.writeHead(200, {
                        'Content-Type'   : 'text/plain',
                        'Access-Control-Allow-Origin' : '*'
                        });
                    
                    res.end(downloadMSG.msg);
                    //console.log('downloadMSG.msg was written');

        
                }
                else{//zapis update
                    
                    console.error('unknown error occured with reading file!');
                    //console.log(err);
                }
            }
             //end of asking for file
            // subor nema err / existuje
            else{
                if(downloadMSG.msg !== 'downloaded'){
                    index+=1;
                    //console.log("interval cycle: ",index);
                    var myInterval=setTimeout(checkFile,10000,req,res);
                    

                }
                //console.log("AJAX: else");
                else if(downloadMSG.msg === 'downloaded'){
                    //console.log("cleared Interval");
                    res.writeHead(200, {
                        'Content-Type'   : 'text/plain',
                        'Access-Control-Allow-Origin' : '*'
                        });
                    try{
                       res.end('downloaded');//error niekde som to uz zavrel
                       //console.log('downloadMSG.msg was written 2');
                       downloadMSG.msg='done';
                    }
                    catch(err){
                        console.log("downloaded LPAJAX: error");
                    }
                    
                    
                    fs.unlink(__dirname+String(req.url),(err)=>{
                        if(err){ 
                            
                            console.log("unlink LPAJAX: error");
                        }
                        else{
                            console.log("unlinked\n\n\n\n");

                            //clearInterval(myInterval);
                            return;
                            
                        }
                        
                    });
                    
                    

                }
                /* console.log("writefile",this,typeof(file)); */
                
                
                
            }
            
            
        });
       
        

        //https://www.esparkinfo.com/node-js-long-polling.html
        
        
        
    }
    

}
