import { Socket } from './Socket';

export interface Config {
  autoReconnect: boolean;
  onClose: (event: Event) => void;
  onError: (err: Event) => void;
  onOpen: (event: Event) => void;
}

export const panda = (path: string, cfg: Config): Socket => {
  return new Socket(path, cfg);
};
