import { useMutation } from '@tanstack/react-query';
import { API_TICKETS } from '@/api';
import type { AssignTicket } from '@/models';

export const useTaskAssign = () => {
  return useMutation({
    mutationFn: async (payload: AssignTicket) => {
      const res = await fetch(`${API_TICKETS}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to assign ticket');
      }

      return res.json();
    },
  });
};
