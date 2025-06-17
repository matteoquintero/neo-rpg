import { CharacterUseCase } from "../../application/cases/CharacterUseCase";
import { CharacterDomainService } from "../../domain/logic/CharacterDomainService";
import { CharacterHandler } from "../../presentation/handlers/CharacterHandler";
import { CharacterRouter } from "../../presentation/router/CharacterRouter";
import { CharacterRepository } from "../repositories/CharacterRepository";
import { CharacterAttributesFactory } from "../../application/services/CharacterAttributesFactory";
import { BattleDomainService } from "../../domain/logic/BattleDomainService";
import { BattleHandler } from "../../presentation/handlers/BattleHandler";
import { BattleRouter } from "../../presentation/router/BattleRouter";
import { BattleRepository } from "../repositories/BattleRepository";
import { BattleUseCase } from "../../application/cases/BattleUseCase";
import { EnsureCharacterService } from "../../domain/services/EnsureCharacterService";
import { KillCharacterService } from "../../domain/services/KillCharacterService";
import { BattleRoundService } from "../../domain/services/BattleRoundService";

const NEO_RPG_TABLE_NAME = process.env.NEO_RPG_TABLE_NAME as string;

// Repositories
const CharacterRepositoryObject = CharacterRepository.getInstance(NEO_RPG_TABLE_NAME);
const BattleRepositoryObject = BattleRepository.getInstance(NEO_RPG_TABLE_NAME);

// Factories and Services
const CharacterAttributesFactoryObject = new CharacterAttributesFactory();
const CharacterDomainServiceObject = new CharacterDomainService(CharacterAttributesFactoryObject);
const BattleDomainServiceObject = new BattleDomainService();
const EnsureCharacterServiceObject = new EnsureCharacterService(
  CharacterRepositoryObject,
  CharacterDomainServiceObject
);

const BattleRoundServiceObject = new BattleRoundService();
// Use Cases
const CharacterUseCaseObject = new CharacterUseCase(
  CharacterDomainServiceObject,
  CharacterRepositoryObject
);
const KillCharacterServiceObject = new KillCharacterService(
  CharacterUseCaseObject
);
const BattleUseCaseObject = new BattleUseCase(
  BattleDomainServiceObject,
  BattleRepositoryObject,
  EnsureCharacterServiceObject,
  KillCharacterServiceObject,
  BattleRoundServiceObject
);

// Routers
const CharacterRouterObject = new CharacterRouter(CharacterUseCaseObject);
const BattleRouterObject = new BattleRouter(BattleUseCaseObject);

// Handlers
const CharacterHandlerObject = new CharacterHandler(CharacterRouterObject);
const BattleHandlerObject = new BattleHandler(BattleRouterObject);

export { CharacterHandlerObject, BattleHandlerObject };
