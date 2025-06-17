import { BattleRouter } from '../src/presentation/router/BattleRouter';
import { BattleUseCase } from '../src/application/cases/BattleUseCase';
import { BattleMiddleware } from '../src/presentation/middlewares/BattleMiddleware';
import { SupportedJobs, SupportedStates } from '../src/shared/enums/Domains';
import { APIGatewayProxyResult } from 'aws-lambda';
import { GetBattleOutput } from '../src/application/dto/BattleDto';

jest.mock('../src/presentation/middlewares/BattleMiddleware');

describe('BattleRouter', () => {
  let router: BattleRouter;
  let mockUseCase: jest.Mocked<BattleUseCase>;
  let mockMiddleware: jest.Mocked<BattleMiddleware>;

  const createMockBattle = (): GetBattleOutput => ({
    battleId: 'battle-001',
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
    entityType: 'Battle',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  beforeEach(() => {
    mockUseCase = {
      createBattle: jest.fn(),
      getBattle: jest.fn(),
      getBattles: jest.fn()
    } as unknown as jest.Mocked<BattleUseCase>;

    mockMiddleware = {
      validate: jest.fn()
    } as unknown as jest.Mocked<BattleMiddleware>;

    (BattleMiddleware as jest.Mock).mockImplementation(() => mockMiddleware);

    router = new BattleRouter(mockUseCase);
  });

  describe('validateRequest', () => {
    it('should call middleware validate method with correct parameters', () => {
      const method = 'POST';
      const path = '/battle';
      const input = {
        characterXId: 'character-001',
        characterYId: 'character-002',
        characterXJob: SupportedJobs.WARRIOR,
        characterYJob: SupportedJobs.MAGE
      };

      router.validateRequest(method, path, input);

      expect(mockMiddleware.validate).toHaveBeenCalledWith(method, path, input);
    });

    it('should return null when middleware validation passes', () => {
      mockMiddleware.validate.mockReturnValue(null);

      const result = router.validateRequest('POST', '/battle', {});

      expect(result).toBeNull();
    });

    it('should return error response when middleware validation fails', () => {
      const errorResponse: APIGatewayProxyResult = {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid input' })
      };
      mockMiddleware.validate.mockReturnValue(errorResponse);

      const result = router.validateRequest('POST', '/battle', {});

      expect(result).toEqual(errorResponse);
    });
  });

  describe('getRouteHandler', () => {
    it('should return handler for POST /battle', async () => {
      const mockBattle = createMockBattle();
      mockUseCase.createBattle.mockResolvedValue(mockBattle);

      const handler = router.getRouteHandler('POST', '/battle', {
        characterXId: 'character-001',
        characterYId: 'character-002',
        characterXJob: SupportedJobs.WARRIOR,
        characterYJob: SupportedJobs.MAGE
      });

      expect(handler).toBeDefined();
      const result = await handler!();
      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toEqual({
        battle: mockBattle,
        message: 'Battle created successfully'
      });
    });

    it('should return handler for GET /battle', async () => {
      const mockBattle = createMockBattle();
      mockUseCase.getBattle.mockResolvedValue(mockBattle);

      const handler = router.getRouteHandler('GET', '/battle', {
        battleId: 'battle-001',
        characterXId: 'character-001',
        characterYId: 'character-002',
        characterXJob: SupportedJobs.WARRIOR,
        characterYJob: SupportedJobs.MAGE
      });

      expect(handler).toBeDefined();
      const result = await handler!();
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ battle: mockBattle });
    });

    it('should return handler for GET /battles', async () => {
      const mockBattles = [createMockBattle()];
      mockUseCase.getBattles.mockResolvedValue(mockBattles);

      const handler = router.getRouteHandler('GET', '/battles', {});

      expect(handler).toBeDefined();
      const result = await handler!();
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ battles: mockBattles });
    });

    it('should return undefined for invalid route', () => {
      const handler = router.getRouteHandler('PUT', '/invalid', {});

      expect(handler).toBeUndefined();
    });
  });
});
