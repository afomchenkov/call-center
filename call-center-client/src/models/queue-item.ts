import { TaskPlatform } from '@/types';
import { BaseModel } from './base-model';

export type QueueItemDto = {
  priority: number;
  position: number;
  ticket_id: string;
  platform: TaskPlatform;
  restrictions: string[];
  is_voice: boolean;
  created_at: number;
};

export class QueueItemModel extends BaseModel {
  public priority: number;
  public position: number;
  public ticketId: string;
  public platform: TaskPlatform;
  public restrictions: string[];
  public isVoice: boolean;
  public createdAt: number;

  constructor(
    priority: number,
    position: number,
    ticketId: string,
    platform: TaskPlatform,
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

  static fromDto(dto: QueueItemDto): QueueItemModel {
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
