import { array, object, string } from 'decoders';
import type { Decoder } from 'decoders';
import { AssignedSkillModel } from './agent-skill';
import { assignedSkillDecoder } from './agent-skill';
import type { AssignedSkill } from './agent-skill';
import { BaseModel } from './base-model';

export type Agent = {
  id: string;
  name: string;
  language_skills: string[];
  assigned_tasks: AssignedSkill[];
};

export const agentDecoder: Decoder<Agent> = object({
  id: string,
  name: string,
  language_skills: array(string),
  assigned_tasks: array(assignedSkillDecoder),
});

export interface MultipleAgents {
  agents: Agent[];
}

export const multipleAgentsDecoder: Decoder<MultipleAgents> = object({
  agents: array(agentDecoder),
});

export type RegisterAgentPayload = {
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

  static fromDto(dto: Agent): AgentModel {
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
