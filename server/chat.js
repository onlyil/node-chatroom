const socketIo = require('socket.io')

class Chat {
  constructor () {
    this.io = null
    this.gusetNumber = 0
    this.nickNames = {}
    this.usedNames = []
    this.currentRoom = {}
  }
  initialSocket(server) {
    this.io = socketIo(server)
    this.ioListen()
  }
  ioListen() {
    this.io.on('connection', (socket) => {
      this.assignName(socket)
      this.assignRoom(socket, 'Only')
      this.handleMsgBroadcast(socket)
      this.handleNameChange(socket)
      this.handleRoomChange(socket)
      this.handleDisconnection(socket)
    })
  }

  assignName(socket) {
    let name = `Guest${this.gusetNumber}`
    this.nickNames[socket.id] = name
    this.usedNames.push(name)
    this.gusetNumber += 1
    // let user get the name
    socket.emit('nameResult', {
      success: true,
      name,
    })
  }

  assignRoom(socket, room) {
    socket.join(room, () => {
      this.currentRoom[socket.id] = room
      socket.emit('joinResult', {
        room,
      })
      socket.broadcast.to(room).emit('notify', {
        text: `${this.nickNames[socket.id]} enter the room! Welcome!`,
      })

      let usersInRoom
      this.io.sockets.clients((error, clients) => {
        if (error) throw error
        usersInRoom = clients
      })
      // show other users in the room
      if (usersInRoom && usersInRoom.length > 1) {
        let usersSummary = 'Users currently in room: '
        for (let i in usersInRoom) {
          let userSocketId = usersInRoom[i].id
          if (usersInRoom !== socket.id) {
            if (i > 0) usersSummary += ', '
            usersSummary += this.nickNames[userSocketId]
          }
        }
        socket.emit('usersSummary', usersSummary)
      }
    })
  }

  handleMsgBroadcast(socket) {
    socket.on('message', msg => {
      socket.broadcast.to(msg.room).emit('message', {
        text: msg.text,
        nickname: this.nickNames[socket.id],
      })
    })
  }
  
  handleNameChange(socket) {
    socket.on('changeName', (name) => {
      if (this.usedNames.includes(name)) {
        socket.emit('nameResult', {
          success: false,
          msg: 'This name is already in use.',
        })
      } else {
        this.nickNames[socket.id] = name
        this.usedNames.push(name)
        const prevName = this.nickNames[socket.id]
        this.usedNames = this.usedNames.filter(item => item !== prevName)
        socket.emit('nameResult', {
          success: true,
          name,
        })
        socket.broadcast.to(this.currentRoom[socket.id]).emit('message', {
          text: `${prevName} is known as ${name}.`,
        })
      }
    })
  }

  handleRoomChange(socket) {
    socket.on('join', room => {
      socket.leave(this.currentRoom[socket.id])
      this.assignName(socket, room.newRoom)
    })
  }
  
  handleDisconnection(socket) {
    socket.on('disconnect', () => {
      socket.broadcast.to(this.currentRoom[socket.id]).emit('notify', {
        text: `${this.nickNames[socket.id]} leave this room.`,
      })
      this.usedNames = this.usedNames.filter(item => item !== this.nickNames[socket.id])
      delete this.nickNames[socket.id]
    })
  }
}

module.exports = Chat
