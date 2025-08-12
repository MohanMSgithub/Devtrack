<h2 align="center">
  DevTrack - Developer Productivity & Learning Tracker<br/>
  <a href="https://devtrack.vercel.app/" target="_blank">DevTrack</a>
</h2>

<br/>

## TL;DR

You are welcome to fork this repository and customize it for your own productivity tracking needs.  
If you do, please give proper credit by linking back to the original author **Mohan M S**.

## Built With

DevTrack is a full-stack web application designed to help developers track their learning, projects, and progress in one place.  
It integrates GitHub login, daily logs, notes, and a Kanban board to make developer productivity measurable and organized.

This project was built using these technologies:

- React.js
- Spring Boot
- MySQL
- JWT Authentication
- CSS3
- VsCode
- Vercel (Frontend Hosting)
- Render / Railway (Backend Hosting)

## Features

**📖 Multi-Page Layout** — Separate pages for Home, Logs, Notes, Kanban, and Dashboard.  
**🔐 GitHub Login** — Sign in with GitHub, backed by JWT authentication.  
**📝 Customizable Notes** — Change background color, text style, and highlight text.  
**📅 Daily Logs** — Track what you learned, built, and what blocked you.  
**📋 Kanban Board** — Manage tasks visually.  
**📊 Dashboard** — See progress insights over time.  
**📱 Fully Responsive** — Works smoothly across devices.

## Getting Started

Clone this repository. You will need `node.js`, `npm`, `Java 17+`, `Gradle`, and `git` installed globally on your machine.

## 🛠 Installation and Setup Instructions

### Frontend (React)

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   npm start
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
