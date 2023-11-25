import { Command } from './Command';
import { SocketReceiver } from './SocketReceiver';

export class SubscribeCommand implements Command {
  private receiver: SocketReceiver;
  private channelName: string;
  private callback: (msg: string) => void;

  constructor(receiver: SocketReceiver, channelName: string, callback: (msg: string) => void) {
    this.receiver = receiver;
    this.channelName = channelName;
    this.callback = callback;
  }

  execute = (): void => {
    this.receiver.subscribe(this.channelName, this.callback);
  };
}
