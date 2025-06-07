import { Logger } from "../../infrastructure/logger/Logger";
import { ErrorHandler } from "./ErrorHandler";

export class DatabaseHandler {
  static async execute<T>(
    operation: () => Promise<T>,
    successMsg: string,
    errorMsg: string
  ): Promise<T> {
    try {
      const result = await operation();
      Logger.info(successMsg);
      return result;
    } catch (error) {
      Logger.error(`errorMsg`, error);
      throw new ErrorHandler(errorMsg, 500);
    }
  }
}
