export enum LogType {
  Info,
  Error,
  Warning,
  Notice,
  Debug,
}

interface Config {
  header: string;
  hasDate: boolean;
  hasTime: boolean;
  enabled: boolean;
}

const initialConfig: Config = {
  header: 'Panda',
  hasDate: true,
  hasTime: true,
  enabled: true,
}

export class Logger {
  private static instance: Logger;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(initialConfig);
    }
    return Logger.instance;
  }

  setHeader = (header: string) => {
    Logger.instance.config.header = header;
  }

  setHasDate = (hasDate: boolean) => {
    Logger.instance.config.hasDate = hasDate;
  }

  setHasTime = (hasTime: boolean) => {
    Logger.instance.config.hasTime = hasTime;
  }

  setEnabled = (enabled: boolean) => {
    Logger.instance.config.enabled = enabled;
  }

  private makeDate = (date: Date): string => {
    let log: string = `${date.getFullYear}-${date.getMonth}-${date.getDate}`;

    if (!Logger.instance.config.hasTime) {
      log += ': ';
    } else {
      log += ': ';
    }
    return log;
  }

  private makeTime = (date: Date): string => {

    let hours = date.getHours().toString();
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    let minutes = date.getMinutes().toString();
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    let seconds = date.getSeconds().toString();
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }
    return `${hours}:${minutes}:${seconds}: `;
  }

  private makeHeader = (section: string): string => {
    return `[${Logger.instance.config.header}:${section}] `
  }

  log = (lType: LogType, section: string,message: string) => {
    if (!Logger.instance.config.enabled) {
      return
    }
    
    const date = new Date();
    let log: string = '';
    
    if (Logger.instance.config.hasDate) {
      log = this.makeDate(date);
    }

    if (Logger.instance.config.hasTime) {
      log += this.makeTime(date);
    }

    log += this.makeHeader(section) + message;

    switch (lType) {
      case LogType.Debug:
      case LogType.Warning:
        console.warn(log);
      case LogType.Error:
        console.error(log);
      default:
        console.log(log);
    }
  }
}
