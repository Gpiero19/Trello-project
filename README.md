# Frello — Kanban Board App

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/frontend-React_19-blue)](#)
[![Backend](https://img.shields.io/badge/backend-Node.js_+_Express-green)](#)

A **Trello-inspired kanban board application** built with React and Node.js. Supports full board/list/card management with drag-and-drop, user authentication, labels, comments, due dates, priorities, and reusable templates.

---

## Live Demo

[https://trello-project-sandy.vercel.app/](https://trello-project-sandy.vercel.app/)

> No account needed — use **Guest Mode** to try the app instantly.

![Demo Screenshot](./frontend/public/Screenshot-Frello.png)

---

## Features

- **Authentication** — register, login, JWT-based sessions
- **Guest Mode** — fully functional boards stored in localStorage, no account required
- **Boards** — create, rename, delete, and drag-and-drop to reorder
- **Lists** — create, rename, delete, and drag-and-drop to reorder horizontally
- **Cards** — create, rename, delete, and drag-and-drop within or between lists
- **Card Details** — description, priority levels, due dates with overdue indicators, color labels, comments
- **Templates** — save boards as reusable templates; browse and apply public templates
- **Responsive design** — works on desktop and mobile

---

## Tech Stack

**Frontend**
- React 19, React Router 7
- @hello-pangea/dnd (drag and drop)
- Axios, React Icons
- Vite 6, Custom CSS

**Backend**
- Node.js, Express 5
- Sequelize 6 ORM, PostgreSQL
- bcrypt, jsonwebtoken, Joi

**Deployment**
- Frontend: Vercel
- Backend: Render

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- PostgreSQL running locally

### Backend setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm start
```

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL (default: http://localhost:3000/api)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
/frontend        # React + Vite application
/server          # Node.js + Express API
  /controllers   # Route handlers (boards, lists, cards, templates, auth)
  /models        # Sequelize models
  /middleware    # Auth, validation, response formatting
  /routes        # Express routers
```

---

## API Overview

| Resource | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Boards | `GET/POST /api/boards`, `GET/PUT/DELETE /api/boards/:id`, `PUT /api/boards/reorder` |
| Lists | `GET/POST /api/lists`, `PUT/DELETE /api/lists/:id`, `PUT /api/lists/reorder` |
| Cards | `GET/POST /api/cards`, `PUT/DELETE /api/cards/:id`, `PUT /api/cards/reorder` |
| Labels | `GET/POST /api/labels`, `POST/DELETE /api/cards/:id/labels` |
| Comments | `GET/POST /api/cards/:id/comments`, `DELETE /api/comments/:id` |
| Templates | `GET/POST /api/templates`, `GET/PUT/DELETE /api/templates/:id`, `POST /api/templates/:id/use` |

---

## Author

**Gian Piero Canevari**
- GitHub: [Gpiero19](https://github.com/Gpiero19)

---

## License

This project is licensed under the MIT License.
