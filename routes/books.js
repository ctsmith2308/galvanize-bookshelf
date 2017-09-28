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

router.get('/books/:id', function(req, res, next) {
  let itemsId = req.params.id
  knex('books')
    .select('author', 'cover_url as coverUrl', 'description', 'genre', 'id', 'title', 'updated_at as updatedAt', 'created_at as createdAt')
    .orderBy('title', 'asc')
    .where('id', itemsId)
    .then((items) => {
      if (items.length < 1) {
        res.sendStatus(404)
      }
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(items[0]))
    })
    .catch((err) => next(err))
})



router.post('/books', (req, res, next) => {
  // COMMENT: Makes sure that the information that you want is in the
  // COMMENT: request body.

  knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }, '*')
    .then((book) => {
      const newObj = {
        id: book[0].id,
        title: book[0].title,
        author: book[0].author,
        genre: book[0].genre,
        description: book[0].description,
        coverUrl: book[0].cover_url
      }
      res.send(newObj);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', function(req, res, next) {
  const id = req.params.id

  const {
    description,
    author,
    genre,
    title,
    coverUrl
  } = req.body

  let newObj = {}

  if (author) {
    newObj.author = author
  }
  if (genre) {
    newObj.genre = genre
  }
  if (title) {
    newObj.title = title
  }
  if (coverUrl) {
    newObj.cover_url = coverUrl
  }
  if (description) {
    newObj.description = description
  }
  return knex('books')
    .select()
    .where('id', id)
    .then((rowsAffected) => {
      if (!rowsAffected) {
        return res.sendStatus(404)
      }
      knex('books')
        .update(newObj)
        .where('id', id)
        .returning('*')
        .then((data) => {
          let newBook = {
            id: data[0].id,
            author: data[0].author,
            genre: data[0].genre,
            title: data[0].title,
            coverUrl: data[0].cover_url,
            description: data[0].description
          }
          res.send(newBook)
        })
        .catch((err) => next(err))
    })
})


// router.delete('/books/:id', function(req, res, next) {
//   let delItem = req.params.id
//   knex('books')
//     .del()
//     .where('id', delItem)
//     .then((rowsAffected) => {
//       if (rowsAffected !== 1) {
//         return res.sendStatus(404)
//       }
//       console.log('you deleted', delItem)
//       console.log(rowsAffected)
//       res.setHeader('Content-Type', 'application/json')
//       res.send(JSON.stringify(rowsAffected[0]))
//
//       // res.sendStatus(200)
//     })
//     .catch((err) => next(err))
// })



router.delete('/books/:id', (req, res, next) => {
  let book;

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }
      book = row;
      return knex('books')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete book.id;
      let deletedBook = {
        author: book.author,
        genre: book.genre,
        title: book.title,
        coverUrl: book.cover_url,
        description: book.description
      }
      res.send(deletedBook);
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;
