import { StorageService } from '../src/infrastructure/database/StorageService';
import { BaseModel } from '../src/domain/models/BaseModel';
import { BaseModelParams } from '../src/shared/types/BaseModelType';

// In this context, pk represents a userId and sk represents a characterId or itemId
class TestModel extends BaseModel {
  value?: string;
  constructor(params: BaseModelParams & { value?: string }) {
    super(params);
    this.value = params.value;
  }
}

class TestStorageService extends StorageService<TestModel> {
  constructor(tableName: string) {
    super(tableName);
  }
}

describe('StorageService', () => {
  let service: TestStorageService;
  const tableName = 'TestTable';

  beforeEach(() => {
    service = new TestStorageService(tableName);
  });

  it('saves and retrieves an object', async () => {
    const item = new TestModel({ pk: 'user-123', sk: 'character-001', entityType: 'Character', value: 'value' });
    await service.saveObject({ item });
    const result = await service.objectByPartitionKeyAndSortKey({ partitionKey: 'user-123', sortKey: 'character-001' });
    expect(result).toEqual(item);
  });

  it('updates an object', async () => {
    const item = new TestModel({ pk: 'user-123', sk: 'character-001', entityType: 'Character', value: 'value' });
    await service.saveObject({ item });
    const updated = await service.updateObject({ partitionKey: 'user-123', sortKey: 'character-001', updates: { value: 'newValue' } });
    expect(updated.value).toBe('newValue');
    const result = await service.objectByPartitionKeyAndSortKey({ partitionKey: 'user-123', sortKey: 'character-001' });
    expect(result?.value).toBe('newValue');
  });

  it('updates the sortKey of an object', async () => {
    const item = new TestModel({ pk: 'user-123', sk: 'character-001', entityType: 'Character', value: 'value' });
    await service.saveObject({ item });
    const updated = await service.updateObject({ partitionKey: 'user-123', sortKey: 'character-001', newSortKey: 'character-002', updates: { value: 'newValue' } });
    expect(updated.value).toBe('newValue');
    const oldResult = await service.objectByPartitionKeyAndSortKey({ partitionKey: 'user-123', sortKey: 'character-001' });
    expect(oldResult).toBeNull();
    const newResult = await service.objectByPartitionKeyAndSortKey({ partitionKey: 'user-123', sortKey: 'character-002' });
    expect(newResult?.value).toBe('newValue');
  });

  it('throws an error if partitionKey does not exist when updating', async () => {
    await expect(service.updateObject({ partitionKey: 'user-999', sortKey: 'character-001', updates: { value: 'x' } })).rejects.toThrow('Partition key user-999 not found');
  });

  it('throws an error if sortKey does not exist when updating', async () => {
    const item = new TestModel({ pk: 'user-123', sk: 'character-001', entityType: 'Character', value: 'value' });
    await service.saveObject({ item });
    await expect(service.updateObject({ partitionKey: 'user-123', sortKey: 'character-999', updates: { value: 'x' } })).rejects.toThrow('Sort key character-999 not found in partition user-123');
  });

  it('returns null if partitionKey does not exist when retrieving', async () => {
    const result = await service.objectByPartitionKeyAndSortKey({ partitionKey: 'user-999', sortKey: 'character-001' });
    expect(result).toBeNull();
  });

  it('returns null if sortKey does not exist when retrieving', async () => {
    const item = new TestModel({ pk: 'user-123', sk: 'character-001', entityType: 'Character', value: 'value' });
    await service.saveObject({ item });
    const result = await service.objectByPartitionKeyAndSortKey({ partitionKey: 'user-123', sortKey: 'character-999' });
    expect(result).toBeNull();
  });

  it('finds objects by sortKey prefix', async () => {
    await service.saveObject({ item: new TestModel({ pk: 'user-123', sk: 'char-abc1', entityType: 'Character' }) });
    await service.saveObject({ item: new TestModel({ pk: 'user-123', sk: 'char-abc2', entityType: 'Character' }) });
    await service.saveObject({ item: new TestModel({ pk: 'user-123', sk: 'char-def1', entityType: 'Character' }) });
    const results = await service.objectsBySortKeyBegins('char-abc');
    expect(results.length).toBe(2);
    expect(results.every(obj => obj.sk.startsWith('char-abc'))).toBe(true);
  });

  it('finds objects by entityType', async () => {
    await service.saveObject({ item: new TestModel({ pk: 'user-123', sk: 'character-001', entityType: 'Mage' }) });
    await service.saveObject({ item: new TestModel({ pk: 'user-456', sk: 'character-002', entityType: 'Warrior' }) });
    await service.saveObject({ item: new TestModel({ pk: 'user-789', sk: 'character-003', entityType: 'Mage' }) });
    const results = await service.objectsByEntityType('Mage');
    expect(results.length).toBe(2);
    expect(results.every(obj => obj.entityType === 'Mage')).toBe(true);
  });
});
