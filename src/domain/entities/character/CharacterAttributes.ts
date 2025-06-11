export class CharacterAttributes {
  private readonly healthPoints: number;
  private readonly strength: number;
  private readonly dexterity: number;
  private readonly intelligence: number;

  constructor({ healthPoints, strength, dexterity, intelligence }: { healthPoints: number, strength: number, dexterity: number, intelligence: number }) {
    this.healthPoints = healthPoints;
    this.strength = strength;
    this.dexterity = dexterity;
    this.intelligence = intelligence;
  }

  getHealthPoints(): number {
    return this.healthPoints;
  }

  getStrength(): number {
    return this.strength;
  }

  getDexterity(): number {
    return this.dexterity;
  }

  getIntelligence(): number {
    return this.intelligence;
  }

  calculateAttackModifier(): number {
    return 0;
  }

  calculateSpeedModifier(): number {
    return 0;
  }
}
