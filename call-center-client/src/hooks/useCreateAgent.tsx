import { useMutation } from '@tanstack/react-query';
import { API_AGENTS } from '@/api';
import type { RegisterAgentDto } from '@/models/agent';

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
        throw new Error('Failed to create agent');
      }

      return res.json();
    },
  });
};
