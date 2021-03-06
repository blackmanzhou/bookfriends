const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')
const routers = router
  .get('/addfield', bookController.addVisitCountForBook) // test
  .get('/update', bookController.updateBook) // test
  .post('/save', bookController.saveBook)
  .get('/new', bookController.getNewBooks)
  .get('/hot', bookController.getHotBooks)
  .get('/isbn', bookController.getBookInfoByISBN)
  .get('/recommend', bookController.getRecommendBooks)

module.exports = routers
