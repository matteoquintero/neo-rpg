import { v4 as uuidv4 } from "uuid";
import {
  CreateBattleInput,
  CreateBattleInputExtended,
  GetBattleInput,
  GetBattleOutput,
} from "../dto/BattleDto";

import { BattleDomainService } from "../../domain/logic/BattleDomainService";
import { BattleRepository } from "../../infrastructure/repositories/BattleRepository";
import { DatabaseHandler } from "../../shared/utilities/DatabaseHandler";
import { ErrorHandler } from "../../shared/utilities/ErrorHandler";
import { EnsureCharacterService } from "../../domain/services/EnsureCharacterService";
import { SupportedStates } from "../../shared/enums/Domains";
import { BattleRoundService } from "../../domain/services/BattleRoundService";
import { KillCharacterService } from "../../domain/services/KillCharacterService";

export class BattleUseCase {
  constructor(
    private readonly domainService: BattleDomainService,
    private readonly repository: BattleRepository,
    private readonly ensureCharacterService: EnsureCharacterService,
    private readonly killCharacterService: KillCharacterService,
    private readonly battleRoundService: BattleRoundService
  ) { }

  async createBattle(
    input: CreateBattleInput
  ): Promise<GetBattleOutput> {
    const { characterXId, characterYId, characterXJob, characterYJob } = input;
    const characterX = await this.ensureCharacterService.ensureExists({
      status: SupportedStates.ALIVE,
      characterId: characterXId,
      job: characterXJob
    });

    const characterY = await this.ensureCharacterService.ensureExists({
      status: SupportedStates.ALIVE,
      characterId: characterYId,
      job: characterYJob
    });

    const BattleId = uuidv4();
    const battleResult = this.battleRoundService.generateBattleRounds(characterX, characterY);

    if (battleResult.loser) {
      await this.killCharacterService.execute(battleResult.loser);
    }

    const createInputExtended: CreateBattleInputExtended = {
      characterX,
      characterY,
      rounds: battleResult.rounds,
      winner: battleResult.winner,
      loser: battleResult.loser
    };

    const BattleModel = this.domainService.buildCreateModel({
      ...createInputExtended,
      BattleId
    });

    await DatabaseHandler.execute(
      () => this.repository.saveBattle({
        Battle: BattleModel
      }),
      `Battle ${BattleId} created successfully.`,
      `Error creating battle ${BattleId}.`
    );

    return this.domainService.toOutput(BattleModel);
  }

  async getBattle(
    input: GetBattleInput
  ): Promise<GetBattleOutput> {
    const { pk, sk } = this.domainService.getKeys({
      battleId: input.battleId,
      characterXId: input.characterXId,
      characterYId: input.characterYId,
      characterXJob: input.characterXJob,
      characterYJob: input.characterYJob
    });

    if (!pk || !sk) {
      throw new ErrorHandler("Invalid battleId, characterXId or characterYId", 400);
    }

    const models = await DatabaseHandler.execute(
      () =>
        this.repository.getBattleByKeys({
          pk,
          sk
        }),
      `Battle retrieved for battleId ${input.battleId}.`,
      `Error retrieving battle for battleId ${input.battleId}.`
    );

    return this.domainService.toOutput(models!);
  }

  async getBattles(): Promise<GetBattleOutput[]> {
    const entityType = this.domainService.getEntityType();
    const models = await DatabaseHandler.execute(
      () =>
        this.repository.getBattlesByEntityType({
          entityType
        }),
      `Battles retrieved for entity type ${entityType}.`,
      `Error retrieving characters for entity type ${entityType}.`
    );
    return this.domainService.toOutputArray(models);
  }


}
