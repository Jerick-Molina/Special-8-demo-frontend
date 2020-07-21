
const socket = new WebSocket('ws://192.168.1.192:8080');
var username ;
var roomCode ;
function heartbeat(){
    this.isAlive = true;
}

var maincontent = document.getElementById('main')
var signIn = document.getElementById('signIn-content')
var waitingLobby = document.getElementById('lobbyWait')
var gameLobby = document.getElementById('gameStart')
var button = document.getElementById("loginbutton");
var startButton ;
var cwaitingLobby = waitingLobby.cloneNode(waitingLobby);
var cgameLobby = gameLobby.cloneNode(gameLobby);

waitingLobby.remove();
gameLobby.remove();

button.onclick = function(){sendData()}; 
// Send Data
function sendData(){
  username =document.getElementById('username').value;
  roomCode = document.getElementById("roomNumber").value;
   
    var message = {
        method: "connectClient",
        roomCode: roomCode.toUpperCase(),
        params : {
            username: username
        }
    }
    
    socket.send(JSON.stringify(message));
    
}
if(startButton != null){
startButton.onclick = function(){StartGame()};
}else{
    console.log("not connected");
}
function StartGame(){
    alert("Yes?");
    var message = {
        method: 'gameready'
    }
    
   socket.send(JSON.stringify(message));
}

// Recive Data
window.send = (data) => {
socket.send(JSON.stringify(data))
}
socket.onmessage = (event) =>{
   
 var returnMessage = JSON.parse(event.data)
 var signIn = document.getElementById('signIn-content')
switch(returnMessage.method){
    
    case 'lostconnection':
alert("Host has lost connection to room");
    break;
    case "error": 
    alert("room code doesnt exist!"); 
    
    break;

    case "connected":
    maincontent.replaceWith(cwaitingLobby);
   
    var name = document.getElementById('headertitle');
    console.log(returnMessage.username);
    name.innerHTML = returnMessage.username;
    startButton = document.getElementById("startButton");
    break;
    case "firstplayer":
        console.log("Yours the first person to join!");
        var textDisplay = document.getElementById('waitTitle');
        
        textDisplay.innerHTML = "Wait until there's enough players to play!"
        
    break;
    case "startgamebutton":
        
       
        startButton.innerHTML = "Start Game!"
        startButton.style.display = "block"
        var startButton = document.getElementById('startButton');
    break;
    case"startgame":
    maincontent.replaceWith(cgameLobby);
    break;
    case "newcard":
     
        //Creating elemts
        var cardHolder =document.createElement('div');
        var cardImage = document.createElement('img')
        var cardColor = document.createElement('p');
        var cardValue = document.createElement('p')
//setting the parent
        document.getElementById("cardshand").appendChild(cardHolder).appendChild(cardImage);
        cardHolder.appendChild(cardColor);
        cardHolder.appendChild(cardValue)
        cardHolder.setAttribute('id', "Card");
        

//setting the value
        
        cardImage.setAttribute('src', "data:image/png;base64, " +returnMessage.data);
        cardColor.innerHTML = returnMessage.cardcolor;
        cardValue.innerHTML = returnMessage.cardvalue;
    break;
    //when host says game is starting!
    case"startgame":
    maincontent.replaceWith(cgameLobby);
    break;
    case "colorreceived":
        alert(returnMessage.playerColor)
        switch(returnMessage.playerColor){
                case 'Red':
                document.getElementById("header").style.backgroundColor = "#F25050";
                document.getElementById("gamescreen").style.backgroundColor = "#D94848";
                break;
                case 'Blue':
                document.getElementById("header").style.backgroundColor = "#0433BF";
                document.getElementById("gamescreen").style.backgroundColor = "#053DE6";
                break;
                case 'LightBlue':
                document.getElementById("header").style.backgroundColor = "#30BAD9";
                document.getElementById("gamescreen").style.backgroundColor = "#2AA4BF";
                break;
                case 'Pink':
                    document.getElementById("header").style.backgroundColor = "#F28599";
                    document.getElementById("gamescreen").style.backgroundColor = "#D97789";
                break;
                case 'Maroon':
                    document.getElementById("header").style.backgroundColor = "#5A232D";
                    document.getElementById("gamescreen").style.backgroundColor = "#A64153";
                break;
                case 'White':
                    document.getElementById("header").style.backgroundColor = "#30BAD9";
                    document.getElementById("gamescreen").style.backgroundColor = "#2AA4BF";
                break;
                case 'Purple':
                    document.getElementById("header").style.backgroundColor = "#553285";
                    document.getElementById("gamescreen").style.backgroundColor = "#854FD1";
                break;
                case 'Green':
                    document.getElementById("header").style.backgroundColor = "#669438";
                    document.getElementById("gamescreen").style.backgroundColor = "#80BA47";
                break;
        }
   break;
        
}
};