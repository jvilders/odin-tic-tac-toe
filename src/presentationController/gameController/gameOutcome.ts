import { IPlayer } from "./gameBoard/index.js";
import { IGameOutcome } from "./types.js";

function win(player: IPlayer): IGameOutcome {
  return {
    endMessage: () => `${player.getName()} wins!`,
  };
}

function tie(): IGameOutcome {
  return {
    endMessage: () => "Tie game!",
  };
}

export { win, tie };
