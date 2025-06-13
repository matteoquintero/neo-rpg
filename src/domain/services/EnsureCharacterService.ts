import { ErrorHandler } from "../../shared/utilities/ErrorHandler";
import { CharacterRepository } from "../../infrastructure/repositories/CharacterRepository";
import { CharacterDomainService } from "../logic/CharacterDomainService";
import { SupportedJobs, SupportedStates } from "../../shared/enums/Domains";
import { GetCharacterOutput } from "../../application/dto/CharacterDto";
import { Logger } from "../../infrastructure/logger/Logger";
export class EnsureCharacterService {
  constructor(
    private readonly repository: CharacterRepository,
    private readonly domainService: CharacterDomainService
  ) { }

  async ensureExists({
    status,
    job,
    characterId
  }: {
    status: SupportedStates;
    job: SupportedJobs;
    characterId: string;
  }): Promise<GetCharacterOutput> {
    const { pk, sk } = this.domainService.getKeys({
      status: status,
      job: job,
      characterId: characterId
    });
    if (!pk || !sk) {
      throw new ErrorHandler("Invalid status, job or characterId", 400);
    }
    Logger.info(`Getting character by keys: ${pk} and ${sk}`);
    const existingCreator = await this.repository.getCharacterByKeys({
      pk,
      sk
    });

    if (!existingCreator) {
      throw new ErrorHandler("Character not found.", 404);
    }
    return this.domainService.toOutput(existingCreator);
  }
}
