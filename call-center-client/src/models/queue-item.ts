import { array, boolean, number, object, string } from 'decoders';
import type { Decoder } from 'decoders';
import { BaseModel } from './base-model';

export type QueueItem = {
  priority: number;
  position: number;
  ticket_id: string;
  platform: string;
  restrictions: string[];
  is_voice: boolean;
  created_at: number;
};

export const queueItemDecoder: Decoder<QueueItem> = object({
  priority: number,
  position: number,
  ticket_id: string,
  platform: string,
  restrictions: array(string),
  is_voice: boolean,
  created_at: number,
});

export class QueueItemModel extends BaseModel {
  public priority: number;
  public position: number;
  public ticketId: string;
  public platform: string;
  public restrictions: string[];
  public isVoice: boolean;
  public createdAt: number;

  constructor(
    priority: number,
    position: number,
    ticketId: string,
    platform: string,
    restrictions: string[],
    isVoice: boolean,
    createdAt: number
  ) {
    super();
    this.priority = priority;
    this.position = position;
    this.ticketId = ticketId;
    this.platform = platform;
    this.restrictions = restrictions;
    this.isVoice = isVoice;
    this.createdAt = createdAt;
  }

  static fromDto(dto: QueueItem): QueueItemModel {
    return new QueueItemModel(
      dto.priority,
      dto.position,
      dto.ticket_id,
      dto.platform,
      dto.restrictions,
      dto.is_voice,
      dto.created_at
    );
  }

  static withType(item: QueueItemModel, type: 'text' | 'voice') {
    const copy = Object.assign(
      Object.create(Object.getPrototypeOf(item)),
      item
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (copy as any).type = type;
    return copy;
  }

  toDto() {
    return {
      priority: this.priority,
      position: this.position,
      ticket_id: this.ticketId,
      platform: this.platform,
      restrictions: this.restrictions,
      is_voice: this.isVoice,
      created_at: this.createdAt,
    };
  }
}
