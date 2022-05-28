import Event from "./Event.js";

/**
 * An EventBus catalogs event listeners (also called handlers) by event name.
 * When an Event is 'thrown' via `throwEvent(event)`, all listeners associated
 * with it will be called.
 */
class EventBus {
  private readonly listeners: Map<string, ((e: Event) => void)[]>;

  registerEvent(eventName: string, listener: (e: Event) => void) {
    let listeners = this.listeners.get(eventName);
    if(!listeners) {
      listeners = [];
      this.listeners.set(eventName, listeners);
    }

    listeners.push(listener);
  }

  throwEvent(event: Event) {
    const listeners = this.listeners.get(event.name);
    listeners.forEach((listener) => {
      // Using a copy of the event ensures that, in the case that a listener somehow
      // modifies the event data, all other listeners will get a chance to respond
      // to the original data.
      listener(event.copy());
    });
  }
}

export default EventBus;
