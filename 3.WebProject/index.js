const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Article = require('./db').Article
const read = require('node-readability')
const url = 'http://www.manning.com/cantelon2/'

read(url, (err, result) => {
  Article.create({
    title: result.title, content: result.content
  }, (err, article) => {
    // 将文章保存到数据库中
  })
})

const articles = [{title: 'Example'}]

const port = process.env.PORT || 3000
app.set('port', port)       // 配置端口
/** JSON 消息体解析，表单消息体解析 */
app.use(bodyParser.json())  // 支持编码为JSON的请求消息体
app.use(bodyParser.urlencoded({extended: true}))  // 支持编码为表单的请求消息体

// express 实现RESTful接口
app.get('/', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err)
    res.send(articles)
  })
})

// GET /articles 获取所有文章
app.get('/articles', (req, res, next) => {
  res.send(articles)
})

// POST /articles 创建新文章
app.post('/articles', (req, res, next) => {
  const url = req.body.url
  // 用readability 模块获取这个URL指向的页面
  read(url, (err, result) => {
    if (err || !result) res.status(500).send('Error downloading article')
    Article.create(
      {title: result.title, content: result.content},
      (err, article) => {
        if (err) return next(err)
        res.send('OK')
      }
    )
  })
})

// GET /articles/:id 获取指定的文章
app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id
  // 找出指定的文章
  Article.find(id, (err, article) => {
    if (err) return next(err)
    res.send(article)
  })
})

app.delete('/articles/:id', (req, res, next) => {
  const id = req.params.id
  Article.delete(id, (err) => {
    if (err) return next(err)
    res.send({ message: 'Deleted' })
  })
})

app.listen(app.get('port'), () => {
  console.log(`Express web app available at localhost: ${port}`)
})

module.exports = app

