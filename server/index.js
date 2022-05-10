// Express Module and Settings
const express = require('express');
const app = express();
const host = "localhost";
const port = process.env.PORT || 3000;

// Socket.IO Module and Settings
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

// Utility Modules
const moment = require("moment");

// Format Messages
const formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

// Setup Chat Application
io.on("connection", socket => {
    socket.on("joinChannel", ({username, channel}) => {
        // Add user to text channel
        const user = userJoin(socket.id, username, channel);
        socket.join(user.room);

        // Broadcast when a user connects
        socket.broadcast
            .to(user.channel)
            .emit(
                "message",
                formatMessage(botName, "${user.username} has joined the channel!")
            );
    });
});

// Host Web Application
app.listen(port, host, () => {
  console.log(`Example app listening on port ${host}:${port}`)
})