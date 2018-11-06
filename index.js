const Koa = require('koa')
const logger = require('koa-logger')
const serve = require('koa-static')
const Chat = require('./lib/chat')

const app = new Koa()

app.use(serve(__dirname + '/public'))
app.use(logger())

const server = require('http').createServer(app.callback())

const chat = new Chat()
chat.initialSocket(server)

server.listen(5200)
console.log('listening on port 5200')
