import { SupportedJobs } from "../../shared/enums/Domains";
import { BattleRound } from "../../shared/types/BattleModelType";
import { GetCharacterOutput } from "./CharacterDto";

export interface CreateBattleInput {
  characterXId: string;
  characterXJob: SupportedJobs;
  characterYId: string;
  characterYJob: SupportedJobs;
}

export interface CreateBattleInputExtended {
  rounds: BattleRound[];
  characterX: GetCharacterOutput;
  characterY: GetCharacterOutput;
}

export interface GetBattleInput {
  battleId: string;
  characterXId: string;
  characterXJob: SupportedJobs;
  characterYId: string;
  characterYJob: SupportedJobs;
}

export interface GetBattleOutput {
  battleId: string;
  characterX: GetCharacterOutput;
  characterY: GetCharacterOutput;
  rounds: BattleRound[];
  entityType: string;
  createdAt: string;
  updatedAt: string;
}
