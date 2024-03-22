// Import required modules
const express = require('express');
const path = require('path');
// Create Express app
const app = express();
// Create HTTP server
const server = require('http').createServer(app);
// Initialize Socket.io with server
const io = require('socket.io')(server);

// Use static files from the 'node_modules' directory (this is for bootstrap)
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Get the home.html file
app.get('/home', (req, res) => {
    // Send the home.html file when requested
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Tell server to start listening on port 3000
server.listen(3000, () => {
    console.log("Server running....");
});

// When a client connects, set up the connection
io.on('connection', (socket) => {
    // Log a message when a user connects, along with their socket ID
    //(everytime a user starts the server they get a new ID)
    console.log("User connected:" + socket.id);

    // Listen for 'message' events from users
    socket.on("message", (data) => {
        // Broadcast the received message to all clients except the sender
        //(So we dont get our own message on our screen)
        socket.broadcast.emit('message', data);
    });
});
