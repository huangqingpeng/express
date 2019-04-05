var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //render 渲染模版 去view 文件下找indx.ejs
    res.render('index', {
        title: 'Express',
        name: 'hqp',
        tname: '<b>welcome to china</b>'
    });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    //render 渲染模版 去view 文件下找indx.ejs
    res.render('login', {});
});


module.exports = router;