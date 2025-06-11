import { CharacterModel } from "../../domain/models/CharacterModel";
import { StorageService } from "../database/StorageService";
import { Logger } from "../logger/Logger";

export class CharacterRepository extends StorageService<CharacterModel> {
  constructor(tableName: string) {
    super(tableName);
  }

  async saveCharacter({
    Character
  }: {
    Character: CharacterModel
  }): Promise<void> {
    await this.saveObject({ item: Character });
  }

  async updateCharacter({
    pk,
    sk,
    updates
  }: {
    pk: string,
    sk: string,
    updates: Partial<CharacterModel>
  }): Promise<CharacterModel> {
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.updateObject({
      partitionKey: pk,
      sortKey: sk,
      updates: updatesWithTimestamp
    });
  }

  async getCharacterByKeys({
    pk,
    sk
  }: {
    pk: string,
    sk: string
  }): Promise<CharacterModel | null> {
    return this.objectByPartitionKeyAndSortKey({
      partitionKey: pk,
      sortKey: sk
    });
  }

  async getCharactersByEntityType({
    entityType
  }: {
    entityType: string
  }): Promise<CharacterModel[]> {
    return this.objectsByEntityType(entityType);
  }

}
