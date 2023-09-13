const express = require('express');
const path = require('path');
const expresslayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport');

const app = express();

//passport config
require('./config/passport')(passport);

const PORT = process.env.PORT || 5000;


//DB configuration
const db = require('./config/keys').MongoURI

//Mongoose configuration
mongoose.connect(db,{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err)=>{console.log(err)})

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

// connect flash
app.use(flash())

// Global vars
app.use((req,res,next) =>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')

  next();
})

app.use(expresslayouts);
app.set('layout', 'layouts')
app.set('view engine', 'ejs');

// Bodyparser: we can get data from our form with req.body
app.use(express.urlencoded({extended: true}))

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})