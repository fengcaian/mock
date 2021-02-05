export class Observer {
  constructor(options) {
    this.name = options.name;
    this.eventName = options.eventName;
    this.eventHandler = options.eventHandler;
  }
}