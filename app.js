var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/comment');

var session = require("express-session")
var app = express();

// view engine setup 调用文件路径
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //模版引擎

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

//配置session
app.use(session({
    secret: 'recommmand 128 bytes random string',
    cookie: { //cookie过期时间
        maxAge: 20 * 60 * 1000
    },
    resave: true,
    saveUninitialized: true
}))



//静态文件路径
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comment', commentRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404)); //报错 错误 向下传递
});

// error handler 500错页面
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;