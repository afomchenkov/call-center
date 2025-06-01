import { Err, Ok } from '@hqoss/monads';
import type { Result } from '@hqoss/monads';
import axios from 'axios';
import { object } from 'decoders';
import { API_TASKS } from '@/api';
import { genericErrorsDecoder } from '@/types';
import type { GenericErrors } from '@/types';
import type {
  AssignTicket,
  AssignTicketPayload,
  MultipleCompletedTasks,
} from '@/models';
import { assignTicketDecoder, multipleCompletedTasksDecoder } from '@/models';

/**
 * Create new ticket and assign it if the available agent is found
 *
 * @param payload
 * @returns
 */
export async function assignTask(
  payload: AssignTicketPayload
): Promise<Result<AssignTicket, GenericErrors>> {
  try {
    const url = new URL(`${API_TASKS}`);
    const { data } = await axios.post(url.toString(), JSON.stringify(payload));

    return Ok(assignTicketDecoder.verify(data));
  } catch (error) {
    const { data } = error as never;
    return Err(object({ errors: genericErrorsDecoder }).verify(data).errors);
  }
}

/**
 * Mark assigned task as completed
 *
 * @param agentId
 * @param taskId
 * @returns
 */
export async function completeTask(
  agentId: string,
  taskId: string
): Promise<Result<null, GenericErrors>> {
  try {
    const url = new URL(`${API_TASKS}/complete`);
    url.searchParams.append('agent_identifier', agentId);
    url.searchParams.append('task_id', taskId);

    await axios.post(url.toString());

    return Ok(null);
  } catch (error) {
    const { data } = error as never;
    return Err(object({ errors: genericErrorsDecoder }).verify(data).errors);
  }
}

/**
 * Get completed tasks
 * 
 * @returns 
 */
export async function getCompletedTasks(): Promise<
  Result<MultipleCompletedTasks, GenericErrors>
> {
  try {
    const url = new URL(`${API_TASKS}/completed`);
    const { data } = await axios.get(url.toString());

    return Ok(multipleCompletedTasksDecoder.verify(data));
  } catch (error) {
    const { data } = error as never;
    return Err(object({ errors: genericErrorsDecoder }).verify(data).errors);
  }
}
