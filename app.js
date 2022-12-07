//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')


const app = express()

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGO_DB)


const UserSchema = new mongoose.Schema({
    email: String,
    password: String
})


//ANTES del modelo
const secret = process.env.SECRET
UserSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });


const User = new mongoose.model('User', UserSchema)


app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/register', (req, res)=>{
    res.render('register')
})

app.post('/register', (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else{
            res.render('secrets')
        }
    })
})

app.post('/login',  (req, res)=>{
    const {username, password} = req.body
    User.findOne({email: username}, (err, foundUser)=>{
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render('secrets')
                }
            }
        }
    })
})


app.listen(3000, ()=>{
    console.log('Server Running on port 3000')
})