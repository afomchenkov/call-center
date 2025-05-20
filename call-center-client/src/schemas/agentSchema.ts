import { z } from 'zod';

export const agentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  language_skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .min(1, 'At least one language skill is required'),
});

export type AgentFormValues = z.infer<typeof agentSchema>;
