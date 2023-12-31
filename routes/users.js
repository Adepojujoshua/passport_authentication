const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport');

const User = require('../models/Users')


router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/register',(req,res)=>{
    res.render('register')
})

router.post('/register',async (req,res)=>{
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
    }else {
        try {
            const user = await User.findOne({ email: email });
            if(user) {
                errors.push({ message: 'User already registered' })
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newUser.password, salt);
                newUser.password = hash;
        
                await newUser.save();
        
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
            }
        }
        catch(err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res,next);
})

router.get('/logout', (req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
        };
        req.flash('success_msg', 'You have successfully logged out')
        res.redirect('/users/login')
    });
    
})


module.exports = router


// else{
//     User.findOne({ email:email })
//     .then(user => {
//         if(user){
//         errors.push({msg:'Email already in use'});
//         res.render('register', {errors,
//         name,
//         email,
//         password,
//         password2
//         });
//         }
//         else{
//             const newUser = new User({
//                 name,
//                 email,
//                 password
//             })

            
//             // Hash password
//             bcrypt.genSalt(10, (err, salt)=>{
//                 bcrypt.hash(newUser.password, salt, (err,hash)=>{
//                     if(err) throw err;
//                     // set password to hashed
//                     newUser.password = hash;

//                     newUser.save()
//                     .then((user) => {
//                         req.flash('success_msg', 'You are now registered and can login');
//                         res.redirect('/users/login')
//                     })
//                     .catch((err) => {console.log(err)})
//                 })
//             })
//         }
//     })
// }