import Event from "../../server/models/events/Event.js";
import EventBus from "../../server/models/events/EventBus.js";
import GameInterface from "../../server/models/game/GameInterface.js";

/**
 * Encapsulates a game of Tic-Tac-Toe.
 * I was really high went I wrote this.
 */
class TicTacToe implements GameInterface {
  private winner: number;
  private turn: number;
  private board: number[];
  private eventBus: EventBus;

  private static validateCoords(row: number, col: number) {
    // return (row >= 0 && row < 3 && col >= 0 && col < 3);

    const msg = (type: string) => `row (${type}) is out of range [0,2]`;
    if (row < 0 || row > 2) {//} col < 0 && col > 2) {
      throw Error(msg('row'));
    }

    if (col < 0 || col > 2) {
      throw Error(msg('col'));
    }
  }

  private static indexOf(row: number, col: number) {
    return row * 3 + col;
  }

  constructor() {
    this.eventBus = new EventBus();
    this.reset();

    this.registerEvent(
      'TAKE_TURN',
      (event: Event) => {
        console.log(`TicTacToe EVENT ${event.name}...`);

        try {
          if (!this.takeTurn(event.data.row, event.data.col)) {
            // TODO send to player
          }
        } catch (error) {
          console.log(`TicTacToe ERROR: ${error.message}`);
          // TODO send to player
        }
      }
    );
  }

  registerEvent(eventName: string, callback: (event: Event) => void) {
    this.eventBus.registerEvent(eventName, callback);
  }

  throwEvent(event: Event): void {
    this.eventBus.throwEvent(event);
  }

  getWinner() {
    return this.winner;
  }

  reset() {
    this.winner = -1;
    this.turn = 0;
    this.board = new Array(9).fill(0);
  }

  isEmpty(row: number, col: number) {
    TicTacToe.validateCoords(row, col);

    return this.board[TicTacToe.indexOf(row, col)] === 0;
  }

  switchTurn() {
    this.turn = (this.turn + 1) % 2;
  }

  isGameOver() {
    return this.winner >= 0;
  }

  rowSum(row: number) {
    return this.board.reduce(
      (previousVal, currentVal, index) => (
        previousVal + (
          (Math.floor(index / 3) === row) ? currentVal : 0
        )
      )
      // {
      //   if (Math.floor(index / 3) === row) {
      //     return whatever;
      //   }
      // }
      ,
      0
    );
  }

  colSum(col: number) {
    return this.board.reduce(
      (previousVal, currentValu, index) => (
        previousVal + (
          (index % 3 === col) ? currentValu : 0
        )
      )
    )
  }

  diagonalSums() {
    return [
      this.board[0] + this.board[4] + this.board[8],
      this.board[2] + this.board[4] + this.board[6]
    ];
  }

  /**
   * Attempts to take a given cell on the board.
   * The cell will either have 'x' or 'o' depending on who's turn it is.
   *
   * @param row
   * @param col
   * @returns True if a turn was successfully taken; otherwise false if the given
   * cell is not empty or if the game is already over.
   * @throws If row or column is out of bounds.
   */
  takeTurn(row: number, col: number) {
    TicTacToe.validateCoords(row, col);

    if (!this.isEmpty(row, col) || this.isGameOver()) {
      return false;
    }

    const index = TicTacToe.indexOf(row, col);
    this.board[index] = this.turn + 1;
    this.switchTurn();

    [
      this.rowSum(row),
      this.colSum(col),
      ...this.diagonalSums()
    ].forEach((sum) => {
      if (sum === 3) {
        this.winner = 1;
        return;
      } else if (sum === 6) {
        this.winner = 2;
        return;
      }
    });

    return true;
  }

  print() {
    const char = (index) => {
      if (this.board[index] === 1) {
        return 'x';
      } else if (this.board[index] === 2) {
        return 'o';
      }

      return ' ';
    }

    for (let r = 0; r < 3; r++) {
      console.log(`${char(r * 3 + 0)}|${char(r * 3 + 0)}|${char(r * 3 + 0)}`);
      if (r < 2) {
        console.log(`-+-+-`);
      }
    }
  }
}

export default TicTacToe;
