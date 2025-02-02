const clientPeer = new Peer();
let activeConnection;
var hostInfo = null;

const playerName = sessionStorage.getItem('playerName') || 'Unknown'

document.addEventListener('DOMContentLoaded', () => {
    const hostId = sessionStorage.getItem('roomCode');
    const sendBtn = document.getElementById("sendChat")
    
    window.addEventListener('keypress', (e)=>{
        if (e.key === 'Enter'){
            const message = document.getElementById('message-input').value;
            sendChat(message)
            document.getElementById('message-input').value = ''; 
        }
    })
     
    
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
});