# Call Center Ticket Assignment System – Frontend Challenge

## Overview

This project is a smart ticket assignment system for a call center. The backend has already been implemented and exposes a RESTful API, you can find the backend code attached in the email. Your task is to build the **frontend application** that interacts with this backend and provides a clean, intuitive UI for agents and operations.

You'll build a dashboard that allows users to view:
- System status (active calls, messages, completed tasks)
- Current tasks
- Agent overall workloads
- Active agents and their current task distribution

A sample UI wireframe is provided below for reference and inspiration. 

---

## The Task

Build a frontend application that implements the following functionality:

### Core Functionality

1. **Dashboard View**
   - Displays:
     - Number of active calls, messages, and completed tasks
     - Total tickets in queue
     - Agent workload and task distribution
     - hint: check the debug endpoint

2. **Tasks View**
   - Segregate task list by type: voice and text
   - Display empty state if no tasks are in queue
   - Allow the user to create a task from the view

3. **Agent View**
   - Display each agent’s current task load and capacity usage
   - Show voice call/task indicators and capacity bar
   - Allow the user to create new agents and assign/edit agent's skills

4. **(Dashboard) Active Agents Section**
   - Show agent name, number of supported languages, and task capacity
   - View agent task status (calls and messages count)

5. **Actions**
   - Reset system button (calls `POST /reset`)
   - Assign ticket (calls `POST /tickets/assign`)
   - Complete task (calls `POST /tasks/complete`)
   - Register new agent (calls `POST /agents`)
   
---

## API Endpoints Summary

> The backend server must be running locally at `http://localhost:8000`

You will be able to access the API documentation via: `http://localhost:8000/docs`

---

## Requirements

- Use **TypeScript**
- Use **React** (and/or framework of your choice, e.g., Next.js)
- Implement **responsive** layout
- Build modular, maintainable components
- Interact with the provided REST API
- Cleanly organize the application into clear routes or pages

---

## Nice to Have

- **End-to-End Tests** using Playwright or Cypress that simulate the full user flow
- Component library usage (e.g., Radix UI, ShadCN) for quick and accessible UI
- Type-safe API calls
- Implement dynamic reassignment: Ensure queued tasks (e.g. a Korean call) are immediately assigned when an agent gains the required language skill or a new      matching agent is added.

---

## Submission Instructions

- Provide a link to a GitHub repo with:
  - `README.md` (with instructions on how to run it)
  - Source code
  - Any test results or setup scripts

---

## Bonus Tips

- Think like a user. If you're testing the dashboard, what information matters first?
- Add small visual cues (icons, badges, progress bars) to enhance usability
- Your design doesn't need to be pixel-perfect, but it should be tidy and clear