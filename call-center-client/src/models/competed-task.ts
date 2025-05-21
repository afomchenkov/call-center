import { BaseModel } from './base-model';

export class CompletedTaskModel extends BaseModel {
  public id: string;

  constructor(data: Partial<CompletedTaskModel>) {
    super();
    this.id = data.id || 'unknown';
  }

  static fromDto(id: string): CompletedTaskModel {
    return new CompletedTaskModel({
      id
    });
  }
}
