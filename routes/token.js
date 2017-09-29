'use strict';

const express = require('express');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-Parser')
const SECRET = 'mySecret'
// eslint-disable-next-line new-cap
const router = express.Router();


// YOUR CODE HERE

router.get('/token', function(req, res, next){
console.log("token", req.cookies.token)
    jwt.verify(req.cookies.token, SECRET, (err, payload) => {
      if(err){
        res.send(false)
      }else{
        res.sendt(true)
      }
    })
})



module.exports = router;
