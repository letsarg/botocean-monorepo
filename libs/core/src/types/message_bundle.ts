export class MessageBundleMessage<T> {
  src: string;
  dst: string;
  msg: T;
}

export abstract class SendableBundle {
  abstract send(): Promise<void>;
}

export abstract class ReceivableBundle {
  abstract receive(): Promise<void>;
}
