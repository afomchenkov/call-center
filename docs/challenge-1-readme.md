



# Call Center Ticket Assignment System

## Overview

This project implements an HTTP server that handles the assignment of customer requests (tickets) to human agents in a call center environment. The system follows specific business rules and constraints to optimize agent workload and customer service quality.

## Key Features

- **Smart Ticket Assignment**: Automatically assigns tickets to the most suitable agent based on language skills and current workload
- **Queue Management**: Places tickets in a priority queue when no agent is immediately available
- **Capacity Management**: Enforces agent capacity constraints (voice calls, text-based tasks)
- **RESTful API**: Provides a comprehensive API for agent management and ticket assignment

## Business Rules and Constraints

### Agent Capacity
- An agent cannot handle 2 voice calls simultaneously
- An agent can handle a maximum of 4 text-based tasks at once
- If an agent has a voice call, they can handle a maximum of 3 tasks total

### Queue Management
- Tickets that cannot be immediately assigned are placed in a queue
- Voice calls have higher priority than text-based tasks
- The system attempts to assign queued tickets when agents become available

### Language Considerations
- Tickets have language requirements that must be matched with agent skills
- Agents can have multiple language skills

## API Endpoints

### Agent Management
- `POST /agents`: Register a new agent with language skills
- `GET /agents`: List all registered agents
- `GET /agents/{agent_identifier}`: Get details for a specific agent
- `PATCH /agents/{agent_identifier}`: Update an agent's properties
- `POST /agents/{agent_identifier}/tasks`: Manually assign a task to an agent (for testing)

### Ticket Assignment
- `POST /tickets/assign`: Assign a ticket to an available agent
- `POST /tasks/complete`: Mark a task as complete

### System Status
- `GET /queue`: View the current ticket queue status
- `GET /debug`: Get internal system state for debugging
- `POST /reset`: Reset the system state (for testing)

## Data Models

### Agent
- Unique ID (UUID)
- Name
- Language skills
- Currently assigned tasks

### Ticket
- Unique ID (UUID)
- Language restrictions
- Platform (call, email, facebook_chat, website_chat)

### Task
- Unique ID (UUID)
- Platform
- Associated with a specific ticket and agent

## Example Usage

### Register an Agent
```bash
curl -X 'POST' \
  'http://localhost:8000/agents' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "John Smith",
  "language_skills": ["English", "Spanish"]
}'
```

### Assign a Ticket
```bash
curl -X 'POST' \
  'http://localhost:8000/tickets/assign' \
  -H 'Content-Type: application/json' \
  -d '{
  "restrictions": ["English"],
  "platform": "facebook_chat"
}'
```

### Complete a Task
```bash
curl -X 'POST' \
  'http://localhost:8000/tasks/complete?agent_identifier=<agent_id>&task_id=<task_id>'
```

## Running the Application

1. Install dependencies: `pip install fastapi uvicorn`
2. Run the server: `python challenge-1.py`
3. Access the API documentation: `http://localhost:8000/docs`

## Swagger UI

 You can also use the Swagger UI at `/docs` to interactively test all endpoints.
