import { SupportedJobs, SupportedStates } from "../enums/Domains";

export type CharacterModelType = {
  characterId: string;
  name: string;
  status: SupportedStates;
  job: SupportedJobs;
  lifePoints: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  attackModifier: number;
  speedModifier: number;
};
