# Borrow & Lend

## CS 445 Final Project
### Fall 2025

**Team:** Team 7

**Team Members:** Hoyeon Yoo, Elif Yildirim, Anthony Zheng

## Getting Started

Borrow & Lend is a campus community platform that enables students to share and borrow items with each other. Users can browse items by category, create borrow requests, list items they own, and communicate with other users through an integrated chat system. The platform facilitates resource sharing within the campus community, making it easy to find and borrow items like textbooks, electronics, tools, and more.

## Roadmap

A list of features, functional or non-functional, we would like to add in the future if we had time, i.e. Phase 2 stuff:

- [ ] Item search and filtering
- [ ] User ratings and reviews
- [ ] Image upload for items
- [ ] Mobile app version
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Item recommendations based on user history
- [ ] Email notifications for request updates

## SRS

[document](https://docs.google.com/document/d/1TCH-ScL2ykkAj_Jr7LRWSu7gMRVRalQO0nbkKwskd-8/edit?usp=sharing)

## Prerequisites

* [Docker](https://www.docker.com/) (version 20.10 or higher)
* [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)
* [Node.js](https://nodejs.org/) (version 20 or higher) - for running migrations locally
* [npm](https://www.npmjs.com/) (comes with Node.js)

## Installing

A step by step series of examples that tell you how to get a development env running:

**Step 1: Clone the repository**

```bash
git clone https://github.com/bucs445fall2025/project-team-7.git
cd project-team-7
```

**Step 2: Set up environment variables**

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="mysql://bl_user:bl_pass@mysql:3306/borrowlend"

# JWT Secret (change this to a secure random string)
JWT_SECRET="your-secret-key-here"

# CORS Origin (frontend URL)
CORS_ORIGIN="http://localhost:3000"
```

Create a `.env.frontend` file in the root directory:

```bash
REACT_APP_API_URL=http://localhost:8000
```

**Step 3: Start MySQL database**

```bash
docker-compose up -d mysql
```

**Step 4: Wait for MySQL to be ready**

```bash
sleep 15
```

**Step 5: Run database migrations**

```bash
cd borrow_lend/backend
npx prisma migrate dev
npx prisma generate
cd ../..
```

**Step 6: Start all services**

```bash
docker-compose up -d
```

**Step 7: Verify installation**

Check that all containers are running:

```bash
docker ps
```

You should see three containers: `bl-mysql`, `bl-backend`, and `bl-frontend`.

**Step 8: Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Prisma Studio: http://localhost:5555

You should see the Borrow & Lend homepage at http://localhost:3000 where you can register a new account or sign in.

## Built With

* [Node.js](https://nodejs.org/) - Runtime environment
* [Express](https://expressjs.com/) - Web framework
* [TypeScript](https://www.typescriptlang.org/) - Programming language
* [React](https://reactjs.org/) - UI library (v19.2.0)
* [React Router](https://reactrouter.com/) - Routing (v7.9.3)
* [Prisma](https://www.prisma.io/) - ORM and database toolkit
* [MySQL](https://www.mysql.com/) - Database
* [JWT](https://jwt.io/) - Authentication
* [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing
* [Zod](https://zod.dev/) - Schema validation
* [Helmet](https://helmetjs.github.io/) - Security middleware
* [CORS](https://www.npmjs.com/package/cors) - Cross-origin resource sharing
* [Docker](https://www.docker.com/) - Containerization
* [Docker Compose](https://docs.docker.com/compose/) - Multi-container orchestration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

* CS 445 Course Staff for project guidance
* React and Express communities for excellent documentation
* Prisma team for the amazing ORM tooling
