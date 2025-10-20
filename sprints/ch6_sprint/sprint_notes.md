# Sprint Meeting Notes


Elif Yildirim, Hoyeon Yoo, Anthony Zhang

10/20/2025

***

## Sprint Review

### SRS Sections Updated

https://docs.google.com/document/d/1TCH-ScL2ykkAj_Jr7LRWSu7gMRVRalQO0nbkKwskd-8/edit?usp=sharing
- added the testing section and the diagram section 

### User Story

- As a user, I want to log in from the frontend and access my data from the backend.

- As a user, I want to see basic layout when I enter the main page.

### Sprint Requirements Attempted

- Complete testing between backend, frontend, and database.

- Build the basic layout of mainpage.

- Test CRUD operations.

### Completed Requirements

- Complete testing between backend, frontend, and database.

- Build the basic layout of mainpage.

- Test CRUD operations.


### Incomplete Requirements

- None

### The summary of the entire project

- 

***

## Sprint Planning

## Requirements Flex
For this sprint, the scope focuses on implementing the main page mapping integration and UI layout foundation.
Some secondary features such as chat functionality and request handling UI will be initiated but not fully completed.
Backend integration will focus on API endpoints required for the mapping feature.

## Technical Debt
-

### Requirement Target
Integrate map display and interaction on the main page.

Connect map to backend to fetch and display items by location.

Build main page UI skeleton with placeholder components for “Chat” button.

Ensure frontend-backend communication works for item data retrieval.

### User Stories
As a user, I want to view available items on a map so I can easily locate them on campus.

As a user, I want buttons to send requests or open chat windows for items directly from the main page.

As a developer, I want to integrate the map API with backend data so that the item listings appear dynamically.

### Planning
Integrate mapping feature using Google Maps or Leaflet.js.

Fetch item coordinates from backend API (Prisma + MySQL).

Design and implement main page layout in React with sections for items, requests, and chat.

Test communication between frontend and backend for map marker updates.

Prepare UI components for chat and borrow request flow for next sprint expansion

### Action Items
 Set up map component and render sample markers.

 Create backend route for retrieving item coordinates.

 Build base main page layout with placeholders for future modules.

 Ensure CORS and API routes handle map data properly.

 Start styling buttons and sections for request/chat.

### Issues and Risks
Possible delay in map API setup or configuration limits (e.g., API key usage or quotas).

Risk of merge conflicts due to simultaneous frontend and backend edits.

Dependencies between UI layout and backend API endpoints may slow integration testing.

Time allocation challenges for balancing new feature work with bug fixes.

### Team Work Assignments

Anthony Zhang: 
Start designing main page UI (layout, color theme, and button placement).

Implement “Request” and “Chat” button prototypes.

Collaborate with Elif to ensure map integrates smoothly into the page layout.
Elif Yildirim: 
Integrate mapping feature into the main page (frontend and backend connection).

Develop API routes to support map-based item data retrieval.

Test frontend and backend map synchronization.
Hoyeon Yoo: 
Support frontend component styling and map UI adjustments.

Conduct basic testing of new main page features.

Assist with bug tracking and documentation updates.

