import { CharacterUseCase } from "../../application/cases/CharacterUseCase";
import { UpdateCharacterInput } from "../../application/dto/CharacterDto";
import { GetCharacterOutput } from "../../application/dto/CharacterDto";
import { SupportedStates } from "../../shared/enums/Domains";
import { CharacterModel } from "../models/CharacterModel";

export class KillCharacterService {
  constructor(
    private readonly characterUseCase: CharacterUseCase
  ) { }

  async execute(character: GetCharacterOutput): Promise<void> {
    const updateInput: UpdateCharacterInput = {
      characterId: character.characterId,
      job: character.job,
      status: SupportedStates.ALIVE,
      updates: {
        sk: CharacterModel.CharacterSk({ status: SupportedStates.DEAD, characterId: character.characterId }),
        status: SupportedStates.DEAD,
        currentLifePoints: 0
      }
    };

    await this.characterUseCase.updateCharacter(updateInput);
  }
}
