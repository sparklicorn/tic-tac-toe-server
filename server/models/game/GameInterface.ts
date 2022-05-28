import Event from "../events/Event.js";

interface GameInterface {
  isGameOver(): boolean;
  getWinner(): any;

  // TODO registerEvent should return some id (string)
  registerEvent(eventName: string, callback: (event: Event) => void): void;
  // TODO unregisterEvent(listenerId from registration)
  throwEvent(event: Event): void;
}

export default GameInterface;
