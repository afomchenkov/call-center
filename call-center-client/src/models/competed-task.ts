import { object, string, array } from 'decoders';
import type { Decoder } from 'decoders';
import { BaseModel } from './base-model';

export interface MultipleCompletedTasks {
  completed_tasks: string[];
}

export const multipleCompletedTasksDecoder: Decoder<MultipleCompletedTasks> =
  object({
    completed_tasks: array(string),
  });

export class CompletedTaskModel extends BaseModel {
  public id: string;

  constructor(data: Partial<CompletedTaskModel>) {
    super();
    this.id = data.id || 'unknown';
  }

  static fromDto(id: string): CompletedTaskModel {
    return new CompletedTaskModel({
      id,
    });
  }
}
