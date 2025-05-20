import { AssignedSkillModel } from './agent-skill';
import type { AssignedSkillDto } from './agent-skill';
import { BaseModel } from './base-model';

export type AgentDto = {
  id: string;
  name: string;
  language_skills: string[];
  assigned_tasks: AssignedSkillDto[];
};

export type RegisterAgentDto = {
  name: string;
  language_skills: string[];
};

export class AgentModel extends BaseModel {
  public id: string;
  public name: string;
  public languageSkills: string[];
  public assignedTasks: AssignedSkillModel[];

  constructor(
    id: string,
    name: string,
    languageSkills: string[],
    assignedTasks: AssignedSkillModel[]
  ) {
    super();
    this.id = id;
    this.name = name;
    this.languageSkills = languageSkills;
    this.assignedTasks = assignedTasks;
  }

  static fromDto(dto: AgentDto): AgentModel {
    return new AgentModel(
      dto.id,
      dto.name,
      dto.language_skills,
      dto.assigned_tasks.map(AssignedSkillModel.fromDto)
    );
  }

  toDto() {
    return {
      id: this.id,
      name: this.name,
      language_skills: this.languageSkills,
      assigned_tasks: this.assignedTasks.map((task) => task.toDto()),
    };
  }
}
