
var isPlayerturn = false;

const socket = new WebSocket('ws://192.168.1.192:8080');
var username ;
var roomCode ;
function heartbeat(){
    this.isAlive = true;
}
var cardHeight;
var maincontent = document.getElementById('main')
var signIn = document.getElementById('signIn-content')
var waitingLobby = document.getElementById('lobbyWait')
var gameLobby = document.getElementById('gameStart')
var button = document.getElementById("loginbutton");
var getcard;
var startButton;
var cwaitingLobby = waitingLobby.cloneNode(waitingLobby);
var cgameLobby = gameLobby.cloneNode(gameLobby);
var cards;


var currentCardColor;
var currentCardId;
waitingLobby.remove();
gameLobby.remove();

var cardHolder;

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
    maincontent.firstElementChild.replaceWith(cwaitingLobby);
   
    var name = document.getElementById('headertitle');
    console.log(returnMessage.username);
    name.innerHTML = returnMessage.username;

    
    break;
    case "firstplayer":
        console.log("Yours the first person to join!");
        var textDisplay = document.getElementById('waitTitle');
        var parent = document.getElementById("lobbyWait")
        startButton = document.createElement('button');
        startButton.setAttribute('id', "startButton");
        parent.appendChild(startButton);
        textDisplay.innerHTML = "Wait until there's enough players to play!"
        
    break;
    case "startgamebutton":
        
      
        startButton.innerHTML = "Start Game!"
        startButton.style.display = "block"

    break;
    case "YourTurn":
    if(isPlayerturn == false){
        isPlayerturn = true;
        console.log(isPlayerturn);
    };
break;
    // fix main content
    case"startgame":
    console.log("starting game")
    maincontent.firstElementChild.replaceWith(cgameLobby);
    cgameLobby.style.display = "block"
    cards = document.querySelectorAll("#Card");
    getcard = document.createElement('button');
    getcard.setAttribute('getcard');
    cgameLobby.appendChild(getcard);

        break;
    case "newcard":
     
        //Creating elemts
        var cardHolder =document.createElement('div');
        var cardImage = document.createElement('img')
        var cardColor = document.createElement('p');
        var cardValue = document.createElement('p');
        var isPicked = document.createElement('p');
//setting the parent

        document.getElementById("cardshand").appendChild(cardHolder).appendChild(cardImage);
        cardHolder.appendChild(cardColor);
        cardHolder.appendChild(cardValue)
        cardHolder.appendChild(isPicked);
        cardHolder.setAttribute('id', "Card");
        
    
//setting the value
        
        cardImage.setAttribute('src', "data:image/png;base64, " +returnMessage.data);
        cardColor.innerHTML = returnMessage.cardcolor;
        cardValue.innerHTML = returnMessage.cardvalue;
        isPicked.innerHTML = "false";
        cards = document.querySelectorAll("#Card");
        cardHeight = cardHolder.offsetHeight;
        cardHolder.style.paddingTop = `${cardHeight / 3}px`;
    break;
    //when host says game is starting!
  
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
        case "currentCard":
            currentCardColor = returnMessage.color;
            currentCardId = returnMessage.cardId;

            console.log(currentCardColor);
            console.log(currentCardId);
        break;
    }
    if(startButton !=null){
    startButton.onclick = function(){StartGame()};
    }

    function StartGame(){
    
    var message = {
        method: 'gameready'
    }
    
   socket.send(JSON.stringify(message));
}
if(cards != null) {
cards.forEach(card => {
    card.onclick = function(){
        
        // if true and is this color or number or black or if it isnt your turn
        if(card.children[3].innerHTML == "true" && isPlayerturn == true && card.children[1].innerHTML == currentCardColor || card.children[2].innerHTML == currentCardId){

            var cardProperties = {
                method: "placedcard",
                username: username,
                 cardcolor: card.children[1].innerHTML ,
                cardId: card.children[2].innerHTML

            }
                socket.send(JSON.stringify(cardProperties));
                console.log(JSON.stringify(cardProperties));
            card.remove();
            //send chosen card
            isPlayerturn = false;
            console.log(isPlayerturn);
        }else{
            
            card.removeAttribute("style");
        }
        cards.forEach(clickedCard =>{
            if(clickedCard == card){
                 if(card.children[3].innerHTML == "false"){
                
                card.removeAttribute("style");

                 }else{
                }
                card.children[3].innerHTML = "true"
            }else{
                var heightOfCard = card.offsetHeight;
                 
                var fixed  = heightOfCard / 3
                if( clickedCard.style.paddingTop != `${fixed.toFixed(3)}px`){
               
                    clickedCard.style.paddingTop = `${cardHeight / 3}px`;
                
                }else{
                    
                }
               
                
                clickedCard.children[3].innerHTML = "false";
            }
        })
        
        
    }
});
}
 function allfalse(){
     cards.forEach(card =>{
         card.children[3].innerHTML = "false";
     })
 }
};
