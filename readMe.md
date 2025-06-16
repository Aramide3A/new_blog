# Blog API

A simple RESTful API for a blogging platform featuring user authentication and complete post management.

---

## Core Features

* **User Authentication:** JWT-based signup and login.
* **Post Management:** Full CRUD (Create, Read, Update, Delete) for posts.
* **Post States:** Posts can be in `draft` or `published` states.
* **Advanced Querying:** Paginate, search (by author, title, tags), and order results.
* **Ownership:** Users can only edit, publish, or delete their own posts.

---

## Setup

1.  **Clone & Install:**
    ```bash
    git clone <your-repo-url>
    cd <repo-folder>
    npm install
    ```

2.  **Environment:**
    Create a `.env` file in the root directory and add your `PORT`, `MONGO_URI`, and `JWT_SECRET`.

3.  **Run Server:**
    ```bash
    npm start
    ```

---

## API Endpoints

All routes are prefixed with `/api`.

| Method | Endpoint              | Description                                        | Auth Required |
| :----- | :-------------------- | :------------------------------------------------- | :------------ |
| `POST` | `/api/auth/register`        | Register a new user.                               | No            |
| `POST` | `/api/auth/login`         | Log in and receive a JWT.                          | No            |
| `GET`  | `/api/posts`              | Get a paginated/searchable list of **published** posts. | No            |
| `GET`  | `/api/posts/:id`          | Get a single post by ID. Increments `read_count`.  | No            |
| `POST` | `/api/posts`              | Create a new post (saved as `draft`).              | **Yes** |
| `GET`  | `/api/posts/my`           | Get a list of the current user's posts.            | **Yes** |
| `PATCH`| `/api/posts/:id`          | Update a user's own post.                          | **Yes** |
| `DELETE`| `/api/posts/:id`         | Delete a user's own post.                          | **Yes** |
| `POST` | `/api/posts/:id/publish`  | Change a post's state from `draft` to `published`. | **Yes** |

---

## Running Tests

```bash
npm test
