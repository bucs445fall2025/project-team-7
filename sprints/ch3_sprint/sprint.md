# **Project Overview**

## **Application Vision/Goal:**
[Describe the overall purpose and vision of the application. What problem does it solve? Who is the target audience?]

The purpose of this website is to allow students to borrow items from other students on-campus.
This will prevents students from purchasing items for single use.
Target audience is students in Binghamton.

## **Scope:**
[List the major features and functionalities that define the scope of the project. Keep this high-level to avoid feature creep.]

- User Authentication & Profiles: Students create accounts (university email verification), manage profiles.
- Item Listings: Add/edit/remove items with details (title, description, category, availability).
- Search & Browse: Filter items by keyword, category, or availability.
- Borrow Requests: Request items, approve/deny requests, set due dates.
- Notifications: Updates for borrow/return actions and due dates.
- Basic Admin Tools: Remove inappropriate content and monitor reports.

## **Deliverables:**
[List what will be delivered by the end of the project, such as a working MVP (Minimum Viable Product), specific features, documentation, etc.]

Minimum Viable Product (MVP) with working core features:
- Backend (Flask + Gunicorn) API with MySQL database.
- Frontend (React) served via Nginx.
- Containerized deployment with Docker Compose.
Documentation:
- Project README, stack.md (tech stack), and API endpoint docs.
- Setup instructions for developers (how to run with Docker).
- Testing Materials: Basic unit tests for backend, manual test plan for features.
Demo Data: Seed data for accounts/items to showcase during presentation.

## **Success Criteria:**
[Define what will make this project successful. Examples include meeting deadlines, delivering core functionality, or achieving performance benchmarks.]



## **Assumptions:**
[List any assumptions about the technology, users, or resources that could impact development.]

Users will primarily be Binghamton University students with campus email verification.
Borrow/return transactions happen in person on campus (no delivery).
MVP will not handle payments. Item exchanges are trust-based.

## **Risks:**
[Identify potential risks and challenges, such as technical limitations, resource constraints, or dependency issues.]

- Possible schema changes as requirements evolve.
- Limited time.
- Team availability
  
User Risks:
- Misuse of the platform (fake listings, no-shows).
  
Integration Risks:
- Ensuring React frontend and Flask backend communicate correctly via Nginx.

## **Design / Architectural Review:**
[Outline the initial thoughts on application architecture. Will it be monolithic or microservices? Will it use a database? What major components will be included?]

Architecture Style: Monolithic (frontend + backend + database) for MVP.
Major Components:
- Frontend: React
- Backend: Flask API with Gunicorn
- Database: MySQL
- Web Server: Nginx
- Communication: RESTful API calls from React to Flask.

## **Test Environment:**
[Define how the application will be tested. Will you use automated tests? What environment will the tests run in?]

---

# **Team Setup**

## **Team Members:**
Hoyeon Yoo, Anthony Zheng, Elif Yildirim

## **Team Roles:**
[Define roles for each team member, such as developer, designer, project manager, QA tester, etc.]

Frontend: Anthony Zheng, Elif Yildirim
Backend: Elif Yildirim, Hoyeon Yoo
Database: Hoyeon Yoo
Designer: Hoyeon Yoo, Anthony Zheng, Elif Yildirim
Tester: Anthony Zheng

## **Team Norms:**
[Establish how the team will communicate, how often meetings will happen, and any other ground rules for collaboration.]

We will be communicating through text messages and discord. 
We are going to have in-person meeting on Friday 3pm - 4pm and online meeting weekend?

## **Application Stack:**
[List all the technologies being used in the project, including programming languages, frameworks, and tools.]

Python, Node.js, CSS, SQL language

### **Libraries/Frameworks:**
[List any specific libraries or frameworks your application will use, such as React, Flask, Django, etc.]

React, Flask, Gunicorn, Nginx, MySQL
