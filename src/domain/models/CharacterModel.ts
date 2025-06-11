;
import { CHARACTER_PREFIX, ENTITY_TYPE_PREFIX, JOB_PREFIX, NAME_PREFIX, STATE_PREFIX } from "../../shared/constants/Identifiers";
import { SupportedJobs, SupportedStates } from "../../shared/enums/Domains";
import { CharacterModelType } from "../../shared/types/CharacterModelType";
import { BaseModel } from "./BaseModel";

export class CharacterModel extends BaseModel {
  name: string;
  status: SupportedStates;
  job: SupportedJobs;
  lifePoints: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  attackModifier: number;
  speedModifier: number;

  constructor({ characterId, status, name, job, lifePoints, strength, dexterity, intelligence, attackModifier, speedModifier }: CharacterModelType) {
    super({
      pk: CharacterModel.CharacterPk({ status }),
      sk: CharacterModel.CharacterSk({ job, characterId }),
      entityType: CharacterModel.CharacterEntityType(),
    });
    this.name = name;
    this.status = status;
    this.job = job;
    this.lifePoints = lifePoints;
    this.strength = strength;
    this.dexterity = dexterity;
    this.intelligence = intelligence;
    this.attackModifier = attackModifier;
    this.speedModifier = speedModifier;
  }

  static CharacterPk({ status }: { status: SupportedStates }): string {
    return `${STATE_PREFIX}#${status}`;
  }

  static CharacterSk({ job, characterId }: { job: SupportedJobs, characterId: string }): string {
    return `${JOB_PREFIX}#${job}#${CHARACTER_PREFIX}#${characterId}`;
  }

  static ExtractCharacterIdFromSk({ sk, job }: { sk: string, job: SupportedJobs }): string {
    return sk.replace(`${JOB_PREFIX}#${job}#${CHARACTER_PREFIX}#`, "");
  }

  static CharacterEntityType() {
    return `${ENTITY_TYPE_PREFIX}#${CHARACTER_PREFIX}`;
  }

  static getKeys({ status, job, characterId }: { status?: SupportedStates, job?: SupportedJobs, characterId?: string }): {
    pk: string | undefined;
    sk: string | undefined;
  } {
    return {
      pk: status ? this.CharacterPk({ status }) : undefined,
      sk: job && characterId ? this.CharacterSk({ job, characterId }) : undefined,
    };
  }

}
