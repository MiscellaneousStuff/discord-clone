// Express Module and Settings
const express = require('express');
const app = express();
const host = "localhost";
const port = process.env.PORT || 5000;

// Express Middleware
var cors = require('cors');
app.use(cors());

// Socket.IO Module and Settings
const uuidv4 = require('uuid').v4;
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Chat Variables
const botName = "Big Man Bot";
let users = [];

// Utility Modules
const moment = require("moment");

// Format Messages
const formatMessage = (username, text) => {
    return {
        id: uuidv4(),
        username,
        text,
        time: moment().format('h:mm a')
    };
}

// User Functions
const userJoin = (id, username, channel) => {
    const user = { id, username, channel };
    users.push(user);
    return user;
};
function getChannelUsers(channel) {
    return users.filter(user => user.channel === channel);
}
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Setup Chat Application
io.on("connection", socket => {
    // Handle user joining channel
    socket.on("joinChannel", ({username, channel}) => {
        // Add user to text channel
        const user = userJoin(socket.id, username, channel);
        socket.join(user.channel);
        
        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to chat!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.channel)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has joined the channel!`)
            );
        
        // Send users and channel info
        io.to(user.channel).emit('channelUsers', {
            channel: user.channel,
            users: getChannelUsers(user.channel)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.channel).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.channel).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and channel info
            io.to(user.channel).emit('roomUsers', {
                channel: user.channel,
                users: getChannelUsers(user.channel)
            });
        }
    });
});

// Host Web Application
server.listen(port, host, () => {
  console.log(`Example app listening on port ${host}:${port}`)
})