const express = require('express'); // Importing the Express library
const http = require('http'); // Importing the HTTP module to create a server
const { Server } = require('socket.io'); // Importing the Socket.IO server
const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction
const cors = require('cors'); // Importing CORS middleware
require('dotenv').config() // Importing dotenv to use environment variables

const app = express(); // Creating an Express app
const server = http.createServer(app); // Creating an HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allowing requests from this origin
        methods: ["GET", "POST"] // Allowing these HTTP methods
    }
});

app.use(cors({ origin: "http://localhost:3000" })); // Applying CORS middleware to allow cross-origin requests
app.use(express.json()); // Middleware to parse JSON bodies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI) // Connecting to MongoDB using the connection string from environment variables
    .then(() => {
        console.log('MONGODB CONNECTED'); // Log on successful connection
    })
    .catch((e) => {
        console.log(e); // Log errors if connection fails
    });

const messageSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }, // Default value for createdAt is the current date and time
});

const Message = mongoose.model('Message', messageSchema); // Creating a Mongoose model for messages

app.get('/messages', async (req, res) => {
    const messages = await Message.find(); // Fetching all messages from the database
    res.json(messages); // Sending the messages as a JSON response
});

io.on('connection', (socket) => {
    console.log('a user connected'); // Log when a user connects

    socket.on('chat message', async (msg) => {
        const message = new Message({ text: msg }); // Creating a new message document
        await message.save(); // Saving the message to the database
        io.emit('chat message', msg); // Broadcasting the message to all connected clients
    });

    socket.on('disconnect', () => {
        console.log('user disconnected'); // Log when a user disconnects
    });
});

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001'); // Starting the server and logging the URL
});
