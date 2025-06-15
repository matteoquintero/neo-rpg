import { v4 as uuidv4 } from "uuid";
import {
  CreateCharacterInput,
  GetCharacterInput,
  GetCharacterOutput,
  UpdateCharacterInput,
} from "../dto/CharacterDto";

import { CharacterDomainService } from "../../domain/logic/CharacterDomainService";
import { CharacterRepository } from "../../infrastructure/repositories/CharacterRepository";
import { DatabaseHandler } from "../../shared/utilities/DatabaseHandler";
import { ErrorHandler } from "../../shared/utilities/ErrorHandler";
import { Logger } from "../../infrastructure/logger/Logger";

export class CharacterUseCase {
  constructor(
    private readonly domainService: CharacterDomainService,
    private readonly repository: CharacterRepository
  ) { }

  async createCharacter(
    input: CreateCharacterInput
  ): Promise<GetCharacterOutput> {

    const CharacterId = uuidv4();
    const CharacterModel = this.domainService.buildCreateModel({
      ...input,
      CharacterId,
    });

    await DatabaseHandler.execute(
      () => this.repository.saveCharacter({
        Character: CharacterModel
      }),
      `Character ${CharacterId} created successfully.`,
      `Error creating character ${CharacterId}.`
    );

    return this.domainService.toOutput(CharacterModel);
  }

  async updateCharacter(
    input: UpdateCharacterInput
  ): Promise<GetCharacterOutput> {

    const { pk, sk } = this.domainService.getKeys({
      status: input.status,
      job: input.job,
      characterId: input.characterId
    });
    if (!pk || !sk) {
      throw new ErrorHandler("Invalid status, job or characterId", 400);
    }

    const existing = await DatabaseHandler.execute(
      () => this.repository.getCharacterByKeys({
        pk,
        sk
      }),
      `Validating existence of character ${input.characterId}.`,
      `Error retrieving character ${input.characterId}.`
    );
    this.domainService.ensureExists(existing);
    if (!existing) {
      throw new ErrorHandler("Character not found", 404);
    }
    Logger.info(`Updating character ${input.characterId} ${pk} ${sk} with status ${input.updates.status}`);
    const updated = await DatabaseHandler.execute(
      () => this.repository.updateCharacter({
        pk,
        sk,
        newSk: input.updates.sk,
        updates: input.updates
      }),
      `Character ${input.characterId} updated successfully.`,
      `Error updating character ${input.characterId}.`
    );

    return this.domainService.toOutput(updated);
  }

  async getCharacter(
    input: GetCharacterInput
  ): Promise<GetCharacterOutput> {
    const { pk, sk } = this.domainService.getKeys({
      status: input.status,
      job: input.job,
      characterId: input.characterId
    });
    if (!pk || !sk) {
      throw new ErrorHandler("Invalid status, job or characterId", 400);
    }

    const models = await DatabaseHandler.execute(
      () =>
        this.repository.getCharacterByKeys({
          pk,
          sk
        }),
      `Characters retrieved for status ${input.status} and job ${input.job}.`,
      `Error retrieving characters for status ${input.status} and job ${input.job}.`
    );

    return this.domainService.toOutput(models!);
  }

  async getCharacters(): Promise<GetCharacterOutput[]> {
    const entityType = this.domainService.getEntityType();
    const models = await DatabaseHandler.execute(
      () =>
        this.repository.getCharactersByEntityType({
          entityType
        }),
      `Characters retrieved for entity type ${entityType}.`,
      `Error retrieving characters for entity type ${entityType}.`
    );
    return this.domainService.toOutputArray(models);
  }


}
