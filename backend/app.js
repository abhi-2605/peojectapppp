const express = require('express');
const bodyParser = require('body-parser');
var app = new express()
const cors = require('cors');
var path = require('path');
app.use(cors());
var jwt = require('jsonwebtoken');
require('dotenv').config()

const register = require('../backend/src/model/register');
const { RSA_PKCS1_OAEP_PADDING } = require('constants');
app.use(express.json())

app.post('/register', function(req, res) {
    res.header('Access-Control-Allow-Origin', "*") // use of this that from any orgin u are getting the request of productapp then u they can acess
    res.header('Access-Control-Allow-Methds : GET , POST, PATCH , PUT ,DELETE ,OPTIONS');
    console.log(req.body);

    var data1 = {
        name: req.body.data.name,
        email: req.body.data.email,
        pass: register.hashPassword(req.body.data.pass),
        num: req.body.data.num,
        address: req.body.data.address,
        state: req.body.data.state,
        district: req.body.data.district,
        pincode: req.body.data.pincode
    }


    let promise = register.findOne({ email: req.body.data.email })

    promise.then(function(doc) {
        if (doc) {
            res.json({ msg: "already there" })
        } else {
            var data = new register(data1);
            res.json({ msg: "suc" })
            data.save();
        }
    });


});



app.post('/login', function(req, res, next) {
    let promise = register.findOne({ email: req.body.data.email })

    promise.then(function(doc) {
        if (doc) {
            if (doc.isValid(req.body.data.pass)) {
                let token = jwt.sign({ name: doc._id }, 'secret', { expiresIn: '5h' });
                return res.status(200).json(token)
            } else {
                let abc = "Invalid password"
                res.json(abc);
            }
        } else {
            let abc = "User not resgistered"
            res.json(abc);
        }
    });
})


app.listen(process.env.PORT || 2222)