import { GetCharacterOutput } from "../../application/dto/CharacterDto";
import { BattleRound, BattleTurn } from "../../shared/types/BattleModelType";

export class BattleRoundService {
  private currentRound: number = 1;

  private generateRandomNumber(max: number): number {
    return Math.floor(Math.random() * (max + 1));
  }

  private determineFirstAttacker(characterX: GetCharacterOutput, characterY: GetCharacterOutput): GetCharacterOutput {
    const characterXSpeed = this.generateRandomNumber(characterX.speedModifier);
    const characterYSpeed = this.generateRandomNumber(characterY.speedModifier);

    if (characterXSpeed > characterYSpeed) {
      return characterX;
    } else if (characterYSpeed > characterXSpeed) {
      return characterY;
    } else {
      // In case of a draw, try again
      return this.determineFirstAttacker(characterX, characterY);
    }
  }

  private calculateDamage(attacker: GetCharacterOutput): number {
    return this.generateRandomNumber(attacker.attackModifier);
  }

  private createTurn(
    turnNumber: number,
    attacker: GetCharacterOutput,
    defender: GetCharacterOutput
  ): BattleTurn {
    const damage = this.calculateDamage(attacker);
    const remainingHealth = Math.max(0, defender.lifePoints - damage);

    return {
      turnNumber,
      characterAttacking: { ...attacker },
      characterAttackingDamage: damage,
      characterDefending: { ...defender },
      characterDefendingRemaining: remainingHealth
    };
  }

  private generateSingleRound(
    characterX: GetCharacterOutput,
    characterY: GetCharacterOutput
  ): BattleRound {
    const round = {
      roundNumber: this.currentRound,
      characterXSpeed: characterX.speedModifier,
      characterYSpeed: characterY.speedModifier,
      turns: [] as BattleTurn[]
    };

    const firstAttacker = this.determineFirstAttacker(characterX, characterY);
    const secondAttacker = firstAttacker === characterX ? characterY : characterX;

    const firstTurn = this.createTurn(1, firstAttacker, secondAttacker);
    round.turns.push(firstTurn);

    // Update defender's health after first turn
    if (firstTurn.characterDefending === characterX) {
      characterX.lifePoints = firstTurn.characterDefendingRemaining;
    } else {
      characterY.lifePoints = firstTurn.characterDefendingRemaining;
    }

    // Only create second turn if the defender is still alive
    if (firstTurn.characterDefendingRemaining > 0) {
      const secondTurn = this.createTurn(2, secondAttacker, firstAttacker);
      round.turns.push(secondTurn);

      // Update defender's health after second turn
      if (secondTurn.characterDefending === characterX) {
        characterX.lifePoints = secondTurn.characterDefendingRemaining;
      } else {
        characterY.lifePoints = secondTurn.characterDefendingRemaining;
      }
    }

    this.currentRound++;
    return round;
  }

  public generateBattleRounds(
    characterX: GetCharacterOutput,
    characterY: GetCharacterOutput
  ): BattleRound[] {
    const rounds: BattleRound[] = [];
    let currentCharacterX = { ...characterX };
    let currentCharacterY = { ...characterY };

    while (currentCharacterX.lifePoints > 0 && currentCharacterY.lifePoints > 0) {
      const round = this.generateSingleRound(currentCharacterX, currentCharacterY);
      rounds.push(round);

      // Check if any character is defeated after the round
      if (currentCharacterX.lifePoints <= 0 || currentCharacterY.lifePoints <= 0) {
        break;
      }
    }

    return rounds;
  }

  public resetRounds(): void {
    this.currentRound = 1;
  }
}
