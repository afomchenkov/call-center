import { z } from 'zod';
import { TaskPlatform } from '@/types';

export const assignTicketSchema = z.object({
  id: z.string().uuid('ID is required'),
  platform: z.nativeEnum(TaskPlatform),
  restrictions: z
    .array(z.string().min(1, 'Language is required'))
    .min(1, 'At least one language is required'),
});

export type AssignTicketFormValues = z.infer<typeof assignTicketSchema>;
