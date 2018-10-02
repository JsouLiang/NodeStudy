const fs = require('fs')
const events = require('events')

class Watcher extends events.EventEmitter {
  constructor(watchDir, processDir) {
    super()
    this.watchDir = watchDir
    this.processDir = processDir
  }

  watch() {
    fs.readdir(this.watchDir, (err, files) => {
      if (err) throw err;
      for (var index in files) {
        this.emit('process', files[index])
      }
    })
  }

  start() {
    fs.watchFile(this.watchDir, () => {
      this.watch()
    })
  }
}

module.exports = Watcher

const watcher = new Watcher(watchDir, processDir)
// 监听process 事件
watcher.on('process', (file) => {
  const watchFile = `${watchDir}/${file}`
  const processedFile = `$${processedDir}/${file.toLowercase()}`
  fs.rename(watchFile, processedFile, err => {
    if (err) throw err
  })
})

watcher.start()

