const playerName = sessionStorage.getItem('playerName');
const roomCode = generateRoomCode(playerName.toUpperCase().substring(0,4))
const hostPeer = new Peer(roomCode);
const connections = new Map(); // Store client connections
const clientInfo = new Map();
var sendBtn = null;
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
function generateRoomCode(name) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `MSS-${name}-${randomDigits}`;
}

function appendMessage(sender, message) {
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
        console.log('Sending details:', obj);
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
            default:
                connection.send("Unknown Command")
    }
}
function broadcast(data){
    obj = JSON.stringify(data)
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
