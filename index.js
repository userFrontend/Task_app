const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const methodOverride = require("method-override")
const session = require("express-session")
const passport = require("passport")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const fileupload = require("express-fileupload")

dotenv.config()


//  import routes

const mainRouter = require('./src/router/mainRouter')
const authRouter = require('./src/router/authRouter')
const dashRouter = require('./src/router/dashRouter')
const errorCtrl = require('./src/controller/dashCtrl')


const app = express()
const PORT = process.env.PORT || 4001;

app.use(session({secret: 'sekret_key', resave: true, saveUninitialized: true}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))

app.use(express.static('public'))

app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

// app.get('/', (req, res) => {
//     res.render('index')
// })

//  use routes

app.use('/', mainRouter)
app.use('/', authRouter)
app.use('/', dashRouter)
app.all('*', errorCtrl.error)
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        app.listen(PORT, () => console.log(`Server startedon on port: ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}
start()
