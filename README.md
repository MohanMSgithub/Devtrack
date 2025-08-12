<h2 align="center">
  DevTrack - Developer Productivity & Learning Tracker<br/>
  <a href="https://devtrack-nine.vercel.app/" target="_blank">Live Demo</a> |
  <a href="https://github.com/MohanMSgithub/Devtracker" target="_blank">GitHub Repo</a>
</h2>

---

## 🚀 Overview
**DevTrack** helps developers log daily learning, organize tasks, take rich-text notes, and visualize progress — all in one place.  
Built as a **full-stack application**, it integrates **GitHub login**, **JWT authentication**, and both **persistent** (MySQL) and **local** storage.

Key Highlights:
- End-to-end **React + Spring Boot** integration
- **OAuth2 authentication** with GitHub
- RESTful API design
- Real-world UI features like Kanban boards and analytics dashboards
- Deployment on **Vercel** (frontend) and **Render/Railway** (backend)

---

## 🛠 Tech Stack
**Frontend**
- React.js
- CSS3
- LocalStorage for client-side notes
- Hosted on **Vercel**

**Backend**
- Java 17+
- Spring Boot
- MySQL
- JWT Authentication
- GitHub OAuth2
- Hosted on **Render** / **Railway**

---

## ✨ Features
- 📖 **Multi-Page Layout** — Home, Logs, Notes, Kanban, and Dashboard
- 🔐 **GitHub Login** — Secure OAuth2 + JWT flow
- 📝 **Customizable Notes** — Background color, text style, highlights
- 📅 **Daily Logs** — Track learning, building, and blockers
- 📋 **Kanban Board** — Task organization by column
- 📊 **Dashboard** — Visual progress tracking
- 📱 **Fully Responsive** — Optimized for desktop & mobile

---

## 🖼 Screenshots
| Home Page | Kanban Board | Notes |
|-----------|--------------|-------|
| ![Home](screenshots/home.png) | ![Kanban](screenshots/kanban.png) | ![Notes](screenshots/notes.png) |

---

## ⚙️ Getting Started

### Prerequisites
- `Node.js` & `npm`
- `Java 17+`
- `Gradle`
- `MySQL`
- `Git`

---

### 1️⃣ Frontend Setup
```bash
# Clone the repo
git clone https://github.com/MohanMSgithub/Devtracker.git
cd Devtracker/frontend

# Install dependencies
npm install

# Start development server
npm start
```
### 2️⃣ Backend Setup
cd ../backend
```bash
# Configure environment variables in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/devtrack
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
jwt.secret=YOUR_JWT_SECRET
github.client.id=YOUR_GITHUB_CLIENT_ID
github.client.secret=YOUR_GITHUB_CLIENT_SECRET

# Build & run
./gradlew bootRun
```

## 🏗 Architecture

```mermaid
flowchart TB
    subgraph Frontend [Frontend - React]
        Home[Home Page]
        Login[GitHub OAuth Login]
        Logs[Daily Logs Page]
        Kanban[Kanban Board]
        Notes[Notes Page - Local Storage]
        Dashboard[Dashboard Page]
    end

    subgraph Backend [Backend - Spring Boot]
        API[REST Controllers]
        Auth[JWT Auth Service]
        UserService[User Service]
        LogService[Log Service]
        KanbanService[Kanban Service]
        DB[(MySQL Database)]
    end

    subgraph GitHubAPI [GitHub API]
        OAuth[OAuth Authorization]
    end

    Home --> Login
    Login --> OAuth
    OAuth --> Backend
    Backend --> DB
    Logs --> Backend
    Kanban --> Backend
    Notes --> LocalStorage[(Browser Local Storage)]
    Dashboard --> Backend
