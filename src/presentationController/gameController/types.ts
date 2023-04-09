import { IGameBoard, IPlayer } from "./gameBoard/index.js";

interface IGameOutcome {
  endMessage(): string;
}

interface ITicTacToeController {
  playRound(row: number, column: number): undefined | IGameOutcome;
  getActivePlayer(): IPlayer;
  getBoard(): IGameBoard;
}

export { IGameOutcome, ITicTacToeController };
