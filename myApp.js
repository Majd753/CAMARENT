const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT;

const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));
const morgan = require("morgan");
const path = require("path");
const cookieParser = require('cookie-parser');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.set('views', path.join(process.cwd() + '/views'));
app.engine('handlebars', expressHandlebars.engine({
    extname: '.handlebars',
    defaultLayout: 'layout',
    layoutsDir: "views/layouts/"
}));

app.set('view engine', 'handlebars');

app.use("/public", express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  cookie: { maxAge: 10 * 60 * 60 * 1000 },
  secret: process.env.COOKIE_SECRET,
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  next()
});
app.use((req,res,next)=>{
  console.log(req.session);
  console.log(req.session.id);
  next();
});
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/search', require('./routes/search'));
app.use('/equipments', require('./routes/equipments'));
app.use('/payment', require('./routes/payment'));
app.use((req, res, next) => {
    res.status(404).render('notFound');
  });

  


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
