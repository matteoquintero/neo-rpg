import { ENTITY_TYPE_PREFIX } from "../../shared/constants/Identifiers";
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

  static ExtractEntityType({ entityType }: { entityType: string }): string {
    return entityType.replace(`${ENTITY_TYPE_PREFIX}#`, "");
  }

}
