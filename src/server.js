// require('dotenv').config();
const express = require('express');
const configViewEngine = require("./configs/viewEngine");
const initWebRoutes = require("./routes/web");
// const connection = require('./configs/connectDB')
const cookieParser = require('cookie-parser');
const connectFlash = require('connect-flash');
const session = require('express-session')
const passport = require('passport')
let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('secret'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 2
    }
})) 

app.use(connectFlash());
//Config view engine
configViewEngine(app);

//config passport
app.use(passport.initialize());
app.use(passport.session());

// init all web routes
initWebRoutes(app);

let port = process.env.PORT || 5000;
app.listen(port, () =>console.log(`Listening on port ${port}...`));
