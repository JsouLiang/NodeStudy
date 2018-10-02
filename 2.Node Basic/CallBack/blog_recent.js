const http = require('http')
const fs = require('fs')
http.createServer((req, res) => {       // 1. 创建HTTP服务器并用回调调用
  if (req.url == '/') {
    fs.readFile('./titles.json', (err, data) => { // 2. 读取JSON文件并用回调定义如何处理其中内容
      if (err) {
        console.log(err)
        res.end('Server Error')
      } else {
        const titles = JSON.parse(data.toString())
        fs.readFile('./template.html', (err, data) => { // 读取HTML模板
          if (err) {
            console.log(err)
            res.end('Server Error')
          } else {
            const tmpl = data.toString();
            const html = tmpl.replace('%', titles.join('</li><li>'))
            res.writeHead(200, {'Content-Type:': 'text/html'})
            res.end(html)
          }
        })
      }
    })
  }
}).listen(8000, '127.0.0.1')
// =============================================
// ==================          =================
// ==================  结构化   =================
// ==================          =================
// =============================================

// 客户端请求一开始会进到这里
http.createServer((req, res) => {
  getTitles(res)
}).listen(8000, '127.0.0.1')

function getTitles(res) {
  fs.readFile('./titles.json', (err, data) => {
    if (err) {
      hadError(err, res)
    } else {
      getTemplate(JSON.parse(data.toString()), res)
    }
  })
}

function getTemplate(titles, res) {
  fs.readFile('./template.html', (err, data) => {
    if (err) {
      hadError(err, res)
    } else {
      formatHtml(titles, data.toString(), res)
    }
  })
}

function formatHtml(titles, tmpl, res) {
  const html = tmpl.replace('%', titles.join('</li><li>'))
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(html)
}

function hadError(err, res) {
  console.log(err)
  res.end('Server Error')
}

