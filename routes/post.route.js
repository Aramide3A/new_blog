const express = require('express')
const router = express.Router()
const posts = require('../models/post.model')
const multer  = require('multer')
const upload = multer({ dest: 'public/images' })

//Route to get all posts
router.get('/', async(req, res)=>{
    try {
        const all_posts = await posts.find().select('-body')
        res.send(all_posts)
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching posts' })
    }
})

//Route to create posts
router.post('/',upload.single('image'), async(req, res)=>{
    try {
        const image = req.file ? req.file.path : null
        const {author,title,body,category} = req.body
        const post = new posts({author,title,body,category,image})
        await post.save();
        res.status(201).send(post)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Route to get a specific post
router.get('/:id', async(req, res)=>{
    try {
        const get_post = await posts.findById(req.params.id)
        res.send(get_post)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Route to update post
router.put('/:id', async(req, res)=>{
    try {
        const get_post = await posts.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.send(get_post)
    } catch (error) {
        res.status(400).send(error)
    }
})

//Route to delete post
router.delete('/:id', async(req, res)=>{
    try {
        const get_post = await posts.findByIdAndDelete(req.params.id)
        res.send("Post deleted successfully")
    } catch (error) {
        res.status(400).send(error)
    }
})

//Route to see post by catgeory
router.get('/category/:category', async(req, res)=>{
    try {
        category = req.params.category
        const get_post = await posts.find({category: category}).select('-body')
        res.send(get_post)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router