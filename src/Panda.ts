import { Socket } from "./Socket";

export const panda = (path: string): Socket => {
  const ws = new WebSocket(path);
  const socket = new Socket(ws);
  return socket;
}
