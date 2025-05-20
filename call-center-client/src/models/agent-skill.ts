import { TaskPlatform } from '@/types';
import { BaseModel } from './base-model';

export type AssignedSkillDto = {
  id: string;
  platform: TaskPlatform;
  is_voice: boolean;
};

export class AssignedSkillModel extends BaseModel {
  public id: string;
  public platform: TaskPlatform;
  public isVoice: boolean;

  constructor(id: string, platform: TaskPlatform, isVoice: boolean) {
    super();
    this.id = id;
    this.platform = platform;
    this.isVoice = isVoice;
  }

  static fromDto(dto: AssignedSkillDto): AssignedSkillModel {
    return new AssignedSkillModel(dto.id, dto.platform, dto.is_voice);
  }

  toDto() {
    return {
      id: this.id,
      platform: this.platform,
      is_voice: this.isVoice,
    };
  }
}
