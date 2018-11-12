/**
 *
 *
 * @export
 * @class Chat
 */
export default class Chat {
  constructor (socket) {
    this.socket = socket
  }
  sendMessage(room, text) {
    this.socket.emit('message', {
      room: room,
      text: text,
    })
  }
  changeRoom(room) {
    this.socket.emit('join', {
      room: room,
    })
  }
}
