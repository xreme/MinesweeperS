const hostPeer = new Peer('MSS7203');
const connections = new Map(); // Store client connections

function appendMessage(message) {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    // Auto scroll to bottom
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

hostPeer.on('open', (id) => {
    document.getElementById('host-id').textContent = id;
    console.log(`Host ready. ID: ${id}`);
});

function updateClientList() {
    const clientList = document.getElementById('client-list');
    const clientCount = document.getElementById('client-count');
    clientList.innerHTML = '';
    connections.forEach((conn, peerId) => {
        const li = document.createElement('li');
        li.textContent = peerId;
        clientList.appendChild(li);
    });
    clientCount.textContent = connections.size;
}

hostPeer.on('connection', (connection) => {
    console.log(`Client connected: ${connection.peer}`);
    connections.set(connection.peer, connection);
    updateClientList();
    
    connection.on('data', (data) => {
        const message = `${connection.peer}: ${data}`;
        console.log(`Data received: ${message}`);
        appendMessage(message);
        // Broadcast to all connected clients
        connections.forEach((conn) => {
            conn.send(message);
        });
    });

    connection.on('close', () => {
        console.log(`Client disconnected: ${connection.peer}`);
        connections.delete(connection.peer);
        updateClientList();
    });
});