import { CharacterUseCase } from '../src/application/cases/CharacterUseCase';
import { CharacterDomainService } from '../src/domain/logic/CharacterDomainService';
import { CharacterRepository } from '../src/infrastructure/repositories/CharacterRepository';
import { ErrorHandler } from '../src/shared/utilities/ErrorHandler';
import { CharacterModel } from '../src/domain/models/CharacterModel';
import { GetCharacterOutput } from '../src/application/dto/CharacterDto';
import { SupportedStates, SupportedJobs } from '../src/shared/enums/Domains';
import { CharacterAttributesFactory } from '../src/application/services/CharacterAttributesFactory';

// Mock the domain service and repository
jest.mock('../src/domain/logic/CharacterDomainService');
jest.mock('../src/infrastructure/repositories/CharacterRepository', () => {
  return {
    CharacterRepository: {
      getInstance: jest.fn().mockReturnValue({
        saveCharacter: jest.fn(),
        getCharacterByKeys: jest.fn(),
        updateCharacter: jest.fn(),
        getCharactersByEntityType: jest.fn()
      })
    }
  };
});

// Mock factory for CharacterModel
const createMockCharacterModel = (overrides: Partial<CharacterModel> = {}): CharacterModel => {
  const characterId = overrides.sk?.split('#').pop() || 'character-001';
  return new CharacterModel({
    characterId,
    name: 'Hero',
    job: SupportedJobs.WARRIOR,
    status: SupportedStates.ALIVE,
    lifePoints: 100,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    attackModifier: 1,
    speedModifier: 1,
    ...overrides
  });
};

// Mock factory for GetCharacterOutput
const createMockCharacterOutput = (overrides = {}): GetCharacterOutput => ({
  characterId: 'character-001',
  name: 'Hero',
  job: SupportedJobs.WARRIOR,
  status: SupportedStates.ALIVE,
  lifePoints: 100,
  currentLifePoints: 100,
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  attackModifier: 1,
  speedModifier: 1,
  entityType: 'Character',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

describe('CharacterUseCase', () => {
  let useCase: CharacterUseCase;
  let mockDomainService: jest.Mocked<CharacterDomainService>;
  let mockRepository: jest.Mocked<CharacterRepository>;

  beforeEach(() => {
    const mockAttributesFactory = new CharacterAttributesFactory();
    mockDomainService = new CharacterDomainService(mockAttributesFactory) as jest.Mocked<CharacterDomainService>;
    mockRepository = CharacterRepository.getInstance('test-table') as jest.Mocked<CharacterRepository>;
    useCase = new CharacterUseCase(mockDomainService, mockRepository);
  });

  describe('createCharacter', () => {
    it('creates a character successfully', async () => {
      const input = {
        name: 'Hero',
        job: SupportedJobs.WARRIOR,
        status: SupportedStates.ALIVE,
        lifePoints: 100,
        strength: 10,
        dexterity: 10,
        intelligence: 10,
        attackModifier: 1,
        speedModifier: 1
      };
      const characterId = 'character-001';
      const mockModel = createMockCharacterModel({ sk: `State#${SupportedStates.ALIVE}#Character#${characterId}` });
      const mockOutput = createMockCharacterOutput({ characterId });

      mockDomainService.buildCreateModel.mockReturnValue(mockModel);
      mockDomainService.toOutput.mockReturnValue(mockOutput);
      mockRepository.saveCharacter.mockResolvedValue(undefined);

      const result = await useCase.createCharacter(input);
      expect(result).toEqual(mockOutput);
      expect(mockRepository.saveCharacter).toHaveBeenCalledWith({ Character: mockModel });
    });
  });

  describe('updateCharacter', () => {
    it('updates a character successfully', async () => {
      const input = {
        characterId: 'character-001',
        status: SupportedStates.ALIVE,
        job: SupportedJobs.WARRIOR,
        updates: { status: SupportedStates.DEAD }
      };
      const mockKeys = { pk: 'user-123', sk: 'character-001' };
      const mockExisting = createMockCharacterModel({ sk: `State#${SupportedStates.ALIVE}#Character#character-001` });
      const mockUpdated = createMockCharacterModel({
        sk: `State#${SupportedStates.DEAD}#Character#character-001`,
        status: SupportedStates.DEAD
      });
      const mockOutput = createMockCharacterOutput({ status: SupportedStates.DEAD });

      mockDomainService.getKeys.mockReturnValue(mockKeys);
      mockRepository.getCharacterByKeys.mockResolvedValue(mockExisting);
      mockRepository.updateCharacter.mockResolvedValue(mockUpdated);
      mockDomainService.toOutput.mockReturnValue(mockOutput);

      const result = await useCase.updateCharacter(input);
      expect(result).toEqual(mockOutput);
      expect(mockRepository.updateCharacter).toHaveBeenCalledWith({
        pk: 'user-123',
        sk: 'character-001',
        newSk: undefined,
        updates: { status: SupportedStates.DEAD }
      });
    });

    it('throws an error if character not found', async () => {
      const input = {
        characterId: 'character-999',
        status: SupportedStates.ALIVE,
        job: SupportedJobs.WARRIOR,
        updates: { status: SupportedStates.DEAD }
      };
      const mockKeys = { pk: 'user-123', sk: 'character-999' };

      mockDomainService.getKeys.mockReturnValue(mockKeys);
      mockRepository.getCharacterByKeys.mockResolvedValue(null);

      await expect(useCase.updateCharacter(input)).rejects.toThrow(new ErrorHandler('Character not found', 404));
    });
  });

  describe('getCharacter', () => {
    it('retrieves a character successfully', async () => {
      const input = {
        characterId: 'character-001',
        status: SupportedStates.ALIVE,
        job: SupportedJobs.WARRIOR
      };
      const mockKeys = { pk: 'user-123', sk: 'character-001' };
      const mockCharacter = createMockCharacterModel({ sk: `State#${SupportedStates.ALIVE}#Character#character-001` });
      const mockOutput = createMockCharacterOutput();

      mockDomainService.getKeys.mockReturnValue(mockKeys);
      mockRepository.getCharacterByKeys.mockResolvedValue(mockCharacter);
      mockDomainService.toOutput.mockReturnValue(mockOutput);

      const result = await useCase.getCharacter(input);
      expect(result).toEqual(mockOutput);
    });

    it('throws an error if keys are invalid', async () => {
      const input = {
        characterId: 'character-001',
        status: SupportedStates.ALIVE,
        job: SupportedJobs.WARRIOR
      };
      mockDomainService.getKeys.mockReturnValue({ pk: '', sk: '' });

      await expect(useCase.getCharacter(input)).rejects.toThrow(new ErrorHandler('Invalid status, job or characterId', 400));
    });
  });

  describe('getCharacters', () => {
    it('retrieves all characters successfully', async () => {
      const mockCharacters = [
        createMockCharacterModel({ sk: `State#${SupportedStates.ALIVE}#Character#character-001`, name: 'Hero1' }),
        createMockCharacterModel({ sk: `State#${SupportedStates.ALIVE}#Character#character-002`, name: 'Hero2', job: SupportedJobs.MAGE })
      ];
      const mockOutputs = [
        createMockCharacterOutput({ characterId: 'character-001', name: 'Hero1' }),
        createMockCharacterOutput({ characterId: 'character-002', name: 'Hero2', job: SupportedJobs.MAGE })
      ];

      mockDomainService.getEntityType.mockReturnValue('Character');
      mockRepository.getCharactersByEntityType.mockResolvedValue(mockCharacters);
      mockDomainService.toOutputArray.mockReturnValue(mockOutputs);

      const result = await useCase.getCharacters();
      expect(result).toEqual(mockOutputs);
    });
  });
});
