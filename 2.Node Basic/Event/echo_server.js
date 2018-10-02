const net = require('net')
const server = net.createServer(socket => {
  socket.on('data', data => {
    socket.write(data)
  })
})
server.listen(8888)

// 事件发射器
const EventEmitter = require('events').EventEmitter
// 定义一个channel的时间发射器
const channel = new EventEmitter()    
// 用on 方法为发射器添加监听器
channel.on('join', () => {
  console.log('Weclome')
})

// 发射事件
channel.emit('join')
