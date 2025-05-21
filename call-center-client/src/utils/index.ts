import { format, fromUnixTime } from 'date-fns';
import { LANGUAGE_CODES, DATE_FORMAT_1 } from '@/constants';
import { AgentModel, QueueModel, QueueItemModel } from '@/models';
import { TaskPlatform } from '@/types';
import type { QueuedTicket } from '@/types';

const TOTAL_TASKS_CAPACITY = 4;
const REDUCED_TOTAL_TASKS_CAPCITY = 3;

/**
 * Convert Unix timestamp to formatted date
 * @param timestamp
 * @returns
 */
export const formatQueueTicketDate = (timestamp: number): string => {
  const date = fromUnixTime(timestamp);
  const formatted = format(date, DATE_FORMAT_1);

  return formatted;
};

export const parseLanguageRestrictions = (restrictions: string[]) => {
  return restrictions
    .map((lang) => LANGUAGE_CODES[lang])
    .filter(Boolean)
    .join(',');
};

export const parseDateString = (date: string) => new Date(date).toUTCString();

export const snakeToTitleCase = (str: string): string => {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getAgentCallTasks = (agent: AgentModel) => {
  const { assignedTasks } = agent;

  if (!assignedTasks) {
    return [];
  }

  return assignedTasks.filter((task) => task.platform === TaskPlatform.CALL);
};

export const getAgentTextTasks = (agent: AgentModel) => {
  const { assignedTasks } = agent;

  if (!assignedTasks) {
    return [];
  }

  return assignedTasks.filter((task) => task.platform !== TaskPlatform.CALL);
};

/**
 * Calculate agent capacity
 *
 * - An agent cannot handle 2 voice calls simultaneously
 * - An agent can handle a maximum of 4 text-based tasks at once
 * - If an agent has a voice call, they can handle a maximum of 3 tasks total
 *
 * @param agent
 * @returns
 */
export const calculateAgentCapacity = (agent: AgentModel) => {
  const callTasks = getAgentCallTasks(agent);
  const textTasks = getAgentTextTasks(agent);

  if (callTasks.length) {
    return Math.max(
      REDUCED_TOTAL_TASKS_CAPCITY - textTasks.length - callTasks.length,
      0
    );
  }

  return Math.max(TOTAL_TASKS_CAPACITY - textTasks.length, 0);
};

export const calculateTotalCapacity = (agent: AgentModel) => {
  const callTasks = getAgentCallTasks(agent);
  return TOTAL_TASKS_CAPACITY - callTasks.length;
};

export const calculateActiveVoiceTasks = (agents: AgentModel[] = []) => {
  return agents.reduce((total, agent) => {
    total += getAgentCallTasks(agent).length;
    return total;
  }, 0);
};

export const calculateActiveTextTasks = (agents: AgentModel[] = []) => {
  return agents.reduce((total, agent) => {
    total += getAgentTextTasks(agent).length;
    return total;
  }, 0);
};

export const parseQueuedItems = (
  queue: QueueModel | null = null
): QueuedTicket[] => {
  if (!queue) {
    return [];
  }

  return [
    ...queue.textQueue.map((item) => QueueItemModel.withType(item, 'text')),
    ...queue.voiceQueue.map((item) => QueueItemModel.withType(item, 'voice')),
  ];
};

export const Noop = () => {};
