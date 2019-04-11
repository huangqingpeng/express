var express = require("express");
var router = express.Router();

var MongoClient = require("mongodb").MongoClient;
const db_conn_str = 'mongodb://localhost:27017/test';

let async = require("async")

router.post('/submit', function(req, res) {
    //todo
    let username = req.session.username || ''
    if (!username) {
        res.send('<script>alert("session过期")</script>')

        //res.redirect("/login")
        return
    }

    //发送json字符串
    let title = req.body['title']

    let content = req.body['content']


    let insertData = (db, callback) => {
        //连接表
        //let conn = db.collection('user') //2.0写法
        let conn = db.db('test').collection('comment') //2.0写法
        let ids = db.db('test').collection('ids')
        async.waterfall([
            callback => {
                ids.findAndModify({
                    name: 'comment'
                }, [
                    ['_id', 'desc']
                ], {
                    $inc: {
                        id: 1 //id=id+1
                    }
                }, (err, result) => {
                    if (err) return
                    console.log("id自增之后")
                    console.log(result)

                    callback(null, result.value.id)
                    db.close()
                })
            },
            (id, callback) => {

                //获得前端提交的数据
                let data = [{
                    username,
                    title,
                    content,
                    uid: id //数据加上自定义id
                }]
                console.table(data)
                    //操作数据库  插入数据
                conn.insert(data, (err, results) => {
                    console.log(222)
                    console.log(err)
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log(results)
                    callback(null, results)
                })
            }
        ], (err, results) => {
            if (err) return
            console.log(results)
            callback(results)
        })

    }
    MongoClient.connect(db_conn_str, (err, db) => {
            if (err) {
                console.log(err)
                return
            }
            console.log("连接成功")
            insertData(db, results => {
                console.log(results)
                console.log("提交成功")
                db.close()
                res.redirect("/comment/list")
            })
        })
        //res.send('ok')
})

//post  get都接收    去数据库取数据  渲染在list页面
router.all('/list', (req, res) => {
    //todo
    let username = req.session.username || ''
    if (!username) {
        res.send('<script>alert("session过期")</script>')
            //res.redirect("/login")
        return
    }

    //发送json字符串
    let title = req.query['title']
    let content = req.query['content']

    //构建分页信息
    let page_num = req.query['page_num']
    page_num = page_num ? page_num : 1

    // let page_size = req.query['page_size']
    let page_size = 5
    let total_page = 0
    let total = 0

    let findData = (db, callback) => {
        //连接表
        //let conn = db.collection('user') //2.0写法
        let conn = db.db('test').collection('comment') //2.0写法

        //串行
        async.series([
            callback => {
                //操作数据库  查询数据
                conn.find({}).toArray((err, results) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    total_page = Math.ceil(results.length / page_size)
                    total = results.length

                    page_num = page_num <= 0 ? 1 : page_num
                    page_num = page_num > total_page ? total_page : page_num
                    callback(null, '')
                })
            },
            callback => {
                conn.find({}).sort({
                        _id: -1 //-1反序  1正序
                    }).skip((page_num - 1) * page_size).limit(page_size)
                    .toArray((err, results) => {
                        if (err) {
                            console.log(err)
                            return
                        }
                        callback(null, results)
                    })
            }
        ], (err, result) => {
            console.log(result)

            callback(result[1])
        })
    }

    MongoClient.connect(db_conn_str, (err, db) => {
        if (err) {
            console.log(err)
            return
        }
        console.log("连接成功")
        findData(db, (results) => {
            console.log(results)
            console.log("提交成功")
            res.render('list.ejs', {
                page_num: page_num,
                total_page: total_page,
                results: results,
                count: total,

            })
            db.close()
                //res.send("提交成功")
        })
    })

})


//详情
router.get("/details", (req, res) => {
    let uid = req.query['uid']
    console.log(uid)
    MongoClient.connect(db_conn_str, (err, db) => {
        if (err) throw err
        db.db("test").collection('comment', {
            safe: true
        }, (err, collection) => {
            if (err) {
                console.log(err)
                return
            }
            collection.find({
                uid: parseInt(uid)
            }).toArray((err, results) => {
                console.log(results)
                res.render('details', {
                    item: {
                        title: results[0].title,
                        uid: results[0].uid,
                        content: results[0].content
                    }
                })
                db.close()
            })
        })

    })

})


module.exports = router;