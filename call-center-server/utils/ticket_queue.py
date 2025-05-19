from typing import Optional
from domain.ticket import Ticket
import queue


class TicketQueue:
    def __init__(self):
        self.voice_queue = queue.PriorityQueue()  # Higher priority
        self.text_queue = queue.PriorityQueue()
        self.counter = 0  # Counter to ensure FIFO ordering for same priority
        self.queued_ticket_ids = set()  # Track IDs of tickets in the queue
    
    def add_ticket(self, ticket: Ticket, priority: int = 0):
        # Check if ticket is already in queue
        if ticket.id in self.queued_ticket_ids:
            return False
            
        # Use counter to break ties (FIFO ordering)
        self.counter += 1
        if ticket.is_voice:
            self.voice_queue.put((priority, self.counter, ticket))
        else:
            self.text_queue.put((priority, self.counter, ticket))
            
        # Mark ticket as queued
        self.queued_ticket_ids.add(ticket.id)
        return True
    
    def get_next_ticket(self) -> Optional[Ticket]:
        # Try voice queue first (higher priority)
        if not self.voice_queue.empty():
            priority, counter, ticket = self.voice_queue.get()
            # Remove from queued set
            self.queued_ticket_ids.remove(ticket.id)
            return ticket
        # Then try text queue
        if not self.text_queue.empty():
            priority, counter, ticket = self.text_queue.get()
            # Remove from queued set
            self.queued_ticket_ids.remove(ticket.id)
            return ticket
        return None
    
    def is_ticket_queued(self, ticket_id: str) -> bool:
        """Check if a ticket is already in the queue"""
        return ticket_id in self.queued_ticket_ids