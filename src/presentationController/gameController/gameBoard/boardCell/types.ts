export enum cellContent {
  Empty = "",
  Crosses = "X",
  Noughts = "O",
}

export interface ICell {
  getValue(): cellContent;
  changeValue(newValue: cellContent): void;
}
