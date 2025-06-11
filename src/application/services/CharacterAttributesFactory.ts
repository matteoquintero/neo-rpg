import { CharacterAttributes } from '../../domain/entities/character/CharacterAttributes';
import { WarriorAttributes } from '../../domain/entities/character/jobs/WarriorAttributes';
import { ThiefAttributes } from '../../domain/entities/character/jobs/ThiefAttributes';
import { MageAttributes } from '../../domain/entities/character/jobs/MageAttributes';
import { SupportedJobs } from '../../shared/enums/Domains';

export interface CreateAttributesInput {
  job: SupportedJobs;
  healthPoints?: number;
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  attackModifier?: number;
  speedModifier?: number;
}

export class CharacterAttributesFactory {
  createAttributes({ job, healthPoints, strength, dexterity, intelligence }: CreateAttributesInput): CharacterAttributes {

    switch (job) {
      case SupportedJobs.WARRIOR:
        return new WarriorAttributes({ healthPoints, strength, dexterity, intelligence });
      case SupportedJobs.THIEF:
        return new ThiefAttributes({ healthPoints, strength, dexterity, intelligence });
      case SupportedJobs.MAGE:
        return new MageAttributes({ healthPoints, strength, dexterity, intelligence });
      default:
        throw new Error(`Invalid job type: ${job}`);
    }
  }
}
