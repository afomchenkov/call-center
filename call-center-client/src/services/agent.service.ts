import { Err, Ok } from '@hqoss/monads';
import type { Result } from '@hqoss/monads';
import axios from 'axios';
import { object } from 'decoders';
import { API_AGENTS } from '@/api';
import { genericErrorsDecoder } from '@/types';
import type { GenericErrors } from '@/types';
import type { Agent, MultipleAgents, RegisterAgentPayload } from '@/models';
import { agentDecoder, multipleAgentsDecoder } from '@/models';

/**
 * Fetch agent by ID
 *
 * @param agentId
 * @returns
 */
export async function getAgent(agentId: string): Promise<Result<Agent, GenericErrors>> {
  try {
    const url = new URL(`${API_AGENTS}/${agentId}`);
    const { data } = await axios.get(url.toString());

    return Ok(agentDecoder.verify(data));
  } catch (error) {
    const { data } = error as never;
    return Err(object({ errors: genericErrorsDecoder }).verify(data).errors);
  }
}

/**
 * Fetch all agents
 *
 * @returns
 */
export async function getAgents(): Promise<Result<MultipleAgents, GenericErrors>> {
  try {
    const url = new URL(`${API_AGENTS}`);
    const { data } = await axios.get(url.toString());
    return Ok(multipleAgentsDecoder.verify(data));
  } catch (error) {
    const data = Object.values(error as never);
    return Err(object({ errors: genericErrorsDecoder }).verify({ errors: { data } }).errors);
  }
}

/**
 * Create new agent
 *
 * @param payload
 * @returns
 */
export async function createAgent(payload: RegisterAgentPayload): Promise<Result<Agent, GenericErrors>> {
  try {
    const url = new URL(`${API_AGENTS}`);
    const { data } = await axios.post(url.toString(), JSON.stringify(payload));

    return Ok(agentDecoder.verify(data));
  } catch (error) {
    const data = Object.values(error as never);
    return Err(object({ errors: genericErrorsDecoder }).verify({ errors: { data } }).errors);
  }
}

export async function editAgent(): Promise<string> {
  return Promise.resolve('to implement');
}
