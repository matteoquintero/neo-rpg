import { CreateCharacterInput, GetCharacterOutput, UpdateCharacterInput } from "../../application/dto/CharacterDto";
import { SupportedJobs, SupportedStates } from "../../shared/enums/Domains";
import { ErrorHandler } from "../../shared/utilities/ErrorHandler";
import { CharacterModel } from "../models/CharacterModel";
import { CharacterAttributesFactory, CreateAttributesInput } from "../../application/services/CharacterAttributesFactory";
import { Logger } from "../../infrastructure/logger/Logger";

export class CharacterDomainService {
  constructor(
    private readonly characterAttributesFactory: CharacterAttributesFactory
  ) { }

  getKeys({ status, job, characterId }: { status?: SupportedStates; job?: SupportedJobs; characterId?: string }): { pk: string | undefined; sk: string | undefined } {
    return CharacterModel.getKeys({ status, job, characterId });
  }

  getEntityType(): string {
    return CharacterModel.CharacterEntityType();
  }

  buildCreateModel(
    input: CreateCharacterInput & { CharacterId: string }
  ): CharacterModel {

    const jobAttributes = this.characterAttributesFactory.createAttributes({
      job: input.job,
    });

    return new CharacterModel({
      characterId: input.CharacterId,
      status: SupportedStates.ALIVE,
      name: input.name,
      job: input.job,
      lifePoints: jobAttributes.getHealthPoints(),
      strength: jobAttributes.getStrength(),
      dexterity: jobAttributes.getDexterity(),
      intelligence: jobAttributes.getIntelligence(),
      attackModifier: jobAttributes.calculateAttackModifier(),
      speedModifier: jobAttributes.calculateSpeedModifier(),
    });
  }

  buildUpdateAttributes(existing: CharacterModel, updates: Partial<CharacterModel>): CreateAttributesInput {
    const jobAttributes = this.characterAttributesFactory.createAttributes({
      job: existing.job,
      healthPoints: updates.lifePoints,
      strength: updates.strength,
      dexterity: updates.dexterity,
      intelligence: updates.intelligence,
    });

    return {
      job: existing.job,
      healthPoints: jobAttributes.getHealthPoints(),
      strength: jobAttributes.getStrength(),
      dexterity: jobAttributes.getDexterity(),
      intelligence: jobAttributes.getIntelligence(),
      attackModifier: jobAttributes.calculateAttackModifier(),
      speedModifier: jobAttributes.calculateSpeedModifier(),
    };
  }

  toOutput(model: CharacterModel): GetCharacterOutput {
    if (!model.pk || !model.sk) {
      throw new ErrorHandler("Invalid model: pk or sk keys are missing.", 400);
    }
    const characterId = CharacterModel.ExtractCharacterIdFromSk({ sk: model.sk, job: model.job });
    const entityType = CharacterModel.ExtractEntityType({ entityType: model.entityType });

    return {
      characterId,
      job: model.job,
      status: model.status,
      name: model.name,
      lifePoints: model.lifePoints,
      strength: model.strength,
      dexterity: model.dexterity,
      intelligence: model.intelligence,
      attackModifier: model.attackModifier,
      speedModifier: model.speedModifier,
      entityType,
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
