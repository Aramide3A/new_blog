const Post = require('../models/post.model');
const User = require('../models/user.model');

const createBlog = async (req, res) => {
    try {
        const { title, description, body, tags } = req.body;
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

        const words = body.split(/\s+/).filter(Boolean).length;
        const reading_time = Math.ceil(words / 200);

        const newPost = await Post.create({
            author: req.user._id,
            title,
            description,
            body,
            tags,
            reading_time
        });

        res.status(201).json({ message: 'Blog successfully created!', data: newPost });

    } catch (err) {
        res.status(500).json({ message: 'Server Error!', error: err });
    }
};

const updateBlog = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

        const { id } = req.params;
        const { title, description, body, tags } = req.body;

        let post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Not found' });

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (body) {
            const words = body.split(/\s+/).filter(Boolean).length;
            post.reading_time = Math.ceil(words / 200);
            post.body = body;
        }
        if (title) post.title = title;
        if (description) post.description = description;
        if (tags) post.tags = tags;

        await post.save();

        res.status(200).json({ message: 'Blog updated!', data: post });

    } catch (err) {
        res.status(500).json({ message: 'Server Error!', error: err });
    }
};

const publishBlog = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

        const { id } = req.params;

        let post = await Post.findById({ _id: id });
        if (!post) return res.status(404).json({ message: 'Not found' });

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        post.state = 'published';
        await post.save();

        res.json({ message: 'Blog published!', data: post });

    } catch (err) {
        res.status(500).json({ message: 'Server Error!', error: err });
    }
};

const deleteBlog = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

        const { id } = req.params;

        let post = await Post.findById({ _id: id });
        if (!post) return res.status(404).json({ message: 'Not found' });

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await post.deleteOne();

        res.json({ message: 'Blog successfully removed!' });

    } catch (err) {
        res.status(500).json({ message: 'Server Error!', error: err });
    }
};

const getUserBlogs = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

        const { page = 1, limit = 20, state } = req.query;

        let filter = { author: req.user._id };
        if (state) filter.state = state;

        const blogs = await Post.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ data: blogs });

    } catch (err) {
        res.status(500).json({ message: 'Server Error!', error: err });
    }
};

const getAllPublished = async (req, res) => {
    try {
        const { page = 1, limit = 20, state, search, sort } = req.query;

        let filter = { state: 'published' };
        if (state && ['draft', 'published'].includes(state)) filter.state = state;

        if (search) {
            filter = {
                $and: [
                    { state: 'published' },
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { tags: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }

        let sortOption = {};

        if (sort && ['read_count', 'reading_time', 'timestamp'].includes(sort)) {
            sortOption[sort] = -1;
        } else {
            sortOption.timestamp = -1;
        }

        const blogs = await Post.find(filter)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ data: blogs });

    } catch (err) {
        res.status(500).json({ message: 'Server Error!', error: err });
    }
};

const getSingle = async (req, res) => {
    try {
        const { id } = req.params;

        let post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Not found' });

        const author = await User.findOne({ _id: post.author }).select('-password');

        post.read_count += 1;
        await post.save();

        res.json({ data: { post, author } });

    } catch (err) {
        res.status(500).json({ message: 'Server Error!', error: err });
    }
};

module.exports = {
    createBlog,
    updateBlog,
    publishBlog,
    deleteBlog,
    getUserBlogs,
    getAllPublished,
    getSingle
};

