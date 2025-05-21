import { useQuery } from '@tanstack/react-query';
import { API_TASKS } from '@/api';
import { CompletedTaskModel } from '@/models';

export const useCompletedTasks = () => {
  return useQuery<CompletedTaskModel[]>({
    queryKey: ['completedTasks'],
    queryFn: async () => {
      const res = await fetch(`${API_TASKS}/completed`);

      if (!res.ok) {
        throw new Error('Failed to fetch completed tasks');
      }

      const data = await res.json();

      // TODO: handle it properly
      return data.completed_tasks.map((task: string) =>
        CompletedTaskModel.fromDto(task)
      );
    },
    refetchInterval: 5000,
  });
};
