const socketIo = require('socket.io')

// const chat = {}
// chat.io = false
// chat.gusetNumber = 1
// chat.nickNames = {}
// chat.usedNames = []
// chat.currentRoom = {}

// chat.initialServer = function (server) {
//   this.io = socketIo(server)
//   this.ioListen()
// }

// chat.ioListen = function () {

// }

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
      this.assignRoom(socket)
      this.handleMsgBroadcast(socket)
      this.handleNameChange(socket)
      this.handleRoomChange(socket)
      this.handleDisconnection(socket)
    })
  }

  assignName(socket) {
    let name = `Guest${this.gusetNumber}`
    this.nickNames[socket.id] = name

    this.gusetNumber += 1
  }
  assignRoom(socket) {
    socket.join('Only', () => {
      this.currentRoom
    })
  }
  handleMsgBroadcast(socket) {

  }
  handleMsgBroadcast(socket) {

  }
  handleRoomChange(socket) {

  }
  handleDisconnection(socket) {

  }
}