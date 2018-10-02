const events = require('events')
const net = require('net')
const channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}
channel.on('join', function(id, client) {
  this.clients[id] = client           // 
  this.subscriptions[id] = (senderId, message) => {
    if (id != senderId) {
      this.client[id].write(message)
    }
  }
  this.on('broadcase', this.subscriptions[id])
})

const server = net.createServer(client => {
  const id = `${client.remoteAddress}:${client.removePort}`
  channel.emit('join', id, client)
  channel.on('data', data => {
    data = data.toString()
    channel.emit('broadcase', id, data)
  })
})

server.listen('8888')