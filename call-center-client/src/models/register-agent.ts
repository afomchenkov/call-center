import { BaseModel } from './base-model';

export type RegisterAgentDto = {
  name: string;
  language_skills: string[];
};

export class RegisterAgentModel extends BaseModel {
  public name: string;
  public languageSkills: string[];

  constructor(name: string, languageSkills: string[]) {
    super();
    this.name = name;
    this.languageSkills = languageSkills;
  }

  static fromDto(dto: RegisterAgentDto): RegisterAgentModel {
    return new RegisterAgentModel(dto.name, dto.language_skills);
  }

  toDto() {
    return {
      name: this.name,
      language_skills: this.languageSkills,
    };
  }
}
