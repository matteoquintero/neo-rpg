import { BattleUseCase } from '../src/application/cases/BattleUseCase';
import { BattleDomainService } from '../src/domain/logic/BattleDomainService';
import { BattleRepository } from '../src/infrastructure/repositories/BattleRepository';
import { EnsureCharacterService } from '../src/domain/services/EnsureCharacterService';
import { KillCharacterService } from '../src/domain/services/KillCharacterService';
import { BattleRoundService } from '../src/domain/services/BattleRoundService';
import { SupportedJobs, SupportedStates } from '../src/shared/enums/Domains';
import { GetCharacterOutput } from '../src/application/dto/CharacterDto';
import { GetBattleOutput } from '../src/application/dto/BattleDto';
import { ErrorHandler } from '../src/shared/utilities/ErrorHandler';

jest.mock('../src/domain/services/BattleRoundService');

describe('BattleUseCase', () => {
  let useCase: BattleUseCase;
  let mockDomainService: jest.Mocked<BattleDomainService>;
  let mockRepository: jest.Mocked<BattleRepository>;
  let mockEnsureCharacterService: jest.Mocked<EnsureCharacterService>;
  let mockKillCharacterService: jest.Mocked<KillCharacterService>;
  let mockBattleRoundService: jest.Mocked<BattleRoundService>;

  beforeEach(() => {
    mockDomainService = {
      getKeys: jest.fn(),
      buildCreateModel: jest.fn(),
      toOutput: jest.fn(),
      toOutputArray: jest.fn(),
      getEntityType: jest.fn()
    } as unknown as jest.Mocked<BattleDomainService>;

    mockRepository = {
      saveBattle: jest.fn(),
      getBattleByKeys: jest.fn(),
      getBattlesByEntityType: jest.fn()
    } as unknown as jest.Mocked<BattleRepository>;

    mockEnsureCharacterService = {
      ensureExists: jest.fn()
    } as unknown as jest.Mocked<EnsureCharacterService>;

    mockKillCharacterService = {
      execute: jest.fn()
    } as unknown as jest.Mocked<KillCharacterService>;

    mockBattleRoundService = {
      generateBattleRounds: jest.fn()
    } as unknown as jest.Mocked<BattleRoundService>;

    useCase = new BattleUseCase(
      mockDomainService,
      mockRepository,
      mockEnsureCharacterService,
      mockKillCharacterService,
      mockBattleRoundService
    );
  });

  it('should create a battle successfully', async () => {
    const input = {
      characterXId: 'character-001',
      characterYId: 'character-002',
      characterXJob: SupportedJobs.WARRIOR,
      characterYJob: SupportedJobs.MAGE
    };

    const characterX: GetCharacterOutput = {
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

    const characterY: GetCharacterOutput = {
      characterId: 'character-002',
      name: 'Hero2',
      job: SupportedJobs.MAGE,
      status: SupportedStates.ALIVE,
      lifePoints: 100,
      currentLifePoints: 100,
      strength: 8,
      dexterity: 12,
      intelligence: 15,
      attackModifier: 8,
      speedModifier: 12,
      entityType: 'Character',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const battleResult = {
      rounds: [],
      winner: characterX,
      loser: characterY
    };

    const battleModel = {
      pk: 'Character#character-001#JobWarrior#Character#character-002#JobMage',
      sk: 'Battle#battle-001',
      entityType: 'EntityType#Battle',
      characterX,
      characterY,
      rounds: [],
      winner: characterX,
      loser: characterY,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const battleOutput: GetBattleOutput = {
      battleId: 'battle-001',
      characterX,
      characterY,
      rounds: [],
      winner: characterX,
      loser: characterY,
      entityType: 'Battle',
      createdAt: battleModel.createdAt,
      updatedAt: battleModel.updatedAt
    };

    mockEnsureCharacterService.ensureExists
      .mockResolvedValueOnce(characterX)
      .mockResolvedValueOnce(characterY);

    mockBattleRoundService.generateBattleRounds.mockReturnValue({
      rounds: [],
      winner: characterX,
      loser: characterY
    });
    mockDomainService.buildCreateModel.mockReturnValue(battleModel);
    mockDomainService.toOutput.mockReturnValue(battleOutput);
    mockRepository.saveBattle.mockResolvedValue(undefined);

    const result = await useCase.createBattle(input);

    expect(result).toEqual(battleOutput);
    expect(mockRepository.saveBattle).toHaveBeenCalledWith({ Battle: battleModel });
    expect(mockKillCharacterService.execute).toHaveBeenCalledWith(characterY);
  });

  it('should throw an error when character X is not found', async () => {
    const input = {
      characterXId: 'character-999',
      characterYId: 'character-002',
      characterXJob: SupportedJobs.WARRIOR,
      characterYJob: SupportedJobs.MAGE
    };

    mockEnsureCharacterService.ensureExists
      .mockRejectedValueOnce(new ErrorHandler('Character not found.', 404));

    await expect(useCase.createBattle(input))
      .rejects
      .toThrow(new ErrorHandler('Character not found.', 404));
  });

  it('should get a battle successfully', async () => {
    const input = {
      battleId: 'battle-001',
      characterXId: 'character-001',
      characterYId: 'character-002',
      characterXJob: SupportedJobs.WARRIOR,
      characterYJob: SupportedJobs.MAGE
    };

    const mockKeys = { pk: 'user-123', sk: 'battle-001' };
    const battleModel = {
      pk: 'user-123',
      sk: 'battle-001',
      entityType: 'Battle',
      characterX: {
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
      },
      characterY: {
        characterId: 'character-002',
        name: 'Hero2',
        job: SupportedJobs.MAGE,
        status: SupportedStates.ALIVE,
        lifePoints: 100,
        currentLifePoints: 100,
        strength: 8,
        dexterity: 12,
        intelligence: 15,
        attackModifier: 8,
        speedModifier: 12,
        entityType: 'Character',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      rounds: [],
      winner: {
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
      },
      loser: {
        characterId: 'character-002',
        name: 'Hero2',
        job: SupportedJobs.MAGE,
        status: SupportedStates.DEAD,
        lifePoints: 100,
        currentLifePoints: 0,
        strength: 8,
        dexterity: 12,
        intelligence: 15,
        attackModifier: 8,
        speedModifier: 12,
        entityType: 'Character',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const battleOutput: GetBattleOutput = {
      battleId: 'battle-001',
      characterX: battleModel.characterX,
      characterY: battleModel.characterY,
      rounds: [],
      winner: battleModel.winner,
      loser: battleModel.loser,
      entityType: 'Battle',
      createdAt: battleModel.createdAt,
      updatedAt: battleModel.updatedAt
    };

    mockDomainService.getKeys.mockReturnValue(mockKeys);
    mockRepository.getBattleByKeys.mockResolvedValue(battleModel);
    mockDomainService.toOutput.mockReturnValue(battleOutput);

    const result = await useCase.getBattle(input);

    expect(result).toEqual(battleOutput);
  });

  it('should throw an error when keys are invalid', async () => {
    const input = {
      battleId: 'battle-001',
      characterXId: 'character-001',
      characterYId: 'character-002',
      characterXJob: SupportedJobs.WARRIOR,
      characterYJob: SupportedJobs.MAGE
    };

    mockDomainService.getKeys.mockReturnValue({ pk: '', sk: '' });

    await expect(useCase.getBattle(input))
      .rejects
      .toThrow(new ErrorHandler('Invalid battleId, characterXId or characterYId', 400));
  });

  it('should get all battles successfully', async () => {
    const battleModel = {
      pk: 'user-123',
      sk: 'battle-001',
      entityType: 'Battle',
      characterX: {
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
      },
      characterY: {
        characterId: 'character-002',
        name: 'Hero2',
        job: SupportedJobs.MAGE,
        status: SupportedStates.ALIVE,
        lifePoints: 100,
        currentLifePoints: 100,
        strength: 8,
        dexterity: 12,
        intelligence: 15,
        attackModifier: 8,
        speedModifier: 12,
        entityType: 'Character',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      rounds: [],
      winner: {
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
      },
      loser: {
        characterId: 'character-002',
        name: 'Hero2',
        job: SupportedJobs.MAGE,
        status: SupportedStates.DEAD,
        lifePoints: 100,
        currentLifePoints: 0,
        strength: 8,
        dexterity: 12,
        intelligence: 15,
        attackModifier: 8,
        speedModifier: 12,
        entityType: 'Character',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const battleOutput: GetBattleOutput = {
      battleId: 'battle-001',
      characterX: battleModel.characterX,
      characterY: battleModel.characterY,
      rounds: [],
      winner: battleModel.winner,
      loser: battleModel.loser,
      entityType: 'Battle',
      createdAt: battleModel.createdAt,
      updatedAt: battleModel.updatedAt
    };

    mockDomainService.getEntityType.mockReturnValue('Battle');
    mockRepository.getBattlesByEntityType.mockResolvedValue([battleModel]);
    mockDomainService.toOutputArray.mockReturnValue([battleOutput]);

    const result = await useCase.getBattles();

    expect(result).toEqual([battleOutput]);
  });
});
