import { GetCharacterOutput } from "../../application/dto/CharacterDto";
import { SupportedJobs } from "../enums/Domains";

export interface BattleTurn {
  turnNumber: number;
  characterAttacking: GetCharacterOutput;
  characterAttackingDamage: number;
  characterDefending: GetCharacterOutput;
  characterDefendingRemaining: number;
}

export interface BattleRound {
  roundNumber: number;
  characterXSpeed: number;
  characterYSpeed: number;
  turns: BattleTurn[];
}

export type BattleModelType = {
  battleId: string;
  characterX: GetCharacterOutput;
  characterY: GetCharacterOutput;
  rounds: BattleRound[];
}
