import { BattleModel } from "../../domain/models/BattleModel";
import { StorageService } from "../database/StorageService";

export class BattleRepository extends StorageService<BattleModel> {
  private static instance: BattleRepository;

  private constructor(tableName: string) {
    super(tableName);
  }

  public static getInstance(tableName: string): BattleRepository {
    if (!BattleRepository.instance) {
      BattleRepository.instance = new BattleRepository(tableName);
    }
    return BattleRepository.instance;
  }

  async saveBattle({
    Battle
  }: {
    Battle: BattleModel
  }): Promise<void> {
    await this.saveObject({ item: Battle });
  }

  async updateBattle({
    pk,
    sk,
    updates
  }: {
    pk: string,
    sk: string,
    updates: Partial<BattleModel>
  }): Promise<BattleModel> {
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

  async getBattleByKeys({
    pk,
    sk
  }: {
    pk: string,
    sk: string
  }): Promise<BattleModel | null> {
    return this.objectByPartitionKeyAndSortKey({
      partitionKey: pk,
      sortKey: sk
    });
  }

  async getBattlesByEntityType({
    entityType
  }: {
    entityType: string
  }): Promise<BattleModel[]> {
    return this.objectsByEntityType(entityType);
  }
}
