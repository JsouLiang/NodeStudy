const sqlite3 = require('sqlite3').verbose
const dbName = 'later.sqlite'
// 1. 使用sqlite3.Database 打开一个数据库文件
const db = new sqlite3.Database(dbName)

db.serialize(() => {
  // IF NOT EXISTS 
  const sql = `
    CREATE TABLE IF NOT EXISTS articles
    (id integer primary key,
     title,
     content TEXT)
  `
  db.run(sql) // 2. 创建一个articles表
})

class Article {
  static all(cb) {
    // 获取所有的文章
    db.all('SELECT * FROM articles', cb)
  }

  static find(id, cb) {
    db.get('SELECT * FROM articles WHERE id = ?', id, cb);
  }

  static create(data, cb) {
    const sql = 'INSERT INTO articles(title, content) VALUE (?, ?)';
    db.run(sql, data.title, data.content, cb);
  }

  static delete(id, cb) {
    if (!id) return cb(new Error('please provide an id'))
    db.run('DELETE FROM articles WHERE id = ?', id, cb)
  }
}

module.exports = db
module.exports.Article = Article