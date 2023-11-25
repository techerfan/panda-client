interface Callbacks {
  [x: string]: {
    callback: (event: Event) => void;
  };
}

export class EventEmitter {
  private static instance: EventEmitter;
  private et: EventTarget;
  private callbacks: Callbacks;

  constructor() {
    this.et = new EventTarget();
    this.callbacks = {};
  }

  static getInstance = (): EventEmitter => {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  };

  dispatchMessage = (channelName: string, message: string): void => {
    EventEmitter.instance.et.dispatchEvent(
      new MessageEvent(channelName, {
        data: message,
      }),
    );
  };

  addListener = (channelName: string, callback: (msg: string) => void) => {
    this.callbacks[channelName] = {
      callback: (event: any) => {
        callback(event.data);
      },
    };
    EventEmitter.instance.et.addEventListener(channelName, this.callbacks[channelName].callback);
  };

  removeListener = (channelName: string) => {
    if (this.callbacks[channelName]) {
      EventEmitter.instance.et.removeEventListener(channelName, this.callbacks[channelName].callback);
      delete this.callbacks[channelName];
    }
  };
}
