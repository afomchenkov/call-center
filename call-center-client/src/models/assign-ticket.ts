import { object, string, boolean, nullable } from 'decoders';
import type { Decoder } from 'decoders';
import { TaskPlatform } from '@/types';
import { BaseModel } from './base-model';

export type AssignTicketPayload = {
  id: string;
  restrictions: string[]; // Language restriction e.g. "English", "French", etc.
  platform: TaskPlatform; // Platform type e.g. "call", "email"
};

export type AssignTicket = {
  ticket_id: string;
  agent_id: string | null;
  agent_name: string | null;
  task_id: string | null;
  queued: boolean;
};

export const assignTicketDecoder: Decoder<AssignTicket> = object({
  ticket_id: string,
  agent_id: nullable(string),
  agent_name: nullable(string),
  task_id: nullable(string),
  queued: boolean,
});

export class AssignTicketModel extends BaseModel {
  public ticketId: string;
  public agentId: string | null;
  public agentName: string | null;
  public taskId: string | null;
  public queued: boolean;

  constructor(
    ticketId: string,
    agentId: string | null,
    agentName: string | null,
    taskId: string | null,
    queued: boolean
  ) {
    super();
    this.ticketId = ticketId;
    this.agentId = agentId;
    this.agentName = agentName;
    this.taskId = taskId;
    this.queued = queued;
  }

  static fromDto(dto: AssignTicket): AssignTicketModel {
    return new AssignTicketModel(
      dto.ticket_id,
      dto.agent_id,
      dto.agent_name,
      dto.task_id,
      dto.queued
    );
  }

  toDto() {
    return {
      ticket_id: this.ticketId,
      agent_id: this.agentId,
      agent_name: this.agentName,
      task_id: this.taskId,
      queued: this.queued,
    };
  }
}
