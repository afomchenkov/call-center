import { object, string } from 'decoders';
import type { Decoder } from 'decoders';
import { BaseModel } from './base-model';

export type AssignedSkill = {
  id: string;
  platform: string;
};

export const assignedSkillDecoder: Decoder<AssignedSkill> = object({
  id: string,
  platform: string,
});

export class AssignedSkillModel extends BaseModel {
  public id: string;
  public platform: string;

  constructor(id: string, platform: string) {
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
