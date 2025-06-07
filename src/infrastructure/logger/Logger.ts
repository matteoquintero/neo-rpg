export class Logger {
  private static log(
    level: "INFO" | "WARN" | "ERROR" | "DEBUG",
    message: string,
    data?: unknown
  ): void {
    const logObject: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (data instanceof Error) {
      logObject.error = {
        message: data.message,
        stack: data.stack?.split("\n").map((line) => line.trim()),
      };
    } else if (data !== undefined) {
      try {
        logObject.data = JSON.parse(JSON.stringify(data));
      } catch {
        logObject.data = { error: "Data not serializable" };
      }
    }

    const formattedLog = JSON.stringify(logObject, null, 2);

    switch (level) {
      case "INFO":
        console.info(formattedLog);
        break;
      case "WARN":
        console.warn(formattedLog);
        break;
      case "ERROR":
        console.error(formattedLog);
        break;
      case "DEBUG":
        if (process.env.DEBUG === "true") {
          console.debug(formattedLog);
        }
        break;
    }
  }

  static info(message: string, data?: unknown): void {
    this.log("INFO", message, data);
  }

  static warn(message: string, data?: unknown): void {
    this.log("WARN", message, data);
  }

  static error(message: string, error?: unknown): void {
    this.log("ERROR", message, error);
  }

  static debug(message: string, data?: unknown): void {
    this.log("DEBUG", message, data);
  }
}
