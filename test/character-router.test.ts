import { CharacterRouter } from '../src/presentation/router/CharacterRouter';
import { CharacterUseCase } from '../src/application/cases/CharacterUseCase';
import { CharacterMiddleware } from '../src/presentation/middlewares/CharacterMiddleware';
import { SupportedJobs, SupportedStates } from '../src/shared/enums/Domains';
import { APIGatewayProxyResult } from 'aws-lambda';
import { GetCharacterOutput } from '../src/application/dto/CharacterDto';

jest.mock('../src/presentation/middlewares/CharacterMiddleware');

describe('CharacterRouter', () => {
  let router: CharacterRouter;
  let mockUseCase: jest.Mocked<CharacterUseCase>;
  let mockMiddleware: jest.Mocked<CharacterMiddleware>;

  const createMockCharacter = (): GetCharacterOutput => ({
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
  });

  beforeEach(() => {
    mockUseCase = {
      createCharacter: jest.fn(),
      updateCharacter: jest.fn(),
      getCharacter: jest.fn(),
      getCharacters: jest.fn()
    } as unknown as jest.Mocked<CharacterUseCase>;

    mockMiddleware = {
      validate: jest.fn()
    } as unknown as jest.Mocked<CharacterMiddleware>;

    (CharacterMiddleware as jest.Mock).mockImplementation(() => mockMiddleware);

    router = new CharacterRouter(mockUseCase);
  });

  describe('validateRequest', () => {
    it('should call middleware validate method with correct parameters', () => {
      const method = 'POST';
      const path = '/character';
      const input = {
        name: 'Hero1',
        job: SupportedJobs.WARRIOR
      };

      router.validateRequest(method, path, input);

      expect(mockMiddleware.validate).toHaveBeenCalledWith(method, path, input);
    });

    it('should return null when middleware validation passes', () => {
      mockMiddleware.validate.mockReturnValue(null);

      const result = router.validateRequest('POST', '/character', {});

      expect(result).toBeNull();
    });

    it('should return error response when middleware validation fails', () => {
      const errorResponse: APIGatewayProxyResult = {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid input' })
      };
      mockMiddleware.validate.mockReturnValue(errorResponse);

      const result = router.validateRequest('POST', '/character', {});

      expect(result).toEqual(errorResponse);
    });

    it('should return error response when character name is invalid', () => {
      const errorResponse: APIGatewayProxyResult = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid character name',
          errors: ['Character name must be between 3 and 50 characters']
        })
      };
      mockMiddleware.validate.mockReturnValue(errorResponse);

      const result = router.validateRequest('POST', '/character', {
        name: 'A',
        job: SupportedJobs.WARRIOR
      });

      expect(result).toEqual(errorResponse);
      expect(mockMiddleware.validate).toHaveBeenCalledWith(
        'POST',
        '/character',
        {
          name: 'A',
          job: SupportedJobs.WARRIOR
        }
      );
    });
  });

  describe('getRouteHandler', () => {
    it('should return handler for POST /character', async () => {
      const mockCharacter = createMockCharacter();
      mockUseCase.createCharacter.mockResolvedValue(mockCharacter);

      const handler = router.getRouteHandler('POST', '/character', {
        name: 'Hero1',
        job: SupportedJobs.WARRIOR
      });

      expect(handler).toBeDefined();
      const result = await handler!();
      expect(result.statusCode).toBe(201);
      expect(JSON.parse(result.body)).toEqual({
        character: mockCharacter,
        message: 'Character created successfully'
      });
    });

    it('should return handler for PUT /character', async () => {
      const mockCharacter = createMockCharacter();
      mockUseCase.updateCharacter.mockResolvedValue(mockCharacter);

      const handler = router.getRouteHandler('PUT', '/character', {
        characterId: 'character-001',
        name: 'Hero1 Updated',
        job: SupportedJobs.WARRIOR
      });

      expect(handler).toBeDefined();
      const result = await handler!();
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({
        character: mockCharacter,
        message: 'Character updated successfully'
      });
    });

    it('should return handler for GET /character', async () => {
      const mockCharacter = createMockCharacter();
      mockUseCase.getCharacter.mockResolvedValue(mockCharacter);

      const handler = router.getRouteHandler('GET', '/character', {
        characterId: 'character-001'
      });

      expect(handler).toBeDefined();
      const result = await handler!();
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ characters: mockCharacter });
    });

    it('should return handler for GET /characters', async () => {
      const mockCharacters = [createMockCharacter()];
      mockUseCase.getCharacters.mockResolvedValue(mockCharacters);

      const handler = router.getRouteHandler('GET', '/characters', {});

      expect(handler).toBeDefined();
      const result = await handler!();
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ characters: mockCharacters });
    });

    it('should return undefined for invalid route', () => {
      const handler = router.getRouteHandler('DELETE', '/invalid', {});

      expect(handler).toBeUndefined();
    });
  });
});
