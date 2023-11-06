// Create web server application
const express = require('express');
const app = express();

// Create connection to MySQL database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 8889, // Change this to your own port number
    database: 'comments'
});

// Start server
const server = app.listen(8888, () => {
    console.log('Server is running...');
});

// Set up socket.io
const io = require('socket.io')(server);

// Set up socket.io connection
io.on('connection', (socket) => {
    console.log('New user connected');

    // Get all comments from database
    connection.query('SELECT * FROM comments', (err, data) => {
        if (err) {
            console.log(err);
            socket.emit('error', err);
        } else {
            socket.emit('output', data);
        }
    });

    // Listen to 'input' event
    socket.on('input', (data) => {
        let name = data.name;
        let comment = data.comment;
        let timestamp = Math.floor(Date.now() / 1000);

        // Insert data into database
        connection.query('INSERT INTO comments (name, comment, timestamp) VALUES (?, ?, ?)', [name, comment, timestamp], (err, data) => {
            if (err) {
                console.log(err);
                socket.emit('error', err);
            } else {
                io.emit('output', [data]); // Send back data to all users
            }
        });
    });

    // Listen to 'clear' event
    socket.on('clear', () => {
        // Delete all data from database
        connection.query('DELETE FROM comments', (err) => {
            if (err) {
                console.log(err);
                socket.emit('error', err);
            } else {
                io.emit('cleared'); // Send back message to all users
            }
        });
    });

    // Listen to 'disconnect' event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});