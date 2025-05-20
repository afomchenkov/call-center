import { useQuery } from '@tanstack/react-query';
import { API_AGENTS } from '@/api';
import { AgentModel } from '@/models/agent';
import type { AgentDto } from '@/models/agent';

export const useAgents = () => {
  return useQuery<AgentModel[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await fetch(`${API_AGENTS}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data: AgentDto[] = await res.json();
      return data.map(AgentModel.fromDto);
    },
    // refetchInterval: 30000, // Refetch every 30 seconds
  });
};
