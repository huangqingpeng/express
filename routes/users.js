var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //发送json字符串
    res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
    //业务逻辑
    //res.send('login success get');
    console.log("username=" + req.body['username'])
    console.log("username")
    req.body['username']
    res.send('login success get');
});

router.post('/login', function(req, res, next) {
    res.send('login success post');
});

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
    res.sendFile('/Users/huangqingpeng/Desktop/workspaces/express/package.json');
})


module.exports = router;