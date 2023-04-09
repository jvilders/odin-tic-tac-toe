import { cellContent } from "./boardCell/index.js";
import { IPlayer } from "./types.js";

export default function makePlayer(
  name: string,
  mark: cellContent.Crosses | cellContent.Noughts
): IPlayer {
  function getName() {
    return name;
  }

  function getMark() {
    return mark;
  }

  return { getName, getMark };
}
