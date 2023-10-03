const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

// route imports
const indexRouter = require('./backend/routes/index.js');
const adminRouter = require('./backend/routes/admin.js');
const userRouter = require('./backend/routes/auth.js');
const marketRouter = require('./backend/routes/market.js');
const { requireAuth } = require('./middleware/authWare.js');
const apiIndexRouter =require('./api/routes/index.js');

const app = express();

// mongodb connection
require('./models/connect');

// static files and template engine
app.set('views', path.join(__dirname, 'views') );
app.set('view engine', 'ejs');

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));


// routes
app.use('/', indexRouter);
app.use('/user', requireAuth , userRouter);
app.use('/admin', adminRouter);
app.use('/marketplace', requireAuth, marketRouter);
app.use('/api', apiIndexRouter);

// listener
app.listen(8000, ()=>{
    console.log('server is now cooking on port 8000')
});