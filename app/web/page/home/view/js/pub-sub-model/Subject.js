export class Subject {
  constructor() {
    this.observerList = [];
  }
  register(observer) {
    const { name, eventName, eventHandler } = observer;
    let ob = this.observerList.find(item => item.name === name);
    if (ob) {
      ob.events[eventName] = eventHandler;
    } else {
      ob = {
        events: {}
      };
      ob.events[eventName] = eventHandler;
      this.observerList.push(ob);
    }
  }
  notify(eventName) {
    this.observerList.forEach((ob) => {
      const handler = ob.events[eventName];
      handler && handler.call(this);
    });
  }
}