import { EnsureCharacterService } from '../src/domain/services/EnsureCharacterService';
import { CharacterRepository } from '../src/infrastructure/repositories/CharacterRepository';
import { CharacterDomainService } from '../src/domain/logic/CharacterDomainService';
import { SupportedJobs, SupportedStates } from '../src/shared/enums/Domains';
import { GetCharacterOutput } from '../src/application/dto/CharacterDto';
import { ErrorHandler } from '../src/shared/utilities/ErrorHandler';
import { CharacterModel } from '../src/domain/models/CharacterModel';

describe('EnsureCharacterService', () => {
  let service: EnsureCharacterService;
  let mockRepository: jest.Mocked<CharacterRepository>;
  let mockDomainService: jest.Mocked<CharacterDomainService>;

  beforeEach(() => {
    mockRepository = {
      getCharacterByKeys: jest.fn()
    } as unknown as jest.Mocked<CharacterRepository>;

    mockDomainService = {
      getKeys: jest.fn(),
      toOutput: jest.fn()
    } as unknown as jest.Mocked<CharacterDomainService>;

    service = new EnsureCharacterService(mockRepository, mockDomainService);
  });

  it('should return character output when character exists', async () => {
    const input = {
      status: SupportedStates.ALIVE,
      job: SupportedJobs.WARRIOR,
      characterId: 'character-001'
    };

    const mockKeys = { pk: 'user-123', sk: 'character-001' };
    const mockCharacter = { pk: 'user-123', sk: 'character-001', entityType: 'Character', name: 'Hero1', status: SupportedStates.ALIVE, job: SupportedJobs.WARRIOR, lifePoints: 100, currentLifePoints: 100, strength: 10, dexterity: 10, intelligence: 10, attackModifier: 10, speedModifier: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as CharacterModel;
    const mockOutput: GetCharacterOutput = {
      characterId: 'character-001',
      name: 'Hero1',
      job: SupportedJobs.WARRIOR,
      status: SupportedStates.ALIVE,
      lifePoints: 100,
      currentLifePoints: 100,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      attackModifier: 10,
      speedModifier: 10,
      entityType: 'Character',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockDomainService.getKeys.mockReturnValue(mockKeys);
    mockRepository.getCharacterByKeys.mockResolvedValue(mockCharacter);
    mockDomainService.toOutput.mockReturnValue(mockOutput);

    const result = await service.ensureExists(input);
    expect(result).toEqual(mockOutput);
    expect(mockRepository.getCharacterByKeys).toHaveBeenCalledWith(mockKeys);
  });

  it('should throw an error when keys are invalid', async () => {
    const input = {
      status: SupportedStates.ALIVE,
      job: SupportedJobs.WARRIOR,
      characterId: 'character-001'
    };

    mockDomainService.getKeys.mockReturnValue({ pk: '', sk: '' });

    await expect(service.ensureExists(input)).rejects.toThrow(new ErrorHandler('Invalid status, job or characterId', 400));
  });

  it('should throw an error when character is not found', async () => {
    const input = {
      status: SupportedStates.ALIVE,
      job: SupportedJobs.WARRIOR,
      characterId: 'character-001'
    };

    const mockKeys = { pk: 'user-123', sk: 'character-001' };
    mockDomainService.getKeys.mockReturnValue(mockKeys);
    mockRepository.getCharacterByKeys.mockResolvedValue(null);

    await expect(service.ensureExists(input)).rejects.toThrow(new ErrorHandler('Character not found.', 404));
  });
});
