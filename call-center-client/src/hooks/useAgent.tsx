import { useQuery } from '@tanstack/react-query';
import { API_AGENTS } from '@/api';
import { AgentModel } from '@/models';
import type { AgentDto } from '@/models';

export const useAgent = (id: string) => {
  return useQuery<AgentModel>({
    queryKey: ['agent', id],
    queryFn: async () => {
      const res = await fetch(`${API_AGENTS}/${id}`);

      if (!res.ok) {
        throw new Error('Failed to fetch agent');
      }

      const data: AgentDto = await res.json();
      return AgentModel.fromDto(data);
    },
    enabled: !!id,
  });
};
