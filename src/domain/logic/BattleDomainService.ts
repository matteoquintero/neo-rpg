import { CreateBattleInput, CreateBattleInputExtended, GetBattleOutput } from "../../application/dto/BattleDto";
import { SupportedJobs } from "../../shared/enums/Domains";
import { ErrorHandler } from "../../shared/utilities/ErrorHandler";
import { BattleModel } from "../models/BattleModel";

export class BattleDomainService {
  constructor() { }

  getKeys({ battleId, characterXId, characterYId, characterXJob, characterYJob }: { battleId: string, characterXId: string, characterYId: string, characterXJob: SupportedJobs, characterYJob: SupportedJobs }): { pk: string | undefined; sk: string | undefined } {
    return BattleModel.getKeys({ battleId, characterXId, characterYId, characterXJob, characterYJob });
  }

  getEntityType(): string {
    return BattleModel.BattleEntityType();
  }

  buildCreateModel(input: CreateBattleInputExtended & { BattleId: string }): BattleModel {
    return new BattleModel(
      {
        battleId: input.BattleId,
        characterX: input.characterX,
        characterY: input.characterY,
        rounds: input.rounds,
        winner: input.winner,
        loser: input.loser
      }
    );
  }

  toOutput(model: BattleModel): GetBattleOutput {
    if (!model.pk || !model.sk) {
      throw new ErrorHandler("Invalid model: pk or sk keys are missing.", 400);
    }
    const battleId = BattleModel.ExtractBattleIdFromSk({ sk: model.sk });
    const entityType = BattleModel.ExtractEntityType({ entityType: model.entityType });

    return {
      battleId,
      characterX: model.characterX,
      characterY: model.characterY,
      rounds: model.rounds,
      winner: model.winner,
      loser: model.loser,
      entityType,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    };
  }

  toOutputArray(models: BattleModel[] | null): GetBattleOutput[] {
    if (!models?.length) return [];
    return models.map((m) => this.toOutput(m));
  }

  ensureExists<T>(model: T | null | T[]): T {
    if (!model || Array.isArray(model)) {
      throw new ErrorHandler(`Entity battle not found.`, 404);
    }
    return model;
  }

}
