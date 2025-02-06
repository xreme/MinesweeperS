import { startVSGame } from "./game-manager.js";
const playerName = sessionStorage.getItem('playerName') || 'Unknown'
const iceConfig = {
    config: {
        iceServers: [
            {
              urls: "turn:global.relay.metered.ca:80",
              username: "",
              credential: "",
            },
        ],
    },
    debug: 3,
    secure: true
};
function getPeerConfig() {
    try {
        const turnConfig = JSON.parse(localStorage.getItem('turnConfig'));
        if (turnConfig && turnConfig.username && turnConfig.password) {
            iceConfig.config.iceServers[0].username = turnConfig.username;
            iceConfig.config.iceServers[0].credential = turnConfig.password;
            
            console.log('Using custom ICE configuration with TURN');
            return iceConfig;
        }
    } catch (error) {
        console.error('Error parsing TURN config:', error);
    }
    console.log('Using default STUN-only configuration');
    return null;
}

const config = getPeerConfig() || null
console.log(config)
const clientPeer = config ? new Peer(config): new Peer()
console.log(clientPeer)

//const clientPeer = new Peer();
let activeConnection;
var hostInfo = null;
const hostId = sessionStorage.getItem('roomCode');
const sendBtn = document.getElementById("sendChat")

clientPeer.on('error', (err) => {
    console.error('Peer connection error:', err);
    if (err.type === 'peer-unavailable') {
       alert('Unable to connect to host. Please check room code.');
        setTimeout(() => {
            sessionStorage.removeItem('roomCode');
            window.location.href = '../join-room/join-room.html';
        }, 3000);
    }
});

clientPeer.on('open', (id) => {
    console.log(`Client ready. ID: ${id}`);
    connectToHost();
});
clientPeer.on('icecandidate', (candidate) => {
    console.log('ICE Candidate:', candidate);
});
clientPeer.on('error', (err) => {
    console.error('Peer error:', err);
});
function sendDetails(){
    let info = {name:playerName} 
    let data = {header:"userInfo",body:info}
    let obj = JSON.stringify(data)
    activeConnection.send(obj)
}
function sendChat(message){
    let data = {header:"chatMessage",body:message}
    let obj = JSON.stringify(data)
    activeConnection.send(obj)
}
export function sendData(obj){
    let data = JSON.stringify(obj)
    activeConnection.send(data)
}
function handleData(data){
    console.log("data:", data)
    try{
        var obj = JSON.parse(data)
    }
    catch(err){
        console.log(err);
        return;
    }
    switch(obj.header){
        case 'hostInfo':
            hostInfo = obj;
            displayHostInfo();
            break;
        case 'chatMessage':
            handleChat(obj.body);
            break;
        case 'startGame':
            handleGameStart(obj.body)
            break;
        default:
            console.log("Uknown Header:", data)
    }
}
function displayHostInfo(){
    console.log("got host info", hostInfo)
    let roomLbl = document.getElementById("roomDisplay");
    let hostName = hostInfo.body.name

    roomLbl.textContent = `${hostName}'s Room`

}
function handleChat(data){
    appendMessage(data.from, data.messageContent)
}
function handleGameStart(obj){
    console.log(obj)

    switch(obj.gamemode){
        case "VS":
            startVSGame(obj.gameInstance);
            break;
        default:
            console.log("unknown mode")
    }
}
function connectToHost() {
    if (!hostId) {
        console.error('No host ID found');
        return;
    }

    const connection = clientPeer.connect(hostId);

    connection.on('open', () => {
        console.log('Connected to host');
        activeConnection = connection;
        sendDetails(); 
        
        connection.on('data', (data) => {
            handleData(data);
        });
    });

    connection.on('error', (err) => {
        console.error('Connection error:', err);
    });

    connection.on('close', () => {
        console.log('Connection closed');
        activeConnection = null;
        setTimeout(connectToHost, 5000); // Attempt reconnection
    });
}
function appendMessage(sender,message){
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    const contentElement = document.createElement('p')
    const senderElement = document.createElement('p')
    
    messageElement.className = 'message';
    senderElement.className = 'sender';
    contentElement.className = 'content';

    contentElement.textContent = message;
    senderElement.textContent = `${sender}:`;
    
    messageElement.appendChild(senderElement);
    messageElement.appendChild(contentElement);
    messageContainer.appendChild(messageElement);

    messageContainer.scrollTop = messageContainer.scrollHeight;
}
document.addEventListener('DOMContentLoaded', () => {
    sendBtn.addEventListener('click', () => {
        if (!activeConnection) {
            console.log('Not connected to host');
            return;
        }
        const message = document.getElementById('message-input').value;
        //activeConnection.send(message);
        sendChat(message)
        document.getElementById('message-input').value = '';
    });

    window.addEventListener('keypress', (e)=>{
        if (e.key === 'Enter'){
            const message = document.getElementById('message-input').value;
            sendChat(message)
            document.getElementById('message-input').value = ''; 
        }
    })
});