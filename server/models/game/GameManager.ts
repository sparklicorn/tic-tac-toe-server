import crypto from 'crypto';

import TicTacToe from '../../../shared/models/TicTacToe.js';
import Event from '../events/Event.js';
import EventData from '../events/EventData.js';
import Game from './Game.js';
import GameInterface from './GameInterface.js';
import Player from '../Player.js';

/**
 * Manages instances of tictactoe games
 */
class GameManager {
  /**
   * Maximum number of games that can be active at one time.
   */
  private static readonly MAX_NUM_GAMES = 32;
  private static instance: GameManager;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new GameManager();
    }

    return this.instance;
  }

  /**
   * Collection of game instances, mapped by id for convenient lookup.
   */
  private gamesById: Map<string, Game<GameInterface>>;

  /**
   * Collection of players.
   */
  private playersById: Map<string, Player<GameInterface>>;

  private constructor() {
    this.gamesById = new Map<string, Game<GameInterface>>();
    this.playersById = new Map<string, Player<GameInterface>>();
  }

  private static randomId() {
    return  crypto.randomBytes(20).toString('hex');
  }

  private generateGameId() {
    let id;
    while (this.gamesById.has(id = GameManager.randomId()));

    return id;
  }

  private generatePlayerId() {
    let id;
    while (this.playersById.has(id = GameManager.randomId()));

    return id;
  }

  /**
   * Attempts to create a new game instance.
   *
   * @returns {Game | null} Newly created game instance, or null if the game instance
   * could not be created because the maximum number of active games has been reached.
   */
  createGame() {
    if (this.numGames >= GameManager.MAX_NUM_GAMES) {
      return null;
    }

    const game = new Game<GameInterface>(this.generateGameId(), new TicTacToe());
    this.gamesById.set(game.id, game);
    // this.addPlayerToGame(game);

    return game;
  }

  get numGames() {
    return this.gamesById.size;
  }

  findGame(gameId: string) {
    return this.gamesById.get(gameId);
  }

  /**
   * Determines whether a game instance with the specified id exists.
   *
   * @param gameId
   * @returns {boolean} True if a game instance with the specified id exists; otherwise false.
   */
  doesGameExist(gameId: string) {
    return !!(this.findGame(gameId));
  }

  /**
   * Attempts to add a new player to the game with the given id.
   *
   * @param gameId Id of the game instance
   * @returns {Player | null} The new player only if successfully added to the game; otherwise null.
   */
  addPlayerToGameById(gameId: string) {
    return this.addPlayerToGame(this.gamesById.get(gameId));
  }

  /**
   * Attempts to add a new player to the given game.
   *
   * @param game Game instance
   * @returns {Player | null} The new player only if successfully added to the game; otherwise null.
   */
  addPlayerToGame(game: Game<GameInterface>) {
    const newPlayer = new Player<GameInterface>(this.generatePlayerId());

    if (game && game.addPlayer(newPlayer)) {
      this.playersById.set(newPlayer.id, newPlayer);

      return newPlayer;
    }

    return null;
  }

  /**
   * Attempts to retrieve a Player by their id.
   *
   * @param id Player id
   * @returns {Player | undefined}
   */
  getPlayer(id: string) {
    return this.playersById.get(id);
  }

  /**
   *
   * @param eventData The event data from the api response.
   */
  throwEvent(eventData: EventData) {
    const game = this.gamesById.get(eventData.gameId);

    if (!game) {
      throw Error(`No such game exists.`)
    }

    const event = new Event(eventData.name, eventData.data);

    game.throwEvent(event);
  }

  /**
   *
   * @param gameId
   * @param eventName
   * @param callback
   */
  registerEvent(
    gameId: string,
    eventName: string,
    callback: (event: Event) => void
  ) {
    const game = this.gamesById.get(gameId);

    if (!game) {
      throw Error(`No such game exists.`)
    }

    game.registerEvent(eventName, callback);
  }
}

export default GameManager.getInstance();
