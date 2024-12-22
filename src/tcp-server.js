const net = require('net');

const server = net.createServer((socket) => {
    console.log('Client connected.');

    socket.on('data', (data) => {
        const message = data.toString().trim(); // Convert the received data to a string
        console.log(`Received: ${message}`);

        // Process the message based on your custom protocol
        // For simplicity, just send back the received message
        socket.write(`You said: ${message}`);
    });

    socket.on('end', () => {
        console.log('Client disconnected.');
    });
});

server.listen(3000, () => {
    console.log('TCP server is listening on port 3000');
});
