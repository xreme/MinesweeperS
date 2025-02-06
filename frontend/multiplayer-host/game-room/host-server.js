const iceConfig = {
    config: {
        iceServers: [
            {
              urls: "turn:global.relay.metered.ca:80",
              username: "",
              credential: "",
            },
        ],
    }
};
const playerName = sessionStorage.getItem('playerName');
const roomCode = generateRoomCode()
const config = getPeerConfig() || null
const hostPeer = config ? new Peer(config): new Peer(roomCode)
const connections = new Map(); // Store client connections
const clientInfo = new Map();
var sendBtn = null;

function getPeerConfig() {
    try {
        const turnConfig = JSON.parse(localStorage.getItem('turnConfig'));
        if (turnConfig && turnConfig.username && turnConfig.password) {
            iceConfig.config.iceServers[0].username = turnConfig.username;
            iceConfig.config.iceServers[0].credential = turnConfig.password;
            
            console.log('Using custom ICE configuration with TURN');
            return {
                ...iceConfig,
                id: roomCode,
                debug: 3
            };
        }
    } catch (error) {
        console.error('Error parsing TURN config:', error);
    }
    console.log('Using default STUN-only configuration');
    return null;
}
function generateRoomCode() {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    //const randomDigits = 1000
    return `${randomDigits}`;
}

export function appendMessage(sender, message) {
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
hostPeer.on('open', (id) => {
    document.getElementById('host-id').textContent = id;
    console.log(`Host ready. ID: ${id}`);
});
function updateClientList() {
    const clientList = document.getElementById('client-list');
    const clientCount = document.getElementById('client-count');
    // clientList.innerHTML = '';
    // connections.forEach((conn, peerId) => {
    //     const li = document.createElement('li');
    //     li.textContent = peerId;
    //     clientList.appendChild(li);
    // });
    clientCount.textContent = connections.size;
}
// upon initial connection players should exchange information
function setUserInfo(peerID, data){
    clientInfo.set(peerID,data)
    
    let message = `${data.name} joined the room` 
    let serverMessage = {
        header:"chatMessage",
        body:{
            from: '[SERVER]',
            messageContent: message
        }
    }
    appendMessage('[SERVER]', message)
    broadcast(serverMessage)

}
function handleChat(peerID, message){
    let senderInfo = clientInfo.get(peerID) || 'unknown'
    let msg = `${message}`

    if(message){
        // send peers the message
        broadcast({
            header: 'chatMessage',
            body:{
                from:senderInfo.name,
                messageContent: message
            }
        })
        appendMessage(senderInfo.name,msg)
    }
}
function handleGameResult(peerId, data){
    //console.log(data)
    let msg = ''
    if(data.result == 'win'){
        let playerInfo = clientInfo.get(peerId)
        msg = `${playerInfo.name} finished in ${data.time}s`
    }
    else if (data.result == 'lost'){
        let playerInfo = clientInfo.get(peerId)
        msg = `${playerInfo.name} lost in ${data.time}s` 
    }
    broadcast({
        header:"chatMessage",
        body:{
            from:"[SERVER]",
            messageContent: `${msg}`
        }
    })
    appendMessage("[SERVER]", msg)
}
function initializeConnection(connection) {
    connection.on('open', () => {
        sendDetails(connection, {
            name: playerName,
            gridSize: sessionStorage.getItem('gridSize'),
            roomSize: sessionStorage.getItem('roomSize'),
            gameMode: sessionStorage.getItem('gameMode')
        });
    });
    
    connection.on('error', (error) => {
        console.error('Connection error:', error);
    });
}
function sendDetails(connection, details) {
    if (!connection || connection.open === false) {
        console.error('Connection not ready');
        return;
    }
    try {
        const data = {
            header: "hostInfo",
            body: details
        };
        const obj = JSON.stringify(data);
        //console.log('Sending details:', obj);
        connection.send(obj);
    } catch (error) {
        console.error('Error sending details:', error);
    }
}
function handleData(connection,data){
    try{
        var obj = JSON.parse(data)
    }
    catch(err){
        console.log(err);
        var obj = {header:"unknown"}
    }
    switch(obj.header){
        case 'userInfo':
            setUserInfo(connection.peer, obj.body);
            break;
        case 'chatMessage':
            handleChat(connection.peer, obj.body)
            break;
        case 'gameResult':
            handleGameResult(connection.peer, obj.body)
            break;
        default:
            connection.send("Unknown Command")
    }
}
export function broadcast(data){
    let obj = JSON.stringify(data)
    // Broadcast to all connected clients
    connections.forEach((conn) => {
        conn.send(obj);
    });
}
function sendChat(message){
    if(message){
        let data = {
            header:"chatMessage",
            body:{
                from:playerName,
                messageContent: message
            }
        }
        broadcast(data)
        appendMessage(playerName, message)
    }
}
document.addEventListener('DOMContentLoaded', () => {
    sendBtn = document.getElementById("sendChat")
    sendBtn.addEventListener('click', () => {
        const message = document.getElementById('message-input').value;
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

})
hostPeer.on('connection', (connection) => {
    console.log(`Attempted Connection: ${connection.peer}`);
    connections.set(connection.peer, connection);
   updateClientList();
    initializeConnection(connection);
    
    connection.on('data', (data) => {
        handleData(connection,data)
    });
    
    connection.on('close', () => {
        console.log(`Client disconnected: ${connection.peer}`);
        connections.delete(connection.peer);
        updateClientList();

    });
    
    sendBtn.addEventListener('click', () => {
        const message = document.getElementById('message-input').value;
        sendChat(message)
        document.getElementById('message-input').value = '';
    });
});
