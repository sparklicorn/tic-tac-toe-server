import Event from "../events/Event.js";
import GameInterface from "./GameInterface.js";
import Player from "../Player.js";

/**
 * A very basic abstraction of a game with two players.
 */
class Game<T extends GameInterface> {
  private _id: string;
  private _players: Player<T>[];
  private _game: T;

  private _timeCreated: number;
  private _timeStarted: number;

  constructor(id: string, game: T) {
    this._timeCreated = Date.now();
    this._game = game;
    this._players = [];
    this._id = id;
  }

  get players() {
    return this._players;
  }

  get game() {
    return this._game;
  }

  get id() {
    return this._id;
  }

  /**
   * Attempts to the given player to the game.
   * If the player is successfully added. The game will be started and the start time logged.
   * A two-way association will be created between this game and the given player.
   * Does nothing if there are already two players.
   *
   * @returns {boolean} True if the player was successfully added to the game; otherwise false
   * (i.e. the game already has two players).
   */
  addPlayer(newPlayer: Player<T>) {
    if (this._players.length < 2) {
      this._players.push(newPlayer);
      newPlayer.game = this;

      if (this._players.length == 2) {
        this._timeStarted = Date.now();
      }

      return true;
    }

    return false;
  }

  get timeCreated() {
    return this._timeCreated;
  }

  get timeStarted() {
    return this._timeStarted;
  }

  // Event handling passed onto _game

  registerEvent(eventName: string, callback: (event: Event) => void) {
    this._game.registerEvent(eventName, callback);
  }

  throwEvent(event: Event) {
    this._game.throwEvent(event);
  }
}

export default Game;
