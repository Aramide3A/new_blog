const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index'); // your Express App
const User = require('../src/models/user.model'); // User should have first_name, last_name, email, password
const Post = require('../src/models/post.model'); // Post should have author as ObjectId
require('dotenv').config();

describe('POST API Tests', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Clear previous data first
        await User.deleteMany({});
        await Post.deleteMany({});

        // create a test user first
        const user = await User.create({ 
            first_name: "Test", 
            last_name: "User", 
            email: "test@example.com", 
            password: "hashedPass" 
        });

        userId = user._id;

        // Sign JWT with email
        token = jwt.sign({ email: 'test@example.com' }, process.env.SECRET_KEY, { expiresIn:'1h'})
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    it('should create a new draft post when authenticated', async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Test Title', body: 'Some content here...' });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.state).toBe('draft');
        expect(res.body.data.author).toEqual(userId.toString()); // should match the authenticated user's id
    });

    it('should publish a draft post when authenticated and owner', async () => {
        const post = await Post.create({ author: userId, title:'To Publish', body:'...' });

        const res = await request(app)
            .post(`/api/posts/${post._id}/publish`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.state).toBe('published');
    });

    it('should not publish a post if not owner', async () => {
        // create another user
        const another = await User.create({ 
            first_name:'Another', 
            last_name:'User', 
            email:'another@example.com', 
            password:'hashed123' 
        });
        const anotherToken = jwt.sign({ email:'another@example.com' }, process.env.SECRET_KEY, { expiresIn:'1h' });

        const post = await Post.create({ author: userId, title:'To Publish 2', body:'...' });

        const res = await request(app)
            .post(`/api/posts/${post._id}/publish`)
            .set('Authorization', `Bearer ${anotherToken}`);

        expect(res.statusCode).toBe(403);
    });

    it('should view a single post and increment read_count', async () => {
        const post = await Post.create({ author: userId, title:'To View', body:'...' , state:'published', read_count: 0 });

        const res = await request(app).get(`/api/posts/${post._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.post.read_count).toBe(1);
    });

    it('should paginate blogs and allow search by title', async () => {
        // create 5 blogs
        for (let i = 0; i < 5; i++) {
            await Post.create({ author: userId, title: `Searchable Title ${i}` , body:'...' , state:'published'})
        }
        const res = await request(app).get('/api/posts?search=Searchable');

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should allow owner to delete their post', async () => {
        const post = await Post.create({ author: userId, title:'To Delete', body:'...' });

        const res = await request(app)
            .delete(`/api/posts/${post._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    it('should paginate and filter by state for owner blogs', async () => {
        // create a few blogs in different states
        await Post.create({ author: userId, title:'Owner Draft 1', body:'...' , state:'draft'})
        await Post.create({ author: userId, title:'Owner Pub 1', body:'...' , state:'published'})

        const res = await request(app)
            .get('/api/posts/my?state=published')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        res.body.data.forEach(blog => {
            expect(blog.state).toBe('published');
        })
    });

});
