const mongoose = require('mongoose')
require('dotenv').config()

dbURI = process.env.dbURI

mongoose.connect(dbURI, {
    useNewUrlParser: true
})
.then(() => console.log('connected to DB'))
.catch(console.error);