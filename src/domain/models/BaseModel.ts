import { BaseModelParams } from "../../shared/types/BaseModelType";

export abstract class BaseModel {
  pk: string;
  sk: string;
  entityType: string;
  createdAt: string;
  updatedAt: string;

  constructor({
    pk,
    sk,
    entityType,
  }: BaseModelParams) {
    const now = new Date().toISOString();
    this.pk = pk;
    this.sk = sk;
    this.entityType = entityType;
    this.createdAt = now;
    this.updatedAt = now;
  }

}
