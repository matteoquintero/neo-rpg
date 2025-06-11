import { CharacterAttributes } from '../CharacterAttributes';

export class WarriorAttributes extends CharacterAttributes {
  constructor({ healthPoints = 20, strength = 10, dexterity = 5, intelligence = 5 }: { healthPoints?: number, strength?: number, dexterity?: number, intelligence?: number }) {
    super({ healthPoints, strength, dexterity, intelligence });
  }

  calculateAttackModifier(): number {
    return (this.getStrength() * 0.8) + (this.getDexterity() * 0.2);
  }

  calculateSpeedModifier(): number {
    return (this.getDexterity() * 0.6) + (this.getIntelligence() * 0.2);
  }
}
