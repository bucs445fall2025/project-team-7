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

### Step-by-Step Instructions to Run Program and Show All Working Features

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open terminal and navigate to project directory | Terminal is in project-team-7 directory |
| 2 | Run `docker compose up -d` | All containers start (mysql, backend, frontend, seed) |
| 3 | Wait 30 seconds for services to initialize | Seed completes, database is populated |
| 4 | Open web browser | Browser window opens |
| 5 | Navigate to http://localhost:3000 | Login page loads and displays |
| 6 | Observe login page UI | Login form with email and password fields is visible |
| 7 | Enter email: `demo@binghamton.edu` | Email field is filled with demo email |
| 8 | Enter password: `password123` | Password field is filled (characters are hidden) |
| 9 | Click "Login" button | User is authenticated and redirected to homepage |
| 10 | Observe homepage loads | Homepage displays with navigation menu |
| 11 | View categories section | At least 10 categories are displayed (Electronics, Books, Sports & Fitness, Clothing & Accessories, Home & Living, Tools & Equipment, Transportation, Entertainment, School Supplies, Other) |
| 12 | Observe category icons | Each category displays an icon/emoji |
| 13 | Observe category descriptions | Each category shows a description text |
| 14 | Click on "Electronics" category | Category detail page loads |
| 15 | View items in Electronics category | Items list displays (may include demo items like "Graphing Calculator") |
| 16 | Observe item details | Each item shows title, description, and location |
| 17 | Click browser back button | Return to homepage |
| 18 | Click on "Books" category | Category detail page loads for Books |
| 19 | View items in Books category | Items list displays (may be empty or have items) |
| 20 | Click browser back button | Return to homepage |
| 21 | Click on "Request" or "Create Request" button/link | Request form page loads |
| 22 | Select a category from dropdown | Category is selected (e.g., "Electronics") |
| 23 | Enter request title: `Graphing Calculator` | Title field is filled |
| 24 | Enter request description: `Need for math exam` | Description field is filled |
| 25 | Select start date from date picker | Start date is selected |
| 26 | Select end date from date picker | End date is selected |
| 27 | Click "Submit" or "Create Request" button | Request is created successfully |
| 28 | Observe success message or redirect | Confirmation message appears or page redirects |
| 29 | Navigate to "My Requests" page | My Requests page loads |
| 30 | View created request in list | Request appears in list with status "PENDING" |
| 31 | Observe request details | Request shows title, description, dates, and status |
| 32 | Click on "Profile" or user menu | Profile page loads |
| 33 | View profile information | Profile displays user email (demo@binghamton.edu), name, and account details |
| 34 | Observe user's items section | Items owned by user are displayed (may include demo items) |
| 35 | Observe user's requests section | User's borrow requests are displayed |
| 36 | Navigate to homepage | Return to homepage |
| 37 | Click on "Chat" or "Messages" button/link | Chat/Messages page loads |
| 38 | View conversations list | List of conversations displays (may be empty or show existing conversations) |
| 39 | Click on a conversation or "New Message" | Chat interface opens |
| 40 | Type message: `Hello, I'm interested in borrowing this item` | Message text appears in input field |
| 41 | Click "Send" button | Message is sent and appears in chat window |
| 42 | Observe message in chat | Sent message displays with timestamp |
| 43 | Navigate back to homepage | Return to homepage |
| 44 | Click "Logout" button | User is logged out |
| 45 | Observe redirect to login page | Login page displays again |
| 46 | Try to navigate directly to http://localhost:3000/home | User is redirected to login page (protected route) |
| 47 | Enter incorrect email: `wrong@binghamton.edu` | Email field is filled |
| 48 | Enter password: `password123` | Password field is filled |
| 49 | Click "Login" button | Error message displays: "Invalid email or password" |
| 50 | Clear email and password fields | Fields are empty |
| 51 | Enter correct email: `demo@binghamton.edu` | Email field is filled |
| 52 | Enter incorrect password: `wrongpassword` | Password field is filled |
| 53 | Click "Login" button | Error message displays: "Invalid email or password" |
| 54 | Clear fields and enter correct credentials | Fields are filled with correct demo credentials |
| 55 | Click "Login" button | User successfully logs in |
| 56 | Verify homepage loads | Homepage displays correctly |
| 57 | Open new browser tab | New tab opens |
| 58 | Navigate to http://localhost:8000/api/categories | Backend API endpoint responds |
| 59 | Observe JSON response | JSON data with categories array is displayed |
| 60 | Verify categories in response | Response contains at least 10 category objects with name, icon, description |
| 61 | Close API tab and return to application | Application tab is active |
| 62 | Navigate to different category pages | Test browsing multiple categories |
| 63 | Verify all categories are accessible | Each category page loads correctly |
| 64 | Test creating another request | Create a second borrow request |
| 65 | Verify request appears in My Requests | Both requests appear in the list |
| 66 | Test chat functionality | Send multiple messages in chat |
| 67 | Verify messages persist | Messages remain visible after page refresh |
| 68 | Open browser developer console (F12) | Developer tools open |
| 69 | Check for console errors | No critical errors are displayed |
| 70 | Close developer console | Console is closed |
| 71 | Stop containers: `docker compose down` | Containers stop gracefully |
| 72 | Start containers again: `docker compose up -d` | Containers restart |
| 73 | Wait 30 seconds | Services initialize |
| 74 | Navigate to http://localhost:3000 | Application loads |
| 75 | Log in with demo credentials | User successfully logs in |
| 76 | Verify data persists | Previously created requests and data still exist |
| 77 | Navigate to My Requests | Requests page loads |
| 78 | Verify requests are still present | All previously created requests are displayed |
| 79 | Navigate to Chat | Chat page loads |
| 80 | Verify messages persist | Previously sent messages are still visible |
| 81 | Test complete - all features verified | Application demonstrates all working features |

### Test Summary

| Feature | Tested | Status |
|---------|--------|--------|
| Application Startup | Steps 1-3 | ✅ Pass |
| User Login | Steps 5-9 | ✅ Pass |
| Homepage Display | Steps 10-13 | ✅ Pass |
| Category Browsing | Steps 14-20 | ✅ Pass |
| Item Display | Steps 15-16 | ✅ Pass |
| Create Borrow Request | Steps 21-28 | ✅ Pass |
| View My Requests | Steps 29-31 | ✅ Pass |
| User Profile | Steps 32-35 | ✅ Pass |
| Chat Functionality | Steps 37-42 | ✅ Pass |
| Logout | Steps 44-45 | ✅ Pass |
| Protected Routes | Step 46 | ✅ Pass |
| Error Handling | Steps 47-53 | ✅ Pass |
| Backend API | Steps 57-60 | ✅ Pass |
| Data Persistence | Steps 71-80 | ✅ Pass |

**Total Steps:** 81  
**Features Tested:** 14  
**All Features Working:** ✅ Yes

## Acknowledgments

- CS 445 Course Staff for project guidance
- React and Express communities for excellent documentation
- Prisma team for the amazing ORM tooling
