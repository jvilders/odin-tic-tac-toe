import { ICell, cellContent } from "./boardCell/index.js";

type IGameBoard = [
  [ICell, ICell, ICell],
  [ICell, ICell, ICell],
  [ICell, ICell, ICell]
];

interface IPlayer {
  getName(): string;
  getMark(): cellContent.Crosses | cellContent.Noughts;
}

export { IGameBoard, IPlayer };
