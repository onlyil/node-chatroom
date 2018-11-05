const Koa = require('koa')
const router = require('koa-router')
const logger = require('koa-logger')
const serve = require('koa-static')

const app = Koa()



app.use(serve(__dirname + '/public'))

const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

io.on('connection', () => {
  // 
})

server.listen(5200)
console.log('listening on port 5200')
