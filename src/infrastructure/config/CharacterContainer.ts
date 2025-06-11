import { CharacterUseCase } from "../../application/cases/CharacterUseCase";
import { CharacterDomainService } from "../../domain/logic/CharacterDomainService";
import { CharacterHandler } from "../../presentation/handlers/CharacterHandler";
import { CharacterRouter } from "../../presentation/router/CharacterRouter";
import { CharacterRepository } from "../../infrastructure/repositories/CharacterRepository";

const CHARACTERS_TABLE_NAME = process.env.CHARACTERS_TABLE_NAME as string;

const CharacterRepositoryObject = new CharacterRepository(CHARACTERS_TABLE_NAME);
const CharacterDomainServiceObject = new CharacterDomainService();
const CharacterUseCaseObject = new CharacterUseCase(
  CharacterDomainServiceObject,
  CharacterRepositoryObject
);
const CharacterRouterObject = new CharacterRouter(CharacterUseCaseObject);
const CharacterHandlerObject = new CharacterHandler(CharacterRouterObject);

export { CharacterHandlerObject };
