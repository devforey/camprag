const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const userById = {};

// { [id]: user }

io.on('connection', function (socket) {
    socket.on('user_join', function ({ name }) {
        io.emit('user_join', { name });
        userById[socket.id] = { name };
    });

    socket.on('chat_message', function ({ message }) {
        if (!userById[socket.id]) {
            io.emit('unauthorized');
            return;
        }

        io.emit('chat_message', {
            sender: userById[socket.id].name,
            message,
            timestamp: Date.now()
        });
    });

    socket.on('disconnect', function () {
        io.emit('user_disconnect', userById[socket.id]);
        userById[socket.id] = undefined;
    });
});

http.listen(port, function () {
    console.log('listening on http://localhost:' + port);
});