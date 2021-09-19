import { Socket } from './Socket';

interface Config {
  autoReconnect: boolean;
  onClose: (event: Event) => void;
  onError: (err: Event) => void;
  onOpen: (event: Event) => void;
}

let socket: Socket

export const panda = (path: string, cfg: Config): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    connect(path, cfg, resolve, reject);
  });
};

const connect = (
    path: string, 
    conifg: Config,
    resolve: (value: Socket | PromiseLike<Socket>) => void, 
    reject: (reason?: any) => void
  ) => {

  const ws = new WebSocket(path);
  socket = new Socket(ws);

  ws.onopen = (event) => {
    if (conifg.onOpen) {
      conifg.onOpen(event);
    }
    resolve(socket);
  };

  ws.onerror = (event) => {
    if (conifg.onError) {
      conifg.onError(event);
    }
    reject(new Error('WebSocket could not connect. Please check your configuration.'));
  };

  ws.onclose = (event: Event) => {
    socket.unsubscribeAll();
    if (conifg.autoReconnect) {
      setTimeout(() => {
        connect(path, conifg, resolve, reject);
      }, 1000);
    }
    if (conifg.onClose) {
      conifg.onClose(event);
    }
  };
};
