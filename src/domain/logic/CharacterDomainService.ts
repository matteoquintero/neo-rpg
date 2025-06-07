import { CreateCharacterInput, GetCharacterOutput } from "../../application/dto/CharacterDto";
import { CHARACTER_PREFIX, JOB_PREFIX, STATE_PREFIX } from "../../shared/constants/Identifiers";
import { SupportedJobs, SupportedStates } from "../../shared/enums/Domains";
import { ErrorHandler } from "../../shared/utilities/ErrorHandler";
import { CharacterModel } from "../models/CharacterModel";

export class CharacterDomainService {

  getKeys({ status, job, characterId }: { status?: SupportedStates; job?: SupportedJobs; characterId?: string }): { pk: string | undefined; sk: string | undefined } {
    return CharacterModel.getKeys({ status, job, characterId });
  }

  buildModelFromInput(
    input: CreateCharacterInput & { CharacterId: string }
  ): CharacterModel {
    return new CharacterModel({
      characterId: input.CharacterId,
      status: input.status,
      name: input.name,
      job: input.job,
      lifePoints: input.lifePoints,
      strength: input.strength,
      dexterity: input.dexterity,
      intelligence: input.intelligence,
      attackModifier: input.attackModifier,
      speedModifier: input.speedModifier,
    });
  }

  toOutput(model: CharacterModel): GetCharacterOutput {
    if (!model.pk || !model.sk) {
      throw new ErrorHandler("Invalid model: pk or sk keys are missing.", 400);
    }

    const status = model.pk.replace(`${STATE_PREFIX}#`, "") as SupportedStates;
    const job = model.sk.replace(`${JOB_PREFIX}#`, "") as SupportedJobs;
    const characterId = model.sk.replace(`${CHARACTER_PREFIX}#`, "");

    return {
      status,
      job,
      characterId,
      name: model.name,
      lifePoints: model.lifePoints,
      strength: model.strength,
      dexterity: model.dexterity,
      intelligence: model.intelligence,
      attackModifier: model.attackModifier,
      speedModifier: model.speedModifier,
      entityType: model.entityType,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  toOutputArray(models: CharacterModel[] | null): GetCharacterOutput[] {
    if (!models?.length) return [];
    return models.map((m) => this.toOutput(m));
  }

  ensureExists<T>(model: T | null | T[]): T {
    if (!model || Array.isArray(model)) {
      throw new ErrorHandler(`Entity character not found.`, 404);
    }
    return model;
  }
}
