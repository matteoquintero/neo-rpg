import { BaseModel } from "../../domain/models/BaseModel";

export class StorageService<T extends BaseModel> {
  private static instance: StorageService<any>;
  private storage: Map<string, Map<string, T>>;

  constructor(private tableName: string) {
    this.storage = new Map();
  }

  private getTable(): Map<string, Map<string, T>> {
    if (!this.storage.has(this.tableName)) {
      this.storage.set(this.tableName, new Map());
    }
    return this.storage;
  }

  async saveObject({ item }: { item: T }): Promise<void> {
    const table = this.getTable();
    if (!table.has(item.pk)) {
      table.set(item.pk, new Map());
    }
    table.get(item.pk)!.set(item.sk, item);
  }

  async updateObject({
    partitionKey,
    sortKey,
    updates
  }: {
    partitionKey: string,
    sortKey: string,
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
      return null;
    }
    return partition.get(sortKey) || null;
  }

  async objectsByPartitionKey({
    partitionKey
  }: {
    partitionKey: string
  }): Promise<T[]> {
    const table = this.getTable();
    const partition = table.get(partitionKey);
    if (!partition) {
      return [];
    }
    return Array.from(partition.values());
  }
}
