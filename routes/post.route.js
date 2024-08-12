const express = require('express')
const router = express.Router()
const posts = require('../models/post.model')
const multer  = require('multer')
const path = require('path');
const upload = multer({ dest: 'public/images' })

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id: 
 *           type: string
 *           description: Auto Generated Id by database
 *         author:
 *           type: string
 *         image:
 *           type: string
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         category:
 *           type: string
 *           enum: [Automobile, Technology, Health]
*/

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all the posts
 *     description: Retrieve a list of all posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: An error occurred
*/
//Route to get all posts
router.get('/', async(req, res)=>{
    try {
        const all_posts = await posts.find().select('-body')
        res.send(all_posts)
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching posts' })
    }
})

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create New posts and add to database
 *     requestBody:
 *      required: True
 *      content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Post'  
 *     responses:
 *       200:
 *         description: Returns post that was created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: An error occurred
*/
//Route to create posts
router.post('/',upload.single('image'), async(req, res)=>{
    try {
        const image = req.file ? path.join('images', req.file.filename) : null
        const {author,title,body,category} = req.body
        const post = new posts({author,title,body,category,image})
        await post.save();
        res.status(201).send(post)
    } catch (error) {
        res.status(500).send(error)
    }
})

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a specific post
 *     description: Retrieve a particular post with all its contents
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to return.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A specific posts
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: An error occurred
*/
//Route to get a specific post
router.get('/:id', async(req, res)=>{
    try {
        const get_post = await posts.findById(req.params.id)
        res.send(get_post)
    } catch (error) {
        res.status(500).send(error)
    }
})

//Route to update post
router.put('/:id', async(req, res)=>{
    try {
        const get_post = await posts.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.send(get_post)
    } catch (error) {
        res.status(500).send(error)
    }
})

//Route to delete post
router.delete('/:id', async(req, res)=>{
    try {
        const get_post = await posts.findByIdAndDelete(req.params.id)
        res.send("Post deleted successfully")
    } catch (error) {
        res.status(500).send(error)
    }
})

/**
 * @swagger
 * /api/posts/category/{catgerory}:
 *   get:
 *     summary: Get all post for a category
 *     description: Retrieve all the posts under a particular category
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         description: The category of the posts to return.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A specific category's posts
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: An error occurred
*/
//Route to see post by catgeory
router.get('/category/:category', async(req, res)=>{
    try {
        category = req.params.category
        const get_post = await posts.find({category: category})
        res.send(get_post)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router