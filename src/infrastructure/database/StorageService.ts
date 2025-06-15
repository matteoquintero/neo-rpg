import { BaseModel } from "../../domain/models/BaseModel";
import { Logger } from "../logger/Logger";

export abstract class StorageService<T extends BaseModel> {
  protected storage: Map<string, Map<string, any>>;

  protected constructor(private tableName: string) {
    this.storage = new Map();
  }

  protected getTable(): Map<string, Map<string, T>> {
    if (!this.storage.has(this.tableName)) {
      this.storage.set(this.tableName, new Map());
    }
    Logger.info(`Getting table: ${this.tableName}`);

    const tableContent = Array.from(this.storage.entries()).map(([pk, partition]) => ({
      partitionKey: pk,
      items: Array.from(partition.entries()).map(([sk, item]) => ({
        sortKey: sk,
        data: item
      }))
    }));
    Logger.info(`Table content: ${JSON.stringify(tableContent, null, 2)}`);

    return this.storage as Map<string, Map<string, T>>;
  }

  async saveObject({ item }: { item: T }): Promise<void> {
    const table = this.getTable();
    if (!table.has(item.pk)) {
      table.set(item.pk, new Map());
    }
    table.get(item.pk)!.set(item.sk, item);
    Logger.info(`Saved item with pk: ${item.pk} and sk: ${item.sk}`);
  }

  async updateObject({
    partitionKey,
    sortKey,
    newSortKey,
    updates
  }: {
    partitionKey: string,
    sortKey: string,
    newSortKey?: string,
    updates: Partial<T>
  }): Promise<T> {
    const table = this.getTable();
    const partition = table.get(partitionKey);
    if (!partition) {
      throw new Error(`Partition key ${partitionKey} not found`);
    }

    const item = partition.get(sortKey);
    if (!item) {
      throw new Error(`Sort key ${sortKey} not found in partition ${partitionKey}`);
    }

    const updatedItem = { ...item, ...updates };
    partition.set(sortKey, updatedItem as T);
    if (newSortKey) {
      partition.set(newSortKey, updatedItem as T);
      partition.delete(sortKey);
    }
    Logger.info(`Updated item with pk: ${partitionKey} and sk: ${sortKey}`);
    return updatedItem as T;
  }

  async objectByPartitionKeyAndSortKey({
    partitionKey,
    sortKey
  }: {
    partitionKey: string,
    sortKey: string
  }): Promise<T | null> {
    const table = this.getTable();
    const partition = table.get(partitionKey);
    if (!partition) {
      Logger.info(`No partition found for key: ${partitionKey}`);
      return null;
    }
    const item = partition.get(sortKey);
    Logger.info(`Found item for pk: ${partitionKey} and sk: ${sortKey}: ${item ? 'yes' : 'no'}`);
    return item || null;
  }

  protected getAllObjects(): T[] {
    const table = this.getTable();
    const allObjects = Array.from(table.values()).flatMap(partition => Array.from(partition.values()));
    Logger.info(`Total objects in table: ${allObjects.length}`);
    return allObjects;
  }

  async objectsBySortKeyBegins(beginsWith: string): Promise<T[]> {
    const objects = this.getAllObjects().filter(object => object.sk.startsWith(beginsWith));
    Logger.info(`Found ${objects.length} objects with sort key starting with: ${beginsWith}`);
    return objects;
  }

  async objectsByEntityType(entityType: string): Promise<T[]> {
    const objects = this.getAllObjects().filter(object => object.entityType === entityType);
    Logger.info(`Found ${objects.length} objects with entity type: ${entityType}`);
    return objects;
  }
}
