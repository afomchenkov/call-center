import { object, string, oneOf } from 'decoders';
import type { Decoder } from 'decoders';
import { TaskPlatform } from '@/types';
import { BaseModel } from './base-model';

export type AssignedSkill = {
  id: string;
  platform: TaskPlatform;
};

export const assignedSkillDecoder: Decoder<AssignedSkill> = object({
  id: string,
  platform: oneOf([...Object.values(TaskPlatform)]),
});

export class AssignedSkillModel extends BaseModel {
  public id: string;
  public platform: TaskPlatform;

  constructor(id: string, platform: TaskPlatform) {
    super();
    this.id = id;
    this.platform = platform;
  }

  static fromDto(dto: AssignedSkill): AssignedSkillModel {
    return new AssignedSkillModel(dto.id, dto.platform);
  }

  toDto() {
    return {
      id: this.id,
      platform: this.platform,
    };
  }
}
