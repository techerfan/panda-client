import { Command } from './Command';
import { SocketReceiver } from './SocketReceiver';

export class UnsubscribeCommand implements Command {
  private receiver: SocketReceiver;
  private channelName: string;

  constructor(receiver: SocketReceiver, channelName: string) {
    this.receiver = receiver;
    this.channelName = channelName;
  }

  execute = (): void => {
    this.receiver.unsubscribe(this.channelName);
  };
}
