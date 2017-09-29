'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const knex = require('../knex')
// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.post('/users', function(req, res, next){
  const{password, firstName, lastName, email} = req.body
    bcrypt.hash(password, 3, function(err, hash){
      return knex('users')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        hashed_password:hash
      },'*')
      .then(function(data){
        console.log(data);
        let newObj = {
          firstName: data[0].first_name,
          lastName: data[0].last_name,
          email: data[0].email,
          id: data[0].id
        }
        res.send(newObj)
      }).catch(next);
    })
});

module.exports = router;
