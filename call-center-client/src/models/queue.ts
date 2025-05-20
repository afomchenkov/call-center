import { QueueItemModel } from './queue-item';
import type { QueueItemDto } from './queue-item';
import { BaseModel } from './base-model';

export type QueueDto = {
  voice_queue: QueueItemDto[];
  text_queue: QueueItemDto[];
  total_queued: number;
};

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

  static fromDto(dto: QueueDto): QueueModel {
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
