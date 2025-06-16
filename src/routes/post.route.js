const express = require('express')
const router = express.Router()
const passport = require('passport')
const {
    createBlog,
    updateBlog,
    publishBlog,
    deleteBlog,
    getUserBlogs,
    getAllPublished,
    getSingle
} = require('../controller/post.controller')


// Public routes
router.get('/posts', getAllPublished)


// Authenticated routes
router.post('/posts', passport.authenticate('jwt', { session: false }), createBlog)
router.get('/posts/my', passport.authenticate('jwt', { session: false }), getUserBlogs)

router.get('/posts/:id', getSingle)
router.patch('/posts/:id', passport.authenticate('jwt', { session: false }), updateBlog)
router.delete('/posts/:id', passport.authenticate('jwt', { session: false }), deleteBlog)
router.post('/posts/:id/publish', passport.authenticate('jwt', { session: false }), publishBlog)


module.exports = router
