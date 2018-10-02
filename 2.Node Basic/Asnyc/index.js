const async = require('async')
async.series([
  callBack => {

  },
  callBack => {

  },
  callBack => {

  }
]);

// =========
// 串行执行异步任务
// =========

const fs = require('fs')
const request = require('request');
const htmlparser = require('htmlparser')
const configFilename = './rss_feeds.txt'

function checkForRSSFile() {
  fs.exists(configFilename, (exists) => {
    if (!exists) return next(new Error(`Missing RSS file: ${configFilename}`))
    next(null, configFilename)
  })
}

function downloadRSSFeed(feedUrl) {
  request({uri: feedUrl}, (err, res, body) => {
    if (err) return next(err)
    if (res.statusCode !== 200) return next(new Error('Abnormal response status code'))
    next(null, bodu)
  })
}

function parseRSSFeed(rss) {
  const handler = new htmlparser.RssHandler()
  const parser = new htmlparser.Parser(handler)
  parser.parseComplete(rss)

  if (!handler.dom.items.length) return next(new Error('No RSS item found'))
  const item = handler.dom.items.shift()
  console.log(item.title)
}

const tasks = [
  checkForRSSFile,
  downloadRSSFeed,
  parseRSSFeed
]

// 负责执行任务的next函数，从任务数组tasks中取出下一个任务，如果出错则抛出异常
function next(err, result) {
  if (err) throw err
  const currentTask = tasks.shift()
  if (currentTask) {
    currentTask(result)
  }
}

// =========
// 并行执行异步任务
// =========
const fs = require('fs')
const tasks = []
const wordCounts = {}
const fileDir = './text'
let completeTasks = 0

function checkIfComplete() {
  completeTasks++
  // 当所有任务全部完成，列出文件中用到的单词以及用过的次数
  if (completeTasks === tasks.length) {
    for (let index in wordCounts) {
      console.log(`${index}: ${worldCounts[index]}`)
    }
  }
}

function addWordCount(word) {
  wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1
}

function countWordsInText(text) {
  const words = text.toString().toLowerCase().split(/\W+/).sort()
  words.filter(word => word).forEach(word => addWordCount(word))
}

fs.readdir(filesDir, (err, files) => {
  if (err) throw err
  files.forEach(file => {
    // 定义处理每个文件的任务，每个任务都会调用一个异步读取文件的函数，并统计文件中使用的单词
    const task = (file => {
      return () => {
        fs.readFile(file, (err, text) => {
          if(err) throw err
          countWordsInText(text)
          checkIfComplete()
        })
      }
    })(`${filesDir}/${file}`)
    // 把所有的任务添加到函数数组中
    tasks.push(task)
  })
  tasks.forEach(task => task())   // 开始所有任务
})