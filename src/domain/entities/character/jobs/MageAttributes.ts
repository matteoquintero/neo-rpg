import { CharacterAttributes } from '../CharacterAttributes';

export class MageAttributes extends CharacterAttributes {
  constructor({ healthPoints = 12, strength = 5, dexterity = 6, intelligence = 10 }: { healthPoints?: number, strength?: number, dexterity?: number, intelligence?: number }) {
    super({ healthPoints, strength, dexterity, intelligence });
  }

  calculateAttackModifier(): number {
    return (this.getStrength() * 0.2) + (this.getDexterity() * 0.2) + (this.getIntelligence() * 1.2);
  }

  calculateSpeedModifier(): number {
    return (this.getDexterity() * 0.4) + (this.getStrength() * 0.1);
  }
}
