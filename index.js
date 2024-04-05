// Import required modules
const express = require('express');// Importing the Express.js module for building web applications
const path = require('path');// Importing the Path module for handling file paths
// Create Express app
const app = express();// Creating an instance of the Express application
// Create HTTP server and pass the app we created
const server = require('http').createServer(app);
// Initialize Socket.io with server
const io = require('socket.io')(server);// Initializing Socket.IO for real-time bidirectional event-based communication

// Store chat history
const chatHistory = [];

// Use static files from the 'node_modules' directory (this is for bootstrap)
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Get the home.html file
app.get('/', (req, res) => {
    // Send the home.html file when requested
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Tell server to start listening on port 3000
// - When the server starts successfully, it logs a message "Server running...." to the console.
server.listen(3000, () => {
    console.log("Server running....");
});

// When a client connects, set up the connection
//set event listener for the 'connection' event
io.on('connection', (socket) => {
    // Log a message when a user connects, along with their socket ID
    //(everytime a user starts the server they get a new ID)
    console.log("User connected:" + socket.id);

    // Emit chat history to the new client
    socket.emit('chatHistory', chatHistory);

    // Listen for 'message' events from users
    socket.on("message", (data) => {
        // Add the new message to the chat history
        chatHistory.push(data);

        // Broadcast the received message to all clients
        io.emit('message', data);
    });

    // Listen for disconnection event
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});
