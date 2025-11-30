# Borrow & Lend

**CS 445 Final Project**  
**Fall 2025**

**Team:** Team 7  
**Team Members:** Hoyeon Yoo, Elif Yildirim, Anthony Zheng

## Getting Started

Borrow & Lend is a campus community platform that enables students to share and borrow items with each other. Users can browse items by category, create borrow requests, list items they own, and communicate with other users through an integrated chat system. The platform facilitates resource sharing within the campus community, making it easy to find and borrow items like textbooks, electronics, tools, and more.

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
- **Node.js** (version 20 or higher) - for running migrations locally
- **npm** (comes with Node.js)

### ⚠️ Important: Prisma Version

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
docker-compose up -d
```

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
docker-compose up -d mysql
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
docker-compose up -d
```

### Step 3: Verify installation

Check that all containers are running:

```bash
docker-compose ps
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
- Data will **NOT BE LOST** when you run `docker-compose down`

**Important:** The `mysql-data/` folder is not needed and is ignored by git. Docker automatically creates a volume for MySQL data storage.

### To completely delete the database:

```bash
docker-compose down -v  # ⚠️ WARNING: This command deletes all data!
```

## Default Users

- **Demo User:** demo@binghamton.edu / password123 (automatically created from seed)

## Development

### View backend logs:

```bash
docker-compose logs -f backend
```

### View frontend logs:

```bash
docker-compose logs -f frontend
```

### Connect to MySQL:

```bash
docker-compose exec mysql mysql -uappuser -papppassword borrow_lend
```

### Start Prisma Studio:

Prisma Studio is already running at http://localhost:5555. If you need to start it manually:

```bash
docker-compose exec backend sh -c "cd /app && DATABASE_URL='mysql://appuser:apppassword@mysql:3306/borrow_lend?charset=utf8mb4' npx prisma studio --hostname 0.0.0.0 --port 5555"
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
   docker-compose ps
   ```

2. Open Frontend: http://localhost:3000

3. Test Backend API:
   ```bash
   curl http://localhost:8000/api/categories
   ```

## Troubleshooting

### Services won't start:

```bash
docker-compose down
docker-compose up -d --build
```

### Database connection issue:

```bash
docker-compose restart mysql
docker-compose restart backend
```

### Schema mismatch / Seed failed error:

If you encounter "schema mismatch" or "seed failed" errors:

```bash
# Stop all services
docker-compose down

# Clean volumes (reset database)
docker-compose down -v

# Restart (migrations and seed will run automatically)
docker-compose up -d --build

# Check seed logs
docker-compose logs seed
```

### Clean volumes (ALL DATA WILL BE DELETED):

```bash
docker-compose down -v
```

## Built With

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Programming language
- **React** - UI library (v19.2.0)
- **React Router** - Routing (v7.9.3)
- **Prisma** - ORM and database toolkit (v6.17.1)
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- CS 445 Course Staff for project guidance
- React and Express communities for excellent documentation
- Prisma team for the amazing ORM tooling
