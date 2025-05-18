from domain.task import Task
from domain.ticket import Ticket
from domain.agent import Agent

class TicketAssignment:
    def __init__(self, agent: Agent, ticket: Ticket, task: Task):
        self.agent = agent
        self.ticket = ticket
        self.task = task
