import { Socket } from "./Socket";

export const panda = (path: string): Promise<Socket> => {
  const ws = new WebSocket(path);
  const socket = new Socket(ws);

  return new Promise((resolve, reject) => {
    ws.onopen = (event) => {
      resolve(socket);
    };

    ws.onerror = (event) => {
      reject(new Error('WebSocket could not connect. Please check your configuration.'));
    };
  });
}
