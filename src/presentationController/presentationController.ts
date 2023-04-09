import {
  ITicTacToeController,
  twoPlayerTicTacToeController,
  aiTicTacToeController,
} from "./gameController/index.js";

export default function presentationController() {
  const possiblyNullTurnH1 =
    document.querySelector<HTMLHeadingElement>(".turn");
  const possiblyNullBoardDiv = document.querySelector<HTMLDivElement>(".board");

  if (!possiblyNullTurnH1 || !possiblyNullBoardDiv) {
    throw "Either the turn or board element isn't present in the document";
  }

  const turnH1 = possiblyNullTurnH1;
  const boardDiv = possiblyNullBoardDiv;

  let game: ITicTacToeController;

  function renderBoard() {
    const gameBoard = game.getBoard();
    const activePlayer = game.getActivePlayer();

    turnH1.textContent = `${activePlayer.getName()}'s turn`;

    let gridElementIndex = 0;
    for (let i = 0; i < 3; i++, gridElementIndex++) {
      for (let j = 0; j < 3; j++, gridElementIndex++) {
        const boardCell = gameBoard[i][j];
        boardDiv.children[gridElementIndex].textContent = boardCell.getValue();
      }
      gridElementIndex--;
    }
  }

  function clickListener(clickEvent: MouseEvent) {
    console.log(clickEvent);
    const selectedCell = clickEvent.target as HTMLSpanElement;
    if (!selectedCell.classList.contains("board-element")) {
      console.log("not a grid cell, returning");
      return;
    }

    const selectedRow = Number(selectedCell.getAttribute("data-row") as string);
    const selectedColumn = Number(
      selectedCell.getAttribute("data-column") as string
    );

    const possibleGameEnd = game.playRound(selectedRow, selectedColumn);
    renderBoard();

    if (possibleGameEnd) {
      turnH1.textContent = possibleGameEnd.endMessage();

      // clean up click listener to prevent further interaction
      boardDiv.removeEventListener("click", clickListener);
    }
  }

  const playerNameForm = document.querySelector<HTMLFormElement>(".name-form");
  playerNameForm?.addEventListener("submit", (submitEvent) => {
    submitEvent.preventDefault();
    const formData = new FormData(submitEvent.target as HTMLFormElement);

    const player1Name = formData.get("player1-name") as string;
    const player2Name = formData.get("player2-name") as string;

    if (!player2Name) {
      game = aiTicTacToeController(player1Name);
    } else {
      game = twoPlayerTicTacToeController(player1Name, player2Name);
    }

    renderBoard();

    boardDiv.addEventListener("click", clickListener);
  });

  const submitButton = document.querySelector<HTMLButtonElement>(
    "form > button"
  ) as HTMLButtonElement;
  playerNameForm?.addEventListener(
    "submit",
    (submitEvent) => {
      submitEvent.preventDefault();

      submitButton.textContent = "Reset";
    },
    { once: true }
  );
}
