import { GetCharacterOutput } from "../../application/dto/CharacterDto";

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
  winner: GetCharacterOutput | null;
  loser: GetCharacterOutput | null;
  rounds: BattleRound[];
}

export interface BattleResult {
  rounds: BattleRound[];
  winner: GetCharacterOutput;
  loser: GetCharacterOutput | null;
}
