'use strict';

const express = require('express');
const knex = require('../knex')
// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE

router.get('/favorites', function(req, res, next){
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

module.exports = router;
