'use strict';

const express = require('express');
const boom = require('boom')
const knex = require('../knex')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-Parser')
const bcrypt = require('bcrypt')
const SECRET = 'mySecret'


// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE GET with TOKEN

const auth = function(req, res, next) {
  jwt.verify(req.cookies.token, SECRET, (err, payload) => {
      if (err) {
        return next(boom.create(401, "Unauthorized"))
      } else {
        req.claim = payload
        next()
      }
    })
  }

router.get('/favorites', auth, function(req, res, next) {
      knex('favorites')
        .join('books', 'favorites.book_id', '=', 'books.id')
        .select('books.id', 'genre', 'title', 'author', 'description', 'cover_url as coverUrl', 'book_id as bookId', 'user_id as userId', 'books.updated_at as updatedAt', 'books.created_at as createdAt')
        .orderBy('id', 'asc')
        .then((items) => {
          res.setHeader('Content-Type', 'application/json')
          res.status(200)
          res.send(JSON.stringify(items))
        })
        .catch((err) => next(err))
})

router.get('/favorites/check', auth, function(req, res, next){
  // let searchQuery = req.query.bookId
console.log(req.claim);
  knex('favorites')

    // .where('favorites.user_id', req.claim.userId)
    .where('favorites.book_id', req.query.bookId)
    .then((items) => {
      console.log(items)
      if (items.length) {
        res.send(true)
      } else {
        res.send(false)
      }
    })
    .catch((err) => {
      next(err)
    })
})



module.exports = router;
