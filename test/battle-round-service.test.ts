import { BattleRoundService } from '../src/domain/services/BattleRoundService';
import { GetCharacterOutput } from '../src/application/dto/CharacterDto';
import { SupportedJobs, SupportedStates } from '../src/shared/enums/Domains';

describe('BattleRoundService', () => {
  let service: BattleRoundService;
  let characterX: GetCharacterOutput;
  let characterY: GetCharacterOutput;

  beforeEach(() => {
    service = new BattleRoundService();
    characterX = {
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
    characterY = {
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate a random number between 0 and max', () => {
    // @ts-ignore: access private method for test
    const result = service.generateRandomNumber(5);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(5);
  });

  it('should determine the first attacker based on speed', () => {
    // Force deterministic outcome
    jest.spyOn<any, any>(service, 'generateRandomNumber').mockImplementationOnce(() => 10).mockImplementationOnce(() => 5);
    // @ts-ignore: access private method for test
    const attacker = service.determineFirstAttacker(characterX, characterY);
    expect(attacker).toBe(characterX);
  });

  it('should retry if speed is a draw', () => {
    const mockRandom = jest.fn()
      .mockReturnValueOnce(7)
      .mockReturnValueOnce(7)
      .mockReturnValueOnce(9)
      .mockReturnValueOnce(5);
    jest.spyOn<any, any>(service, 'generateRandomNumber').mockImplementation(mockRandom);
    // @ts-ignore: access private method for test
    const attacker = service.determineFirstAttacker(characterX, characterY);
    expect(attacker).toBe(characterX);
    expect(mockRandom).toHaveBeenCalledTimes(4);
  });

  it('should calculate damage based on attackModifier', () => {
    jest.spyOn<any, any>(service, 'generateRandomNumber').mockReturnValue(7);
    // @ts-ignore: access private method for test
    const damage = service.calculateDamage(characterX);
    expect(damage).toBe(7);
  });

  it('should create a turn with correct damage and remaining health', () => {
    jest.spyOn<any, any>(service, 'calculateDamage').mockReturnValue(15);
    // @ts-ignore: access private method for test
    const turn = service.createTurn(1, characterX, characterY);
    expect(turn.turnNumber).toBe(1);
    expect(turn.characterAttacking).toEqual(characterX);
    expect(turn.characterDefending).toEqual(characterY);
    expect(turn.characterAttackingDamage).toBe(15);
    expect(turn.characterDefendingRemaining).toBe(characterY.currentLifePoints - 15);
  });

  it('should generate a single round with one or two turns', () => {
    const mockRandom = jest.fn()
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(30)
      .mockReturnValueOnce(100);
    jest.spyOn<any, any>(service, 'generateRandomNumber').mockImplementation(mockRandom);
    // @ts-ignore: access private method for test
    const round = service.generateSingleRound(characterX, characterY);
    expect(round.turns.length).toBe(2);
    expect(round.turns[0].characterAttacking.characterId).toBe(characterX.characterId);
    expect(round.turns[1].characterAttacking.characterId).toBe(characterY.characterId);
    expect(round.turns[0].characterAttackingDamage).toBe(30);
    expect(round.turns[1].characterAttackingDamage).toBe(100);
    expect(round.turns[1].characterDefendingRemaining).toBe(0);
  });

  it('should generate a single round with only one turn if defender is defeated', () => {
    const mockRandom = jest.fn()
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(100);
    jest.spyOn<any, any>(service, 'generateRandomNumber').mockImplementation(mockRandom);
    // @ts-ignore: access private method for test
    const round = service.generateSingleRound(characterX, characterY);
    expect(round.turns.length).toBe(1);
    expect(round.turns[0].characterAttacking).toEqual(characterX);
    expect(round.turns[0].characterAttackingDamage).toBe(100);
    expect(round.turns[0].characterDefendingRemaining).toBe(0);
  });

  it('should simulate a full battle and return winner and loser', () => {
    jest.spyOn<any, any>(service, 'generateSingleRound').mockImplementation((x, y) => {
      const charX = x as GetCharacterOutput;
      const charY = y as GetCharacterOutput;
      charY.currentLifePoints = 0;
      return {
        roundNumber: 1,
        characterXSpeed: charX.speedModifier,
        characterYSpeed: charY.speedModifier,
        turns: [{
          turnNumber: 1,
          characterAttacking: charX,
          characterAttackingDamage: 100,
          characterDefending: charY,
          characterDefendingRemaining: 0
        }]
      };
    });
    const result = service.generateBattleRounds(characterX, characterY);
    expect(result.rounds.length).toBe(1);
    expect(result.winner.characterId).toBe(characterX.characterId);
    expect(result.loser?.characterId).toBe(characterY.characterId);
    expect(result.loser?.currentLifePoints).toBe(0);
  });

  it('should reset the round counter', () => {
    // @ts-ignore: access private property
    service.currentRound = 5;
    service.resetRounds();
    // @ts-ignore: access private property
    expect(service.currentRound).toBe(1);
  });
});
