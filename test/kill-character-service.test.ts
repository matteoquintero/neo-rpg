import { KillCharacterService } from '../src/domain/services/KillCharacterService';
import { CharacterUseCase } from '../src/application/cases/CharacterUseCase';
import { GetCharacterOutput } from '../src/application/dto/CharacterDto';
import { SupportedJobs, SupportedStates } from '../src/shared/enums/Domains';
import { CharacterModel } from '../src/domain/models/CharacterModel';

describe('KillCharacterService', () => {
  let service: KillCharacterService;
  let mockCharacterUseCase: jest.Mocked<CharacterUseCase>;

  beforeEach(() => {
    mockCharacterUseCase = {
      updateCharacter: jest.fn()
    } as unknown as jest.Mocked<CharacterUseCase>;

    service = new KillCharacterService(mockCharacterUseCase);
  });

  it('should call updateCharacter with correct input', async () => {
    const character: GetCharacterOutput = {
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

    await service.execute(character);

    expect(mockCharacterUseCase.updateCharacter).toHaveBeenCalledWith({
      characterId: character.characterId,
      job: character.job,
      status: SupportedStates.ALIVE,
      updates: {
        sk: CharacterModel.CharacterSk({ status: SupportedStates.DEAD, characterId: character.characterId }),
        status: SupportedStates.DEAD,
        currentLifePoints: 0
      }
    });
  });
});
