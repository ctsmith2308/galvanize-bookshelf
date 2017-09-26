'use strict';

const express = require('express');
let knex = require('../knex');
// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get('/books', function(req, res, next) {
  knex('books')
    .select('author', 'cover_url as coverUrl', 'description', 'genre', 'id', 'title', 'updated_at as updatedAt', 'created_at as createdAt')
    .orderBy('title', 'asc')
    .then((items) => {
      res.setHeader('Content-Type', 'application/json')
      res.status(200)
      res.send(JSON.stringify(items))
    })
    .catch((err) => next(err))
});

router.get('/books/:id', function(req, res, next){
  let itemsId = req.params.id
  knex('books')
    .select('author', 'cover_url as coverUrl', 'description', 'genre', 'id', 'title', 'updated_at as updatedAt', 'created_at as createdAt')
    .orderBy('title','asc')
    .where('id', itemsId)
    .then((items) => {
      if(items.length <1){
        res.sendStatus(404)
      }
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(items[0]))
    })
    .catch((err) => next(err))

})
module.exports = router;
