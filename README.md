# FlowDesk
 
A real-time collaborative task board built for freelancer-client workflows. FlowDesk lets freelancers manage projects transparently with clients — shared boards, live updates, and clear task ownership without the back-and-forth of email.
 
---
 
## What is FlowDesk?
 
FlowDesk is a Kanban-style project management tool where freelancers can invite clients directly into a workspace, organize work into boards and cards, and collaborate in real time. Think of it as a Trello-like board but purpose-built for the freelancer-client relationship.
 
The core hierarchy is:
 
```
User
 └── Workspace (e.g. "Project X with Client Y")
      └── Board (e.g. "Design Phase", "Development")
           └── Column (e.g. "Todo", "In Progress", "Done")
                └── Card (individual tasks)
```
 
---
 
## Tech Stack
 
### Backend
| Tool | Purpose |
|------|---------|
| Bun | JavaScript runtime and package manager |
| Express | HTTP server and routing |
| Prisma | ORM for database access |
| PostgreSQL | Primary database |
| Socket.io | Real-time events (card moves, presence) |
| Better Auth | Authentication (sign up, sign in, sessions) |
| TypeScript | Type safety across the entire backend |
 
### Frontend
> To be added as the project grows.
 
---
 
## Project Structure
 
```
flowdesk/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # All database models
│   │   ├── migrations/          # Auto-generated migration history
│   │   └── prisma.config.ts     # Prisma configuration (DB URL, paths)
│   ├── src/
│   │   ├── generated/
│   │   │   └── prisma/          # Auto-generated Prisma client (don't edit)
│   │   ├── controllers/         # HTTP layer — reads req, sends res
│   │   ├── services/            # Business logic and database queries
│   │   ├── routes/              # Route definitions
│   │   ├── middleware/          # Auth guards, error handlers
│   │   ├── lib/
│   │   │   └── db.ts            # Prisma client singleton
│   │   └── types/
│   │       └── express.d.ts     # Extends Express Request with user/session
│   └── index.ts                 # Entry point
└── README.md
```
 
---
 
## Architecture Overview
 
FlowDesk follows a layered architecture on the backend:
 
```
Request
   ↓
Routes          → just maps URL + method to a controller function
   ↓
Middleware       → checks auth (requireAuth), attaches user to req
   ↓
Controller       → reads req.body/params, calls service, sends response
   ↓
Service          → database queries and business logic (uses Prisma)
   ↓
Database         → PostgreSQL via Prisma
```
 
**Why this separation?**
- Routes stay clean and readable
- Controllers only handle HTTP concerns (status codes, response shape)
- Services only handle data concerns (queries, validation logic)
- If you ever switch databases or frameworks, you touch only one layer
---
 
## Database Schema
 
### Auth Models (managed by Better Auth — do not modify)
- `User` — registered users
- `Session` — active sessions
- `Account` — OAuth provider accounts
- `Verification` — email verification tokens
### Domain Models
 
#### Workspace
The top-level container. A freelancer creates one workspace per client engagement.
 
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto-generated |
| name | String | Workspace display name |
| createdAt | DateTime | Auto-set on creation |
| updatedAt | DateTime | Auto-updated |
 
#### WorkspaceMember
Join table between User and Workspace. Stores the user's role within a workspace.
 
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto-generated |
| workspaceId | String | FK → Workspace |
| userId | String | FK → User |
| role | Enum | OWNER, EDITOR, VIEWER |
| createdAt | DateTime | Auto-set on creation |
 
> The workspace creator is automatically assigned the OWNER role when a workspace is created.
 
#### Board
Lives inside a workspace. Represents a project or phase.
 
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto-generated |
| name | String | Board display name |
| workspaceId | String | FK → Workspace |
| userId | String | FK → User (creator) |
| createdAt | DateTime | — |
| updatedAt | DateTime | — |
 
#### Column
Lives inside a board. Represents a stage (e.g. Todo, In Progress, Done).
 
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto-generated |
| name | String | Column label |
| order | Int | Position left to right |
| boardId | String | FK → Board |
| createdAt | DateTime | — |
| updatedAt | DateTime | — |
 
#### Card
Lives inside a column. Represents a single task or deliverable.
 
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Auto-generated |
| title | String | Card title |
| description | String? | Optional details |
| order | Int | Position within the column |
| dueDate | DateTime? | Optional deadline |
| columnId | String | FK → Column |
| createdById | String | FK → User |
| assignedToId | String? | FK → User (nullable) |
| createdAt | DateTime | — |
| updatedAt | DateTime | — |
 
---
 
## API Overview
 
All routes are prefixed with `/api`.
 
Authentication is required on all routes below. Requests without a valid session return `401 Unauthorized`.
 
### Workspaces
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/workspaces | Create a new workspace |
| GET | /api/workspaces | List all workspaces for the logged-in user |
| GET | /api/workspaces/:id | Get a single workspace |
| PATCH | /api/workspaces/:id | Rename or update a workspace |
| DELETE | /api/workspaces/:id | Delete a workspace |
 
### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/workspaces/:id/members | Invite a member |
| GET | /api/workspaces/:id/members | List members |
| DELETE | /api/workspaces/:id/members/:userId | Remove a member |
 
### Boards
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/workspaces/:workspaceId/boards | Create a board |
| GET | /api/workspaces/:workspaceId/boards | List boards in a workspace |
| GET | /api/boards/:id | Get board with columns and cards |
| PATCH | /api/boards/:id | Update board |
| DELETE | /api/boards/:id | Delete board |
 
### Columns
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/boards/:boardId/columns | Create a column |
| PATCH | /api/columns/:id | Rename a column |
| PATCH | /api/columns/reorder | Reorder columns after drag |
| DELETE | /api/columns/:id | Delete a column |
 
### Cards
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/columns/:columnId/cards | Create a card |
| GET | /api/cards/:id | Get a single card |
| PATCH | /api/cards/:id | Update card details |
| PATCH | /api/cards/:id/move | Move card to a different column |
| DELETE | /api/cards/:id | Delete a card |
 
---
 
## Real-Time Events (Socket.io)
 
Socket.io handles live collaboration on top of the REST API. The flow is:
 
1. User performs an action → REST API saves it to the database
2. REST API emits a Socket.io event to everyone in the board room
3. Other users' screens update instantly without refreshing
### Rooms
- Each board is a Socket.io room: `board:{boardId}`
- Users join the room when they open a board
### Events (planned)
| Event | Trigger |
|-------|---------|
| `card:moved` | Card dragged to new column |
| `card:created` | New card added |
| `card:updated` | Card title or description changed |
| `card:deleted` | Card removed |
| `column:reordered` | Columns rearranged |
 
---
 
## Getting Started
 
### Prerequisites
- Bun installed
- PostgreSQL database running
- `.env` file set up (see below)
### Environment Variables
 
Create a `.env` file in the `backend/` directory:
 
```env
DATABASE_URL=postgresql://user:password@localhost:5432/flowdesk
BETTER_AUTH_SECRET=your-secret-key-here
```
 
### Installation
 
```bash
# Install dependencies
bun install
 
# Generate Prisma client
bunx prisma generate
 
# Run migrations
bunx prisma migrate dev
 
# Start the development server
bun run dev
```
 
---
 
## Development Notes
 
### Prisma client location
The generated Prisma client lives at `src/generated/prisma`. This folder is auto-generated and should not be edited manually. If you change the schema, always run `npx prisma generate` to regenerate it.
 
### Prisma singleton pattern
`src/lib/db.ts` exports a single Prisma client instance. This prevents multiple database connections from being created during hot reloads in development. Always import `db` from this file, never instantiate `PrismaClient` directly elsewhere.
 
### Auth middleware
Better Auth attaches the logged-in user to `req.user` via session middleware in `index.ts`. The `requireAuth` middleware in `src/middleware/requireAuth.ts` guards protected routes. Any route that needs the current user should use `requireAuth` as middleware.
 
### Role system
Workspace roles are: `OWNER`, `EDITOR`, `VIEWER`. The workspace creator is always the OWNER. Role-based access checks should happen in the service layer, not the controller.
 
---
 
## Roadmap
 
- [x] Authentication (Better Auth)
- [x] Database schema design
- [ ] Workspace CRUD
- [ ] Board CRUD
- [ ] Column CRUD
- [ ] Card CRUD
- [ ] Member invitations
- [ ] Real-time with Socket.io
- [ ] Frontend implementation
- [ ] Client approval flow on cards
- [ ] Activity log per card
- [ ] Public board sharing (read-only link)
