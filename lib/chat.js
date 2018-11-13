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
  sendMessage(data) {
    this.socket.emit('message', data)
  }
  changeRoom(room) {
    this.socket.emit('join', {
      room,
    })
  }
}
