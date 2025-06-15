import { CharacterModel } from "../../domain/models/CharacterModel";
import { StorageService } from "../database/StorageService";
import { Logger } from "../logger/Logger";

export class CharacterRepository extends StorageService<CharacterModel> {
  private static instance: CharacterRepository;

  private constructor(tableName: string) {
    super(tableName);
  }

  public static getInstance(tableName: string): CharacterRepository {
    if (!CharacterRepository.instance) {
      CharacterRepository.instance = new CharacterRepository(tableName);
    }
    return CharacterRepository.instance;
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
    newSk,
    updates
  }: {
    pk: string,
    sk: string,
    newSk?: string,
    updates: Partial<CharacterModel>
  }): Promise<CharacterModel> {
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    Logger.info(`Updating character ${sk} with updates: ${JSON.stringify(updatesWithTimestamp)}`);
    return this.updateObject({
      partitionKey: pk,
      sortKey: sk,
      newSortKey: newSk,
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
