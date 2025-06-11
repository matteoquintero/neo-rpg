import { CharacterAttributes } from '../CharacterAttributes';

export class ThiefAttributes extends CharacterAttributes {
  constructor({ healthPoints = 15, strength = 4, dexterity = 10, intelligence = 4 }: { healthPoints?: number, strength?: number, dexterity?: number, intelligence?: number }) {
    super({ healthPoints, strength, dexterity, intelligence });
  }

  calculateAttackModifier(): number {
    return (this.getStrength() * 0.25) + this.getDexterity() + (this.getIntelligence() * 0.25);
  }

  calculateSpeedModifier(): number {
    return this.getDexterity() * 0.8;
  }
}
