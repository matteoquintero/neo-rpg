import { GetCharacterOutput } from "../../application/dto/CharacterDto";
import { BATTLE_PREFIX, CHARACTER_PREFIX, ENTITY_TYPE_PREFIX, JOB_PREFIX } from "../../shared/constants/Identifiers";
import { SupportedJobs } from "../../shared/enums/Domains";
import { BattleModelType, BattleRound } from "../../shared/types/BattleModelType";
import { BaseModel } from "./BaseModel";

export class BattleModel extends BaseModel {
  rounds: BattleRound[];
  characterX: GetCharacterOutput;
  characterY: GetCharacterOutput;
  winner: GetCharacterOutput | null;
  loser: GetCharacterOutput | null;
  constructor({ battleId, characterX, characterY, rounds, winner, loser }: BattleModelType) {
    super({
      pk: BattleModel.BattlePk(
        {
          characterXId: characterX.characterId,
          characterYId: characterY.characterId,
          characterXJob: characterX.job,
          characterYJob: characterY.job
        }
      ),
      sk: BattleModel.BattleSk({ battleId }),
      entityType: BattleModel.BattleEntityType(),
    });
    this.rounds = rounds;
    this.characterX = characterX;
    this.characterY = characterY;
    this.winner = winner;
    this.loser = loser;
  }

  static BattlePk({ characterXId, characterYId, characterXJob, characterYJob }: { characterXId: string, characterYId: string, characterXJob: SupportedJobs, characterYJob: SupportedJobs }) {
    return `${CHARACTER_PREFIX}#${characterXId}#${JOB_PREFIX}${characterXJob}#${CHARACTER_PREFIX}#${characterYId}#${JOB_PREFIX}${characterYJob}`;
  }

  static BattleSk({ battleId }: { battleId: string }) {
    return `${BATTLE_PREFIX}#${battleId}`;
  }

  static BattleEntityType() {
    return `${ENTITY_TYPE_PREFIX}#${BATTLE_PREFIX}`;
  }

  static getKeys({ battleId, characterXId, characterYId, characterXJob, characterYJob }: { battleId: string, characterXId: string, characterYId: string, characterXJob: SupportedJobs, characterYJob: SupportedJobs }): { pk: string | undefined; sk: string | undefined } {
    return {
      pk: BattleModel.BattlePk({ characterXId: characterXId, characterYId: characterYId, characterXJob: characterXJob, characterYJob: characterYJob }),
      sk: BattleModel.BattleSk({ battleId }),
    };
  }

  static ExtractBattleIdFromSk({ sk }: { sk: string }): string {
    return sk.replace(`${BATTLE_PREFIX}#`, "");
  }
}
