var express = require('express');
var router = express.Router();
var session = require("express-session")

//文件操作
var multiparty = require("multiparty")
var fs = require("fs")


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

//处理图片文件
router.post("/uploadImg", (req, res) => {
    let form = new multiparty.Form()

    //设置编码
    form.encoding = "utf-8"

    //设置文件存储路径
    form.uploadDir = './uploadtemp'

    //设置文件大小
    form.maxFileSize = 20 * 1024 * 1024

    form.parse(req, (err, fields, files) => {
        let uploadurl = '/images/upload/'
        file = files['filedata'] //拿到文件
        originalFilename = file[0].originalFilename; //原始文件名   前端上传的文件名称

        tempPath = file[0].path //前端传的文件路径

        let timestamp = new Date().getTime()

        uploadurl += timestamp + originalFilename //处理文件名加上时间戳

        //文件名字加上时间戳
        newPath = './public/' + uploadurl
        let fileReadStream = fs.createReadStream(tempPath)
        let fileWriteStream = fs.createWriteStream(newPath)
        fileReadStream.pipe(fileWriteStream) //创建管道流

        fileWriteStream.on('close', () => {
            fs.unlinkSync(tempPath)
            res.send('{"err":"","msg":"' + uploadurl + '"}')
        })



    })

})

module.exports = router