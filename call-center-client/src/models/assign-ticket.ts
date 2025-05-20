import { TaskPlatform } from '@/types';
import { BaseModel } from './base-model';

export type AssignTicketDto = {
  id: string;
  restrictions: string[]; // Language restriction e.g. "English", "French", etc.
  platform: TaskPlatform; // Platform type e.g. "call", "email"
};

export class AssignTicketModel extends BaseModel {
  public id: string;
  public restrictions: string[];
  public platform: TaskPlatform;

  constructor(id: string, restrictions: string[], platform: TaskPlatform) {
    super();
    this.id = id;
    this.restrictions = restrictions;
    this.platform = platform;
  }

  static fromDto(dto: AssignTicketDto): AssignTicketModel {
    return new AssignTicketModel(dto.id, dto.restrictions, dto.platform);
  }

  toDto() {
    return {
      id: this.id,
      restrictions: this.restrictions,
      platform: this.platform,
    };
  }
}
