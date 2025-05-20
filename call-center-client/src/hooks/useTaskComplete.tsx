import { useMutation } from '@tanstack/react-query';
import { API_TASKS } from '@/api';

type TaskCompleteParams = {
  agent_identifier: string;
  task_id: string;
};

export const useTaskComplete = () => {
  return useMutation({
    mutationFn: async ({ agent_identifier, task_id }: TaskCompleteParams) => {
      const url = new URL(`${API_TASKS}/complete`);
      url.searchParams.append('agent_identifier', agent_identifier);
      url.searchParams.append('task_id', task_id);

      const res = await fetch(url.toString(), {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to complete task');
      }

      return res.json();
    },
  });
};
