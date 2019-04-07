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
            //获得前端提交的数据
        let data = [{
            username,
            title,
            content
        }]

        //操作数据库  插入数据
        conn.insert(data, (err, resluts) => {
            if (err) {
                console.log(err)
                return
            }
            callback(resluts)
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
                res.redirect("/comment/list")
                db.close()

                //res.send("提交成功")
            })

            //关闭连接
            db.close()
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




        //并行无关联
        async.parallel([
            callback => {
                //操作数据库  查询数据
                conn.find({}).toArray((err, results) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    total_page = Math.ceil(results.length / page_size)
                    total = results.length
                    callback(null, total_page, total)
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
                count: total
            })
            db.close()

            //res.send("提交成功")
        })

        //关闭连接
        db.close()
    })



    // res.render('list.ejs', {

    // })
})


module.exports = router;