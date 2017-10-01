'use strict';

const express = require('express');
const boom = require('boom')
const knex = require('../knex')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-Parser')
const bcrypt = require('bcrypt')
// const SECRET = 'mySecret'

const SECRET = process.env.JWT_KEY
console.log('this is the secret', SECRET);


// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE GET with TOKEN

const auth = function(req, res, next) {
  jwt.verify(req.cookies.token, SECRET, (err, payload) => {
    if (err) {
      return next(boom.create(401, "Unauthorized"))
    }
    console.log("this is the payload", payload);
    req.claim = payload
    console.log('this is the number', req.claim);
    next()
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

router.post('/favorites', auth, function(req, res, next) {
  // console.log('req.claim.user_id')

  const newFav = {
    user_id: req.claim.userId,
    book_id: req.body.bookId
  }

  console.log(newFav.user_id);
  knex('favorites')
    .insert(newFav, '*')
    .where('favorites.book_id', req.query.bookId)
    .then((book) => {
      let newObj = {
        id: book[0].id,
        userId: book[0].user_id,
        bookId: book[0].book_id
      }
      res.send(newObj);
    })
    .catch((err) => {
      next(err);
    });
})
router.get('/favorites/check', auth, function(req, res, next) {
  // let searchQuery = req.query.bookId
  knex('favorites')
    .where('favorites.book_id', req.query.bookId)
    .then((items) => {
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
