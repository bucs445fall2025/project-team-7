# Borrow & Lend

**CS 445 Final Project**  
**Fall 2025**

**Team:** Team 7  
**Team Members:** Hoyeon Yoo, Elif Yildirim, Anthony Zheng

## Project Overview

Borrow & Lend is a campus community platform that enables students to share and borrow items with each other. Users can browse items by category, create borrow requests, list items they own, and communicate with other users through an integrated chat system. The platform facilitates resource sharing within the campus community, making it easy to find and borrow items like textbooks, electronics, tools, and more.

## Class Relationship Diagram

The following diagram shows the database schema and relationships between entities:

```
┌─────────────┐
│    User     │
│─────────────│
│ id (PK)     │◄────────┐
│ email       │         │
│ name        │         │
│ password    │         │
│ createdAt   │         │
│ updatedAt   │         │
└─────────────┘         │
       │                │
       │ 1              │
       │                │
       │ *              │
       │                │
┌──────▼──────────┐     │
│     Item        │     │
│─────────────────│     │
│ id (PK)         │     │
│ title           │     │
│ description     │     │
│ imageUrl        │     │
│ location        │     │
│ isAvailable     │     │
│ ownerId (FK)────┼─────┘
│ createdAt       │
│ updatedAt       │
└─────────────────┘
       │ 1
       │
       │ *
       │
┌──────▼──────────────┐
│  BorrowRequest      │
│─────────────────────│
│ id (PK)             │
│ itemId (FK)─────────┘
│ categoryId (FK)─────┐
│ borrowerId (FK)─────┼──┐
│ title               │  │
│ description         │  │
│ message             │  │
│ startDate           │  │
│ endDate             │  │
│ status              │  │
│ createdAt           │  │
│ updatedAt           │  │
└─────────────────────┘  │
       │ 1               │
       │                 │
       │ *               │
       │                 │
┌──────▼──────────────┐ │
│   Conversation      │ │
│─────────────────────│ │
│ id (PK)             │ │
│ user1Id (FK)────────┼──┘
│ user2Id (FK)────────┼──┐
│ requestId (FK)──────┘  │
│ createdAt             │ │
│ updatedAt             │ │
└───────────────────────┘ │
       │ 1                │
       │                  │
       │ *                │
       │                  │
┌──────▼──────────────┐  │
│     Message         │  │
│─────────────────────│  │
│ id (PK)             │  │
│ conversationId (FK)─┘  │
│ senderId (FK)──────────┘
│ receiverId (FK)─────┐
│ content             │
│ read                │
│ createdAt           │
└─────────────────────┘

┌──────────────┐
│   Category   │
│──────────────│
│ id (PK)      │◄────────┐
│ name (UNIQUE)│         │
│ icon         │         │
│ description  │         │
│ createdAt    │         │
│ updatedAt    │         │
└──────────────┘         │
       │ 1               │
       │                 │
       │ *               │
       │                 │
┌──────▼──────────┐     │
│    InfoBox      │     │
│─────────────────│     │
│ id (PK)         │     │
│ label           │     │
│ description     │     │
│ categoryId (FK)─┼─────┘
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

**Relationships:**
- **User** has many **Items** (one-to-many)
- **User** has many **BorrowRequests** as borrower (one-to-many)
- **Item** has many **BorrowRequests** (one-to-many, optional)
- **Category** has many **BorrowRequests** (one-to-many)
- **Category** has many **InfoBoxes** (one-to-many)
- **BorrowRequest** can have many **Conversations** (one-to-many, optional)
- **Conversation** has two **Users** (user1 and user2, many-to-many through Conversation)
- **Conversation** has many **Messages** (one-to-many)
- **Message** has a **sender** and **receiver** (both are Users, many-to-many through Message)

## Roadmap

A list of features, functional or non-functional, we would like to add in the future if we had time, i.e. Phase 2 stuff:

- Item search and filtering
- User ratings and reviews
- Image upload for items
- Mobile app version
- Admin dashboard
- Analytics and reporting
- Item recommendations based on user history
- Email notifications for request updates

## SRS Document

See `REQUIREMENTS_ANALYSIS.md` for the Software Requirements Specification document, or view online: https://docs.google.com/document/d/1TCH-ScL2ykkAj_Jr7LRWSu7gMRVRalQO0nbkKwskd-8/edit?usp=sharing

## Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (usually included with Docker Desktop)
  - Modern Docker Desktop (v4.0+) uses `docker compose` (with space)
  - Older versions use `docker-compose` (with hyphen)
  - Check your version: `docker compose version` or `docker-compose --version`
- **Node.js** (version 20 or higher) - for running migrations locally
- **npm** (comes with Node.js)

### Important: Prisma Version

This project uses Prisma 6.17.1. If you have Prisma 7.x installed globally, you may encounter errors. To fix:

```bash
cd borrow_lend/backend
npm install prisma@6.17.1 @prisma/client@6.17.1 --save-exact
```

**Note:** The package.json already specifies Prisma 6.17.1, so running `npm install` will automatically install the correct version.

## Installing

A step-by-step series of examples that tell you how to get a development environment running:

### Step 1: Clone the repository

```bash
git clone https://github.com/bucs445fall2025/project-team-7.git
cd project-team-7
```

### Step 2: Start all services (Recommended - Docker Compose)

The easiest way to get started is using Docker Compose, which handles everything automatically:

```bash
# Modern Docker Desktop (v4.0+)
docker compose up -d

# OR older versions
docker-compose up -d
```

**Note:** If `docker compose` doesn't work, try `docker-compose` (with hyphen).

**Note:** On first run, database migrations and seed data will run automatically. This ensures that when you open the project on another PC, the database schema and sample data will be ready.

### Alternative: Manual Setup

If you prefer to set up manually:

#### Step 2a: Set up environment variables

Create a `.env` file in the `borrow_lend/backend` directory:

```env
# Database
DATABASE_URL="mysql://appuser:apppassword@mysql:3306/borrow_lend?charset=utf8mb4"

# JWT Secret (change this to a secure random string)
JWT_SECRET="your-secret-key-change-in-production"

# CORS Origin (frontend URL)
CORS_ORIGIN="http://localhost:3000"
```

Create a `.env` file in the `borrow_lend/frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

#### Step 2b: Start MySQL database

```bash
docker compose up -d mysql
```

#### Step 2c: Wait for MySQL to be ready

```bash
sleep 15
```

#### Step 2d: Run database migrations

```bash
cd borrow_lend/backend
npx prisma migrate deploy
npx prisma generate
cd ../..
```

#### Step 2e: Start all services

```bash
docker compose up -d
```

### Step 3: Verify installation

Check that all containers are running:

```bash
docker compose ps
```

You should see containers: `borrow-lend-mysql`, `borrow-lend-backend`, `borrow-lend-frontend`, and `borrow-lend-seed` (if seed ran).

### Step 4: Access the application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Prisma Studio:** http://localhost:5555
- **MySQL Database:** localhost:3306

You should see the Borrow & Lend homepage at http://localhost:3000 where you can register a new account or sign in.

## Services and Ports

- **Frontend (React):** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Prisma Studio:** http://localhost:5555
- **MySQL Database:** localhost:3306

## Database

Database data is permanently stored in a Docker volume:
- Volume name: `project-team-7_mysql_data`
- Data will **NOT BE LOST** when you run `docker compose down`

**Important:** 
- The `mysql-data/` folder is **NOT needed** and is ignored by git
- If you download the project as a ZIP file, the `mysql-data/` folder will **NOT be included** (and it shouldn't be)
- Docker automatically creates a volume for MySQL data storage when you run `docker compose up`
- You can safely delete the `mysql-data/` folder if it exists - Docker will recreate it automatically

### To completely delete the database:

```bash
docker compose down -v  # ⚠️ WARNING: This command deletes all data!
```

## Screenshots

### Final GUI

#### Login/Registration Page
![Login Page](etc/screenshots/login.png)
*User login and registration interface*

#### Homepage with Categories
![Homepage](etc/screenshots/homepage.png)
*Main page displaying available categories*

#### Category Detail Page
![Category Detail](etc/screenshots/category-detail.png)
*Items displayed within a specific category*

#### Borrow Request Form
![Request Form](etc/screenshots/request-form.png)
*Form for creating a new borrow request*

#### Chat Interface
![Chat](etc/screenshots/chat.png)
*Messaging interface between users*

#### User Profile Page
![Profile](etc/screenshots/profile.png)
*User profile displaying items and requests*

#### My Requests Page
![My Requests](etc/screenshots/my-requests.png)
*User's borrow requests management page*


## Default Users

- **Demo User:** demo@binghamton.edu / password123 (automatically created from seed)

## Development

### View backend logs:

```bash
docker compose logs -f backend
```

### View frontend logs:

```bash
docker compose logs -f frontend
```

### Connect to MySQL:

```bash
docker compose exec mysql mysql -uappuser -papppassword borrow_lend
```

### Start Prisma Studio:

Prisma Studio is already running at http://localhost:5555. If you need to start it manually:

```bash
docker compose exec backend sh -c "cd /app && DATABASE_URL='mysql://appuser:apppassword@mysql:3306/borrow_lend?charset=utf8mb4' npx prisma studio --hostname 0.0.0.0 --port 5555"
```

## Project Structure

```
project-team-7/
├── borrow_lend/
│   ├── frontend/      # React frontend
│   └── backend/       # Node.js/Express backend
├── docker-compose.yml # Docker configuration
└── README.md
```

## Post-Installation Check

1. Check that all services are running:
   ```bash
   docker compose ps
   ```

2. Open Frontend: http://localhost:3000

3. Test Backend API:
   ```bash
   curl http://localhost:8000/api/categories
   ```

## Troubleshooting

### Services won't start:

```bash
docker compose down
docker compose up -d --build
```

### Database connection issue:

```bash
docker compose restart mysql
docker compose restart backend
```

### Schema mismatch / Seed failed error:

If you encounter "schema mismatch" or "seed failed" errors:

```bash
# Stop all services
docker compose down

# Clean volumes (reset database)
docker compose down -v

# Restart (migrations and seed will run automatically)
docker compose up -d --build

# Check seed logs
docker compose logs seed
```

### Frontend can't connect to backend:

If the frontend shows "Failed to connect to server" or API errors:

1. **Check if backend is running:**
   ```bash
   docker compose ps backend
   curl http://localhost:8000/health
   ```

2. **Check backend logs:**
   ```bash
   docker compose logs backend
   ```

3. **Rebuild frontend with correct API URL:**
   ```bash
   docker compose up -d --build frontend
   ```

4. **Verify all services are running:**
   ```bash
   docker compose ps
   ```
   All services should show "Up" status.

### Services won't start on another computer:

If services fail to start on a different computer:

1. **Make sure Docker is running:**
   ```bash
   docker --version
   # Modern Docker Desktop (v4.0+)
   docker compose version
   # OR older versions
   docker-compose --version
   ```

2. **Clean start:**
   ```bash
   docker compose down -v
   docker compose up -d --build
   ```

3. **Check logs for errors:**
   ```bash
   docker compose logs
   ```

4. **Verify ports are not in use:**
   ```bash
   # Check if ports 3000, 8000, 3306, 5555 are available
   lsof -i :3000
   lsof -i :8000
   lsof -i :3306
   lsof -i :5555
   ```

### Clean volumes (ALL DATA WILL BE DELETED):

```bash
docker compose down -v
```

## Built With

This project uses the following technologies and libraries:

- **Node.js** (v20+) - JavaScript runtime environment [[1]](https://nodejs.org/)
- **Express** (v4.x) - Web framework for Node.js [[2]](https://expressjs.com/)
- **TypeScript** (v5.x) - Typed superset of JavaScript [[3]](https://www.typescriptlang.org/)
- **React** (v19.2.0) - UI library for building user interfaces [[4]](https://react.dev/)
- **React Router** (v7.9.3) - Declarative routing for React [[5]](https://reactrouter.com/)
- **Prisma** (v6.17.1) - Next-generation ORM and database toolkit [[6]](https://www.prisma.io/)
- **MySQL** (v8.0) - Relational database management system [[7]](https://www.mysql.com/)
- **jsonwebtoken** - JWT implementation for authentication [[8]](https://github.com/auth0/node-jsonwebtoken)
- **bcryptjs** - Password hashing library [[9]](https://github.com/dcodeIO/bcrypt.js)
- **Zod** - TypeScript-first schema validation [[10]](https://zod.dev/)
- **Helmet** - Security middleware for Express [[11]](https://helmetjs.github.io/)
- **CORS** - Express middleware for enabling CORS [[12]](https://github.com/expressjs/cors)
- **Docker** - Containerization platform [[13]](https://www.docker.com/)
- **Docker Compose** - Multi-container Docker application orchestration [[14]](https://docs.docker.com/compose/)

### References

1. Node.js: https://nodejs.org/
2. Express.js: https://expressjs.com/
3. TypeScript: https://www.typescriptlang.org/
4. React: https://react.dev/
5. React Router: https://reactrouter.com/
6. Prisma: https://www.prisma.io/
7. MySQL: https://www.mysql.com/
8. jsonwebtoken: https://github.com/auth0/node-jsonwebtoken
9. bcryptjs: https://github.com/dcodeIO/bcrypt.js
10. Zod: https://zod.dev/
11. Helmet: https://helmetjs.github.io/
12. CORS: https://github.com/expressjs/cors
13. Docker: https://www.docker.com/
14. Docker Compose: https://docs.docker.com/compose/

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acceptance Test Plan (ATP)

### Test Environment Setup
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Database:** MySQL running in Docker container
- **Test User:** demo@binghamton.edu / password123

### Test Cases

#### TC-001: User Registration
**Objective:** Verify that a new user can register with valid credentials.

**Steps:**
1. Navigate to http://localhost:3000
2. Click "Sign Up" or "Register"
3. Enter email: `test@binghamton.edu`
4. Enter name: `Test User`
5. Enter password: `testpassword123`
6. Click "Register"

**Expected Result:** User is successfully registered and redirected to login page or homepage.

**Status:** ✅ Pass

---

#### TC-002: User Login
**Objective:** Verify that a registered user can log in with correct credentials.

**Steps:**
1. Navigate to http://localhost:3000
2. Enter email: `demo@binghamton.edu`
3. Enter password: `password123`
4. Click "Login"

**Expected Result:** User is authenticated and redirected to homepage. JWT token is stored.

**Status:** ✅ Pass

---

#### TC-003: View Categories
**Objective:** Verify that categories are displayed on the homepage.

**Steps:**
1. Log in as demo user
2. Navigate to homepage

**Expected Result:** At least 10 categories are displayed (Electronics, Books, Sports & Fitness, etc.) with icons and descriptions.

**Status:** ✅ Pass 

---

#### TC-004: Browse Items by Category
**Objective:** Verify that users can view items filtered by category.

**Steps:**
1. Log in as demo user
2. Click on a category (e.g., "Electronics")
3. View items in that category

**Expected Result:** Items belonging to the selected category are displayed with title, description, and location.

**Status:** ✅ Pass 

---

#### TC-005: Create Borrow Request
**Objective:** Verify that users can create a borrow request.

**Steps:**
1. Log in as demo user
2. Navigate to a category or item
3. Click "Request to Borrow" or fill out request form
4. Enter title: `Graphing Calculator`
5. Enter description: `Need for math exam`
6. Select start and end dates
7. Submit request

**Expected Result:** Request is created with status "PENDING" and appears in user's requests list.

**Status:** ✅ Pass / ❌ Fail

---


#### TC-005: Start Chat Conversation
**Objective:** Verify that users can start a chat conversation.

**Steps:**
1. Log in as demo user
2. Navigate to a borrow request or user profile
3. Click "Message" or "Chat"
4. Send a message: `Hello, I'm interested in borrowing this item`

**Expected Result:** Conversation is created (if new) or existing conversation is opened. Message is sent and displayed.

**Status:** ✅ Pass 

---

#### TC-006: Send and Receive Messages
**Objective:** Verify that users can send and receive messages in a conversation.

**Steps:**
1. Log in as user A
2. Open existing conversation with user B
3. Send message: `When can I pick up the item?`
4. Log out and log in as user B
5. Open conversation with user A
6. View received message
7. Send reply: `Tomorrow at 2 PM works for me`

**Expected Result:** Both users can see all messages in chronological order. Messages are marked as read when viewed.

**Status:** ✅ Pass 

---

#### TC-007: View User Profile
**Objective:** Verify that users can view their own profile.

**Steps:**
1. Log in as demo user
2. Navigate to "Profile" or user menu
3. View profile information

**Expected Result:** Profile displays user email, name, and account creation date. User can see their items and requests.

**Status:** ✅ Pass 

---

#### TC-008: Data Persistence
**Objective:** Verify that data persists after container restart.

**Steps:**
1. Create a new item or request
2. Stop containers: `docker compose down`
3. Start containers: `docker compose up -d`
4. Log in and verify data still exists

**Expected Result:** All data (users, items, requests, messages) persists after restart. Database volume maintains data.

**Status:** ✅ Pass 

---

#### TC-009: Authentication Required
**Objective:** Verify that protected routes require authentication.

**Steps:**
1. Log out or clear authentication token
2. Try to access protected route (e.g., directly navigate to `/home` or `/profile`)
3. Attempt API call without token

**Expected Result:** User is redirected to login page. API returns 401 Unauthorized.

**Status:** ✅ Pass 

---

#### TC-010: Invalid Login Credentials
**Objective:** Verify that invalid credentials are rejected.

**Steps:**
1. Navigate to login page
2. Enter email: `demo@binghamton.edu`
3. Enter incorrect password: `wrongpassword`
4. Click "Login"

**Expected Result:** Error message displayed: "Invalid email or password". User is not authenticated.

**Status:** ✅ Pass 

---

#### TC-011: Database Seed Data
**Objective:** Verify that seed data is loaded correctly.

**Steps:**
1. Start fresh: `docker compose down -v`
2. Start services: `docker compose up -d`
3. Wait for seed to complete
4. Log in as demo user
5. Verify categories exist
6. Verify demo items exist

**Expected Result:** 
- Demo user exists: `demo@binghamton.edu`
- 10 categories are created
- At least 2 demo items exist

**Status:** ✅ Pass 

---

### Test Summary

| Test Case | Description | Status | 
|-----------|------------|----------
| TC-001 | User Registration | w | 
| TC-002 | User Login | w | 
| TC-003 | View Categories | w | 
| TC-004 | Browse Items by Category | w |
| TC-005 | Create Borrow Request | w | 
| TC-006 | Start Chat Conversation | w | 
| TC-007 | Send and Receive Messages | w | 
| TC-008 | View User Profile | w | 
| TC-009 | Data Persistence | w | 
| TC-010 | Invalid Login Credentials | w | 
| TC-011 | Database Seed Data | w | 

**Total Test Cases:** 11  
**Passed:** 11 
**Failed:** 0 
**Pass Rate:** 100%

## Acknowledgments

- CS 445 Course Staff for project guidance
- React and Express communities for excellent documentation
- Prisma team for the amazing ORM tooling
