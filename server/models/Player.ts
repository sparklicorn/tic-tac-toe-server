import Game from './game/Game.js';
import GameInterface from './game/GameInterface.js';

/**
 * A very basic abstraction of a player for a type of game <T>.
 */
class Player<T extends GameInterface> {
  public static MIN_NAME_LENGTH = 4;
  public static MAX_NAME_LENGTH = 32;

  private _id: string;
  private _name: string;
  private _game: Game<T>;
  private _timeCreated: number;

  constructor(id: string) {
    this._id = id;
    this._timeCreated = Date.now();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get timeCreated() {
    return this._timeCreated;
  }

  set name(newName: string) {
    newName = newName.replace(/[^a-zA-Z0-9]/, '');

    if (newName.length < Player.MIN_NAME_LENGTH || newName.length > Player.MAX_NAME_LENGTH) {
      return;
    }

    this._name = newName;
  }

  set game(newGame: Game<T>) {
    this._game = newGame;
  }

  get game() {
    return this._game;
  }
}

export default Player;
