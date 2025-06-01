import { array, number, object } from 'decoders';
import type { Decoder } from 'decoders';
import { QueueItemModel, queueItemDecoder } from './queue-item';
import type { QueueItem } from './queue-item';
import { BaseModel } from './base-model';

export type Queue = {
  voice_queue: QueueItem[];
  text_queue: QueueItem[];
  total_queued: number;
};

export const queueDecoder: Decoder<Queue> = object({
  voice_queue: array(queueItemDecoder),
  text_queue: array(queueItemDecoder),
  total_queued: number,
});

export class QueueModel extends BaseModel {
  public voiceQueue: QueueItemModel[];
  public textQueue: QueueItemModel[];
  public totalQueued: number;

  constructor(
    voiceQueue: QueueItemModel[],
    textQueue: QueueItemModel[],
    totalQueued: number
  ) {
    super();
    this.voiceQueue = voiceQueue;
    this.textQueue = textQueue;
    this.totalQueued = totalQueued;
  }

  static fromDto(dto: Queue): QueueModel {
    return new QueueModel(
      dto.voice_queue.map(QueueItemModel.fromDto),
      dto.text_queue.map(QueueItemModel.fromDto),
      dto.total_queued
    );
  }

  toDto() {
    return {
      voice_queue: this.voiceQueue.map((item) => item.toDto()),
      text_queue: this.textQueue.map((item) => item.toDto()),
      total_queued: this.totalQueued,
    };
  }
}
