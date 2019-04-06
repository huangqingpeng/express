var express = require("express");
var router = express.Router();

var MongoClient = require("mongodb").MongoClient;
const db_conn_str = 'mongodb://localhost:27017/test';


/* GET users listing. */
router.get("/", function(req, res, next) {
    //发送json字符串
    res.send("respond with a resource");
});

//注册registor

router.post("/registor", function(req, res, next) {
    //发送json字符串
    console.log('registor success')
    console.log(req.param('username'))
    let username = req.body['username']
    let password = req.body['password']
    let nickname = req.body['nickname']

    let insertData = (db, callback) => {
        //连接表
        //let conn = db.collection('user') //2.0写法
        let conn = db.db('test').collection('user') //2.0写法
            //获得前端提交的数据
        let data = [{
                username,
                password,
                nickname
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
                console.log("注册成功")
                res.send("注册成功")
            })

            //关闭连接
            db.close()
        })
        //res.send("respond with a registor");
});



//login
router.post("/login", function(req, res, next) {
    //发送json字符串
    console.log('login success')
    console.log(req.param('username'))
    let username = req.body['username']
    let password = req.body['password']

    let findData = (db, callback) => {
        //连接表
        //let conn = db.collection('user') //2.0写法
        let conn = db.db('test').collection('user') //2.0写法
            //获得前端提交的数据
        let data = {
            username,
            password,
        }

        //操作数据库  查找数据
        conn.find(data).toArray((err, results) => {
            if (err) {
                console.log(err)
                return
            }
            callback(results)
            console.log(results)
        })
    }
    MongoClient.connect(db_conn_str, (err, db) => {

            if (err) {
                console.log(err)
                return
            }
            console.log("连接成功")
            findData(db, results => {
                console.log(results)
                console.log("登陆成功")
                if (results.length > 0) {

                    //保存session
                    req.session.username = results[0].username


                    //路由跳转
                    res.redirect("/")

                    //res.send("登陆成功")
                } else {

                    res.redirect("/login")

                    //res.send("登陆失败")
                }

                //关闭连接
                db.close()
            })
        })
        //res.send("respond with a registor");
});


// router.get("/login", function(req, res, next) {
//     //业务逻辑
//     //res.send('login success get');
//     //get获取参数
//     console.log(req.param("username"));
//     console.log(req.query["username"]);
//     console.log("username");
//     res.send("login success get");
// });

// router.post("/login", function(req, res, next) {
//     //post获取参数
//     console.log("username=" + req.body["username"]);
//     req.body["username"];
//     res.send("login success post");
// });

//同时处理post和get请求
// router.all('*', function(req, res, next) {
//     res.send('login success post and get');
// });
// router.all('/login', function(req, res, next) {
//     res.send('login success post and get');
// });

// router.get("/ab*cd", function(req, res, next) {
//     res.send('login success abecd  路由正则匹配');
// })

//读取文件
router.get("/html", function(req, res, next) {
    res.sendFile("/Users/huangqingpeng/Desktop/workspaces/express/package.json");
});

module.exports = router;