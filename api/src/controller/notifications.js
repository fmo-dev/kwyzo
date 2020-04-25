connectedUser = [];
const sockStS = require('socket.io-client')('http://localhost:8080');

module.exports.respond = (socket) => {



    socket.on("addUser", id => {
        if (id != '') connectedUser.push({ userId: id, socketId: socket.id, restarted: false });
    })

    socket.on("sendFriendNotif", data => {
        socket.emit('upFriends')
        const sender = connectedUser.filter(user => user.socketId == socket.id)[0]
        connectedUser.map(user => {
            if (user.userId == sender.userId) {
                socket.to(user.socketId).emit("upFriends")
            } else if (user.userId == data.id) {
                socket.to(user.socketId).emit("getFriendNotif", data)
            }
        })
    })

    socket.on('quizzDone', data => {
        connectedUser.map(user => {
            if (user.userId == data.id) {
                socket.to(user.socketId).emit("getNewScore", { type: data.type, message: data.message, route: data.route })
            }
        })
    })

    socket.on('publicQuizzUpdate', quiz => {
        const sender = connectedUser.filter(user => user.socketId == socket.id)[0];
        connectedUser.map(user => {
            if (sender.userId != user.userId) {
                socket.broadcast.emit('getQuizzUpdate', quiz)
            }
        })
    })

    socket.on('userUpdate', (data) => {
        const sender = connectedUser.filter(user => user.socketId == socket.id)[0];
        connectedUser.map(user => {
            let event = user.userId == sender.userId ? 'getSelfUpdate' : 'getUserUpdate'
            socket.to(user.socketId).emit(event, data)
        })
    })

    socket.on('sendQuizNotif', data => {
        socket.emit('newEdit')
        const sender = connectedUser.filter(user => user.socketId == socket.id)[0];
        connectedUser.map(user => {
            if (user.userId == sender.userId) {
                socket.to(user.socketId).emit("newEdit")
            } else if (data.concerned.includes(user.userId)) {
                socket.to(user.socketId).emit("getQuizzNotif", data)
            }
        })
    })

    socket.on("deconnexion", id => {
        socketId = id ? id : socket.id
        connectedUser = connectedUser.filter(user => user.socketId != socketId)
    });

    socket.on("disconnect", () => {
        sockStS.emit("deconnexion", socket.id)
    });
}