const express = require('express')
const router = express.Router();
const bcyrpt = require('bcryptjs')

const User = require('../models/Users')


router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register',(req,res)=>{
    const { name, email, password, password2 } = req.body;
    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill all fields'});
    }
    if(password!== password2){
        errors.push({msg:'Passwords do not match'});
    }
    if(password.length < 6){
        errors.push({msg:'Password must be at least 6 characters'});
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }else{
        User.findOne({ email:email })
        .then(user => {
            if(user){
            errors.push({msg:'Email already in use'});
            res.render('register', {errors,
            name,
            email,
            password,
            password2
            });
            }
            else{
                const newUser = new User({
                    name,
                    email,
                    password
                })
                newUser.save()
                .then(() => {
                    console.log(newUser);
                    res.send('hello')
                })
                
            }
        })
    }
});

module.exports = router