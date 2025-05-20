import { TaskPlatform } from '@/types';
import { BaseModel } from './base-model';

export type AssignedSkillDto = {
  id: string;
  platform: TaskPlatform;
};

export class AssignedSkillModel extends BaseModel {
  public id: string;
  public platform: TaskPlatform;

  constructor(id: string, platform: TaskPlatform) {
    super();
    this.id = id;
    this.platform = platform;
  }

  static fromDto(dto: AssignedSkillDto): AssignedSkillModel {
    return new AssignedSkillModel(dto.id, dto.platform);
  }

  toDto() {
    return {
      id: this.id,
      platform: this.platform,
    };
  }
}
