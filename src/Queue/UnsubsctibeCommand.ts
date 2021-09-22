import { Command } from './Command';
import { SocketReceiver } from './SocketReceiver';

export class UnsubscribeCommand implements Command {
  private receiver: SocketReceiver;
  private channelName: string;
  private callback: () => void;

  constructor(receiver: SocketReceiver, channelName: string, callback: () => void) {
    this.receiver = receiver;
    this.channelName = channelName;
    this.callback = callback;
  }

  execute = (): void => {
    this.receiver.unsubscribe(this.channelName, this.callback);
  };
}

