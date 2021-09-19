import { Socket } from './Socket';

export interface Config {
  autoReconnect?: boolean;
  onClose?: (event: Event) => void;
  onError?: (err: Event) => void;
  onOpen?: (event: Event) => void;
}

export const panda = (path: string, cfg?: Config): Socket => {
  if (cfg) {
    return new Socket(path, cfg);
  } else {
    return new Socket(path, {});
  }
};
