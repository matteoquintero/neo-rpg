import { CharacterModel } from "../../domain/models/CharacterModel";
import { SupportedJobs, SupportedStates } from "../../shared/enums/Domains";

export interface CreateCharacterInput {
  name: string;
  status: SupportedStates;
  job: SupportedJobs;
  lifePoints: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  attackModifier: number;
  speedModifier: number;
}

export interface UpdateCharacterInput {
  status: SupportedStates;
  job: SupportedJobs;
  characterId: string;
  updates: Partial<CharacterModel>;
}

export interface GetCharacterInput {
  status: SupportedStates;
  job: SupportedJobs;
  characterId: string;
  limit?: number;
  descending?: boolean;
}

export interface GetCharacterOutput {
  status: SupportedStates;
  job: SupportedJobs;
  characterId: string;
  name: string;
  lifePoints: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  attackModifier: number;
  speedModifier: number;
  entityType: string;
  createdAt: string;
  updatedAt: string;
}
