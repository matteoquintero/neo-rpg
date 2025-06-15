;
import { Logger } from "../../infrastructure/logger/Logger";
import { CHARACTER_PREFIX, ENTITY_TYPE_PREFIX, JOB_PREFIX, NAME_PREFIX, STATE_PREFIX } from "../../shared/constants/Identifiers";
import { SupportedJobs, SupportedStates } from "../../shared/enums/Domains";
import { CharacterModelType } from "../../shared/types/CharacterModelType";
import { BaseModel } from "./BaseModel";

export class CharacterModel extends BaseModel {
  name: string;
  status: SupportedStates;
  job: SupportedJobs;
  lifePoints: number;
  currentLifePoints: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  attackModifier: number;
  speedModifier: number;

  constructor({ characterId, status, name, job, lifePoints, strength, dexterity, intelligence, attackModifier, speedModifier }: CharacterModelType) {
    super({
      pk: CharacterModel.CharacterPk({ job }),
      sk: CharacterModel.CharacterSk({ status, characterId }),
      entityType: CharacterModel.CharacterEntityType(),
    });
    this.name = name;
    this.status = status;
    this.job = job;
    this.lifePoints = lifePoints;
    this.currentLifePoints = lifePoints;
    this.strength = strength;
    this.dexterity = dexterity;
    this.intelligence = intelligence;
    this.attackModifier = attackModifier;
    this.speedModifier = speedModifier;
  }

  static CharacterPk({ job }: { job: SupportedJobs }): string {
    return `${JOB_PREFIX}#${job}`;
  }

  static CharacterSk({ status, characterId }: { status: SupportedStates, characterId: string }): string {
    return `${STATE_PREFIX}#${status}#${CHARACTER_PREFIX}#${characterId}`;
  }

  static ExtractCharacterIdFromSk({ sk, status }: { sk: string, status: SupportedStates }): string {
    Logger.info(`Extracting character id from sk: ${sk} and status: ${status}`);
    return sk.replace(`${STATE_PREFIX}#${status}#${CHARACTER_PREFIX}#`, "");
  }

  static CharacterEntityType() {
    return `${ENTITY_TYPE_PREFIX}#${CHARACTER_PREFIX}`;
  }

  static getKeys({ status, job, characterId }: { status?: SupportedStates, job?: SupportedJobs, characterId?: string }): {
    pk: string | undefined;
    sk: string | undefined;
  } {
    return {
      pk: job ? this.CharacterPk({ job }) : undefined,
      sk: status && characterId ? this.CharacterSk({ status, characterId }) : undefined,
    };
  }

}
