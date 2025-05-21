import { useMutation } from '@tanstack/react-query';
import { API_AGENTS } from '@/api';
import type { RegisterAgentDto } from '@/models';

export const useCreateAgent = () => {
  return useMutation({
    mutationFn: async (newAgent: RegisterAgentDto) => {
      const res = await fetch(API_AGENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAgent),
      });

      if (!res.ok) {
        let message = 'Failed to create agent';
        try {
          const errorBody = await res.json();
          if (errorBody?.detail) {
            message = errorBody.detail;
          }
        } catch {
          throw new Error(message);
        }
        throw new Error(message);
      }

      return res.json();
    },
  });
};
