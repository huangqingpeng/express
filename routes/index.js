var express = require('express');
var router = express.Router();
var session = require("express-session")
    /* GET home page. */
router.get('/', function(req, res, next) {
    //render 渲染模版 去view 文件下找indx.ejs
    res.render('index', {
        title: 'Express',
        name: 'hqp',
        tname: '<b>welcome to china</b>',
        username: req.session.username
    });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    //render 渲染模版 去view 文件下找indx.ejs
    res.render('login', {});
});
router.get('/registor', function(req, res, next) {
    //render 渲染模版 去view 文件下找indx.ejs
    res.render('registor', {});
});

//退出
router.get('/loginout', function(req, res, next) {
    // //清除session  方法一
    // req.session.username = undefined
    // res.redirect("/")


    //清除session  方法二   全部清空
    req.session.destroy((err) => {
        res.redirect("/")
    })

});

//comment
router.get("/comment", function(req, res, next) {
    res.render("comment", {})
})


module.exports = router;