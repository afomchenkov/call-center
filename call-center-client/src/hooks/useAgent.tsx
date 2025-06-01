import { useQuery } from '@tanstack/react-query';
import { API_AGENTS } from '@/api';
import { AgentModel } from '@/models';
import type { Agent } from '@/models';

export const useAgent = (id: string) => {
  return useQuery<AgentModel>({
    queryKey: ['agent', id],
    queryFn: async () => {
      const res = await fetch(`${API_AGENTS}/${id}`);

      if (!res.ok) {
        let message = 'Failed to fetch agent';
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

      const data: Agent = await res.json();
      return AgentModel.fromDto(data);
    },
    enabled: !!id,
  });
};
