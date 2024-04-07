// In the first step, we will set up a basic Express.js server with Socket.io integration. We need to import two modules: Our Express framework and a core module used for handling file paths.
const express = require('express');
const path = require('path');

// We will then create our express application
const app = express();

// Now we will create the HTTP server to handle incoming HTTP requests. We will pass our ‘app’ as a perimeter to the createServer function.
const server = require('http').createServer(app);

// In the next step, we will integrate Socket.io with the server instance created in the previous step. This creates a Socket.io server to work alongside our HTTP server.
const io = require('socket.io')(server);

// Next, we will create a variable to store our recent messages in an empty array. We will call it chatHistory
const chatHistory = [];

// This next line of code is for bootstrap. We ran into some issues with the styling, we figured out that we needed to use some Express middleware to serve our static style files from the node_module directory.
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Now we need to set up a route handler for the HTTP GET request to the root path of the server
app.get('/', (req, res) => {
    // Inside the callback function we need to send the home.html file located in our views folder as a response to the client's request
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Now we need the server to listen for incoming connections on port 3000
server.listen(3000, () => {
    // We will then log a message to the console that the server is running. When the server starts running this call-back function will be executed.
    console.log("Server running....");
});

// Now we need to listen for a ‘connection’ event emitted by Socket.io when the client connects to the server. 
io.on('connection', (socket) => {
    // We will then log a message to the console that tells the user they are connected, along with their unique ID of the socket connection.
    console.log("User connected:" + socket.id);

    // We will then emit the ChatHistory array to our new client
    socket.emit('chatHistory', chatHistory);

    // Now we will set up an event listener for the ‘message’ event emitted by the client. When the client sends a message the callback function will execute.
    socket.on("message", (data) => {
        // We will now add the received message data to our chatHistory array 
        chatHistory.push(data);

        // Now we need to broadcast the received message data to all connected clients. 
        io.emit('message', data);
    });

    // We will now set up one final event listener. This will listen for a disconnect event emitted by socket.io when the client disconnects from the server.
    socket.on('disconnect', () => {
        // Then we will log a message to the console saying that the user is disconnected along with their unique id
        console.log('User disconnected: ' + socket.id);
    });
});
