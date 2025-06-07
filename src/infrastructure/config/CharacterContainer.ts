import { CharacterUseCase } from "../../application/cases/CharacterUseCase";
import { CharacterDomainService } from "../../domain/logic/CharacterDomainService";
import { CharacterHandler } from "../../presentation/handlers/CharacterHandler";
import { CharacterRouter } from "../../presentation/router/CharacterRouter";
import { CharacterRepository } from "../repositories/CharacterRepository";

const INSTANCE_TABLE_NAME = process.env.INSTANCE_TABLE_NAME as string;
const TEMPLATE_TABLE_NAME = process.env.TEMPLATE_TABLE_NAME as string;

const CharacterRepository = new CharacterRepository(INSTANCE_TABLE_NAME);
const CharacterDomainService = new CharacterDomainService();
const CharacterUseCase = new CharacterUseCase(
  CharacterDomainService,
  CharacterRepository
);
const CharacterRouter = new CharacterRouter(CharacterUseCase);
const CharacterHandler = new CharacterHandler(CharacterRouter);

export { CharacterHandler };
