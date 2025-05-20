import { useQuery } from '@tanstack/react-query';
import { API_QUEUE } from '@/api';
import { QueueModel } from '@/models';

export const useQueueStatus = () => {
  return useQuery<QueueModel>({
    queryKey: ['queueStatus'],
    queryFn: async () => {
      const res = await fetch(API_QUEUE);

      if (!res.ok) {
        throw new Error('Failed to fetch queue status');
      }

      const queue = await res.json();
      return QueueModel.fromDto(queue);
    },
    // poll/refetch periodically for new queue items
    refetchInterval: 5000,
  });
};
