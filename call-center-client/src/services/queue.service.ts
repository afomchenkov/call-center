import { Err, Ok } from '@hqoss/monads';
import type { Result } from '@hqoss/monads';
import axios from 'axios';
import { object } from 'decoders';
import { API_QUEUE } from '@/api';
import { genericErrorsDecoder } from '@/types';
import type { GenericErrors } from '@/types';
import type { Queue } from '@/models';
import { queueDecoder } from '@/models';

/**
 * Get tickets queue status
 * 
 * @returns 
 */
export async function getQueueStatus(): Promise<Result<Queue, GenericErrors>> {
  try {
    const url = new URL(`${API_QUEUE}`);
    const { data } = await axios.get(url.toString());

    return Ok(queueDecoder.verify(data));
  } catch (error) {
    const { data } = error as never;
    return Err(object({ errors: genericErrorsDecoder }).verify(data).errors);
  }
}
