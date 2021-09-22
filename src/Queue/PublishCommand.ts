import { Command } from './Command';
import { SocketReceiver } from './SocketReceiver';

export class PublishCommand implements Command {
  private receiver: SocketReceiver;
  private channel: string;
  private message: string;

  constructor(receiver: SocketReceiver, channel: string, message: string) {
    this.receiver = receiver;
    this.channel = channel;
    this.message = message;
  }

  execute = (): void => {
    this.receiver.publishMessage(this.channel, this.message);
  };
}
