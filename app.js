const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()
const indexRouter = require('./routes/index.js')
const adminRouter = require('./routes/admin.js')

const app = express()

dbURI = process.env.dbURI


mongoose.connect(dbURI, {
    useNewUrlParser: true
})
.then(() => console.log('connected to DB'))
.catch(console.error);


app.set('views', path.join(__dirname, 'views') )
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))

app.use('/', indexRouter);
app.use('/admin', adminRouter);








app.listen(8000, ()=>{
    console.log('server is now cooking on port 8000')
})