const clientPeer = new Peer();
let activeConnection;

document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connect-btn');
    const sendBtn = document.getElementById('send-btn');
    
    clientPeer.on('open', (id) => {
        console.log(`Client ready. ID: ${id}`);
    });

    connectBtn.addEventListener('click', () => {
        const hostId = document.getElementById('host-id').value;
        const connection = clientPeer.connect(hostId);
        activeConnection = connection;

        connection.on('open', () => {
            console.log('Connected to host.');
            connection.on('data', (data) => {
                console.log('Message from host:', data);
            });
        });

        connection.on('close', () => {
            console.log('Disconnected from host.');
        });
    });

    sendBtn.addEventListener('click', () => {
        if (!activeConnection) {
            console.log('Not connected to host');
            return;
        }
        const message = document.getElementById('message-input').value;
        activeConnection.send(message);
        document.getElementById('message-input').value = '';
    });
});