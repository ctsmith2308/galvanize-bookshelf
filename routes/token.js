'use strict';

const express = require('express');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-Parser')
const knex = require('../knex')
const SECRET = 'mySecret'
const bcrypt = require('bcrypt')
// eslint-disable-next-line new-cap
const router = express.Router();


// YOUR CODE HERE

router.get('/token', function(req, res, next){
    jwt.verify(req.cookies.token, SECRET, (err, payload) => {
      if(err){
        res.send(false)
      }else{
        res.send(true)
      }
    })
})

router.post('/token', function(req, res, next) {
  if (!req.body.password || !req.body.email) res.sendStatus(400)
  let user;
  knex('users')
    .where({
      email: req.body.email
    },'*')
    .first()
    // .returning('*')
    .then(function(data) {
      if(!data){
        res.status(400)
        res.setHeader('Content-type' ,'text/plain')
        res.send('Bad email or password')
      }
      else if (bcrypt.compareSync(req.body.password, data.hashed_password)) {
        let token = jwt.sign(data.id, SECRET);
        res.cookie('token', token, {httpOnly:true} )
        res.send({id: data.id, email: data.email, firstName: data.first_name, lastName: data.last_name})
      } else {
        res.status(400)
        res.setHeader('Content-type' ,'text/plain')
        res.send('Bad email or password')
      }
    }).catch(next)
})



module.exports = router;
