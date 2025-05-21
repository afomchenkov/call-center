import { useQuery } from '@tanstack/react-query';
import { API_AGENTS } from '@/api';
import { AgentModel } from '@/models';
import type { AgentDto } from '@/models';

export const useAgents = () => {
  return useQuery<AgentModel[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await fetch(`${API_AGENTS}`);

      if (!res.ok) {
        let message = 'Failed to fetch agents';
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

      const data: AgentDto[] = await res.json();
      return data.map(AgentModel.fromDto);
    },
    refetchInterval: 5000,
  });
};
