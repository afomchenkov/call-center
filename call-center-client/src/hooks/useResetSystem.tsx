import { useMutation } from '@tanstack/react-query';
import { API_RESET } from '@/api';

export const useResetSystem = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(API_RESET, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to reset system');
      }

      return true
    },
  });
};
