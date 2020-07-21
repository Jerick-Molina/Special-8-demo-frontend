
var fs = require('fs');
var path = require('path');
const users = [];
const host =[];


function heartbeat(){
    this.isAlive = true;
    console.log("hello!")
}



const send = (ws,data) => {
 const d = JSON.stringify({
    jsonrpc: '2.0',
    ...data
 });
 ws.send(d);
}

const doesLobbyExist = (roomCode) => {
    let doesNotExist = true;
    for (let i=0; i<host.length; i++){
            if(roomCode.toUpperCase() == host[i].roomCode){

                doesNotExist = false;
                break;
            }else{
                doesNotExist = true;
            }
    }
  
    return doesNotExist;
}
 const isUsernameTaken = (username,roomCode) => {
     let taken = false;
     for (let i=0; i<users.length; i++){
         if(users[i].username === username && users[i].roomCode.toUpperCase() === roomCode){
             taken = true;
             break;
         }
     }
     host.forEach( hostes =>{
        if(roomCode.toUpperCase() == hostes.roomCode){
        hostes.currentPlayers.forEach(user =>{
         if(username == user.username){
            return;
         }   
        })
        }
    })
     return taken;
 }
 const isgameIdTaken = (roomCode) => {
    let idTaken = false;
    for (let i=0; i<host.length; i++){
        if(host[i].roomCode === roomCode){
            idTaken = true;
            break;
        }
    }
    return idTaken;
}



module.exports = (ws, req) =>{
  /*  var readStream = fs.readFileSync(path.resolve(__dirname,`../ClientSide/CardImages/Blue/Blue_2.png`));
    send(ws, {method:"newcard", data: readStream.toString('base64'), cardcolor: "Blue", cardvalue: 2}); 
    var readStream = fs.readFileSync(path.resolve(__dirname,`../ClientSide/CardImages/Red/Red_5.png`));
    send(ws, {method:"newcard", data: readStream.toString('base64'), cardcolor: "Red", cardvalue:5});
    send(ws, {method:"newcard", data: readStream.toString('base64'), cardcolor: "Red", cardvalue:5});
    send(ws, {method:"newcard", data: readStream.toString('base64'), cardcolor: "Red", cardvalue:5}); */
   ws.on('close', function closed() {
//checks if its the host who disconnects    
    host.forEach( hostes =>{
        if(hostes.ws == ws){
            if(hostes.roomCode == hostes.roomCode){
        var number = host.indexOf(hostes);
        
        hostes.currentPlayers.forEach(user =>{
         send(user.ws, {method:"lostconnection"})
        })
        host.splice(number, 1);
        console.log("Host has lost connection!")
        }
    }
    })
   })
    
    
    ws.on('message', (msg) =>{
        // Host/ServerSide
        const data = JSON.parse(msg);
        switch(data.method){
            case "createhost":
                // creates host game
                if(isgameIdTaken(data.roomCode)){
                    send(ws,{roomCode : data.roomCode, error: {message: '427'}})
                }else{
                    host.push({ 
                        ws: ws,
                        roomCode: data.roomCode,
                        maxPlayers: data.params.maxPlayers,
                        currentPlayers: [],
                    });
                    
                    send(ws, { result: {status: `Success you are now a Host! of ${data.roomCode}`, code: data.roomCode}});
                    
                }
                break;
        }
        
        //Client -> Host (connection)
        switch(data.method){
            case "clientReconnect":{

            }
            case "connectClient":  
            // Connecting to Host
            if(doesLobbyExist(data.roomCode)){
               
                send(ws,{ method:"error" })
            }else  if(isUsernameTaken(data.params.username,data.roomCode)){
                    send(ws, {method: "error"});
                }else{
                    //creates client to certain roomCode
                 host.forEach(  hostes => {
                     if(data.roomCode.toUpperCase() == hostes.roomCode){
                         hostes.currentPlayers.push({
                            ws: ws,
                            roomCode: data.roomCode.toUpperCase(),
                            username: data.params.username,
                         })
                     }
                 })
                    send(ws, { method:"connected", username: data.params.username })

                        host.forEach(gameHost =>{
                            if(data.roomCode == gameHost.roomCode){
                                send(gameHost.ws ,{method:"Connected",username: data.params.username, roomCode: data.roomCode});
                            }
                        })
                }
                break;
              case "gameready":
                  console.log("StartGame");
                host.forEach(gameHost =>{
                    
                        send(gameHost.ws ,{method:"gameready"});
                    
                })
              break;
            } 
        //game -> client (on connection success methods) 
        switch(data.method){
            case "firstplayer":
                    
                host.forEach( hostes =>{
                    if(data.roomCode == hostes.roomCode){
                    hostes.currentPlayers.forEach(user =>{
                     if(data.username == user.username){
                         send(user.ws, {method: "firstplayer"})
                     }   
                    })
                    }
                })

            break;
            case "getcolor":

                host.forEach( hostes =>{
                    if(data.roomCode == hostes.roomCode){
                    hostes.currentPlayers.forEach(user =>{
                     if(data.username == user.username){
                         send(user.ws, {method: "colorreceived", playerColor: data.color})
                     }   
                    })
                    }
                })
            
            break;
            //g
            case "startgamebutton":
                
                host.forEach( hostes =>{
                    if(data.roomCode == hostes.roomCode){
                    hostes.currentPlayers.forEach(user =>{
                     if(data.username == user.username){
                         send(user.ws, {method: "startgamebutton"})
                     }   
                    })
                    }
                })
            
            break;
            case "startgame":
                
            host.forEach( hostes =>{
                
                hostes.currentPlayers.forEach(user =>{
                
                     send(user.ws, {method: "startgame"})
                 
                })
                
            })
        
        break;
            case "newcard":host.forEach( hostes =>{
                if(data.roomCode == hostes.roomCode){
                hostes.currentPlayers.forEach(user =>{
                 if(data.username == user.username){
                    var readStream = fs.readFileSync(path.resolve(__dirname,`../ClientSide/CardImages/${data.params.Color}/${data.params.Color}_${data.params.Number}.png`));
                    send(user.ws, {method:"newcard", data: readStream.toString('base64'), cardcolor: data.params.Color, cardvalue: data.params.Number});
                 }   
                })
                }
            })
               
             break;
        }
        //Client -> Host game Methods
        switch(data.method){

            case   "placedcard" : 

            console.log(data.method, data.username, data.cardcolor,  data.cardId )
            host.forEach(currectHost =>{
            send(currectHost.ws, {method: data.method, username: data.username,cardcolor: data.cardcolor, cardId: data.cardId })

            })


            break;
            case   "getcard" : 
            break;

            
           
        }

        //Host -> Clients game methods
        switch(data.method){

            case   "YourTurn" :
                host.forEach( hostes =>{
                
                    hostes.currentPlayers.forEach(user =>{

                       
                       
                     if(user.username == data.username){
                        
                         send(user.ws, {method: data.method})
                     }

                    })
                    
                })
            
            break;
            case   "currentCard" : 
            host.forEach( hostes =>{
                
                hostes.currentPlayers.forEach(user =>{

                    
                    send(user.ws, {method: "currentCard", color: data.color, cardId: data.cardId});
                
                })
                
            })
            break;
            case   "" : 
            break;
            case   "" : 
            break;
            case   "" : 
            break;
        }


      });
      
     
      
}