enum cellContent {
  Empty = "",
  Crosses = "X",
  Noughts = "O",
}

interface cell {
  getValue(): cellContent;
  changeValue(newValue: cellContent): void;
}

function cell(): cell {
  let contents: cellContent = cellContent.Empty;

  function changeValue(newValue: cellContent) {
    contents = newValue;
  }

  function getValue(): cellContent {
    return contents;
  }

  return { getValue, changeValue };
}

type gameBoard = [[cell, cell, cell], [cell, cell, cell], [cell, cell, cell]];

function gameBoard() {
  const board: gameBoard = [
    [cell(), cell(), cell()],
    [cell(), cell(), cell()],
    [cell(), cell(), cell()],
  ];

  function markSquare(
    player: player,
    row: number,
    column: number
  ): string | undefined {
    const targetSquare = board[row][column];

    if (targetSquare.getValue() !== cellContent.Empty) {
      return "This space is already taken";
    }

    targetSquare.changeValue(player.getMark());
  }

  function getBoard() {
    return board;
  }

  function showBoard() {
    console.log(
      board.map((boardRow) => boardRow.map((boardCell) => boardCell.getValue()))
    );
  }

  function isTie(): boolean {
    for (const boardRow of board) {
      for (const boardCell of boardRow) {
        if (boardCell.getValue() === cellContent.Empty) {
          return false;
        }
      }
    }
    return true;
  }

  function hasWon(player: player): boolean {
    // naive implementation for now
    const targetMark = player.getMark();

    // check rows
    if (
      board.some((boardRow) =>
        boardRow.every((cell) => cell.getValue() === targetMark)
      )
    ) {
      return true;
    }

    // check columns
    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
      if (
        board.every(
          (boardRow) => boardRow[columnIndex].getValue() === targetMark
        )
      ) {
        return true;
      }
    }

    // check diagonals
    if (
      (board[0][0].getValue() === targetMark &&
        board[1][1].getValue() === targetMark &&
        board[2][2].getValue() === targetMark) ||
      (board[0][2].getValue() === targetMark &&
        board[1][1].getValue() === targetMark &&
        board[2][0].getValue() === targetMark)
    ) {
      return true;
    }

    return false;
  }

  return { markSquare, getBoard, showBoard, isTie, hasWon };
}

interface player {
  getName(): string;
  getMark(): cellContent.Crosses | cellContent.Noughts;
}

function player(name: string, mark: cellContent.Crosses | cellContent.Noughts) {
  function getName() {
    return name;
  }

  function getMark() {
    return mark;
  }

  return { getName, getMark };
}

interface gameOutcome {
  endMessage(): string;
}

function win(player: player): gameOutcome {
  return {
    endMessage: () => `${player.getName()} wins!`,
  };
}

function tie(): gameOutcome {
  return {
    endMessage: () => "Tie game!",
  };
}

interface ticTacToeController {
  playRound(row: number, column: number): undefined | gameOutcome;
  getActivePlayer(): player;
  getBoard(): gameBoard;
}

function ticTacToeController(
  player1Name: string,
  player2Name: string
): ticTacToeController {
  const game = gameBoard();
  const players = [
    player(player1Name, cellContent.Crosses),
    player(player2Name, cellContent.Noughts),
  ];
  let activePlayerIndex = 0;

  function getActivePlayer() {
    return players[activePlayerIndex];
  }

  function announceRound() {
    const activePlayer = getActivePlayer();
    game.showBoard();
    console.log(
      `${activePlayer.getName()}'s turn (${activePlayer.getMark()})!`
    );
  }

  function playRound(row: number, column: number): undefined | gameOutcome {
    const activePlayer = getActivePlayer();
    const moveResult = game.markSquare(activePlayer, row, column);
    if (typeof moveResult === "string") {
      console.log(moveResult);
      return;
    }

    if (game.hasWon(activePlayer)) {
      console.log(`${activePlayer.getName()} wins!`);
      return win(activePlayer);
    }

    if (game.isTie()) {
      console.log("Tie game!");
      return tie();
    }

    activePlayerIndex = Number(!activePlayerIndex);
    announceRound();
  }

  announceRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: game.getBoard,
  };
}

function aiTicTacToeController(player1Name: string): ticTacToeController {
  const game = gameBoard();
  const realPlayer = player(player1Name, cellContent.Crosses);
  const aiPlayer = player("AI", cellContent.Noughts);

  function getActivePlayer() {
    return realPlayer;
  }

  function playRound(row: number, column: number): undefined | gameOutcome {
    const moveResult = game.markSquare(realPlayer, row, column);
    if (typeof moveResult === "string") {
      console.log(moveResult);
      return;
    }

    if (game.hasWon(realPlayer)) {
      console.log(`${realPlayer.getName()} wins!`);
      return win(realPlayer);
    }

    if (game.isTie()) {
      console.log("Tie game!");
      return tie();
    }

    // AI turn
    const [aiSelectedRow, aiSelectedColumn] = pickBestMove(aiPlayer);
    game.markSquare(aiPlayer, aiSelectedRow, aiSelectedColumn);

    if (game.hasWon(aiPlayer)) {
      console.log(`${aiPlayer.getName()} wins!`);
      return win(aiPlayer);
    }

    if (game.isTie()) {
      console.log("Tie game!");
      return tie();
    }
  }

  function _lt(a: number, b: number) {
    return a < b;
  }

  function _gt(a: number, b: number) {
    return a > b;
  }

  function _switch_player(player: player) {
    return player === aiPlayer ? realPlayer : aiPlayer;
  }

  function minimax(
    board: gameBoard,
    depth: number,
    player: player,
    isMaximizing: boolean
  ): [number, number, number] {
    if (game.hasWon(isMaximizing ? player : _switch_player(player))) {
      return [10 - depth, -1, -1];
    }
    if (game.hasWon(isMaximizing ? _switch_player(player) : player)) {
      return [-10 + depth, -1, -1];
    }
    if (game.isTie()) {
      return [0, -1, -1];
    }

    let value: [number, number, number] = [isMaximizing ? -9999 : 9999, -1, -1];
    const f = isMaximizing ? _gt : _lt;

    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        const boardCell = board[row][column];
        if (boardCell.getValue() !== cellContent.Empty) {
          continue;
        }
        boardCell.changeValue(player.getMark());
        const minimaxValue = minimax(
          board,
          depth + 1,
          _switch_player(player),
          !isMaximizing
        )[0];

        if (f(minimaxValue, value[0])) {
          value = [minimaxValue, row, column];
        }
        boardCell.changeValue(cellContent.Empty);
      }
    }

    return value;
  }

  function pickBestMove(player: player): [number, number] {
    const [bestMoveRow, bestMoveColumn] = minimax(
      game.getBoard(),
      0,
      player,
      true
    ).slice(1);
    return [bestMoveRow, bestMoveColumn];
  }

  return {
    playRound,
    getActivePlayer,
    getBoard: game.getBoard,
  };
}

function PresentationController() {
  const possiblyNullTurnH1 =
    document.querySelector<HTMLHeadingElement>(".turn");
  const possiblyNullBoardDiv = document.querySelector<HTMLDivElement>(".board");

  if (!possiblyNullTurnH1 || !possiblyNullBoardDiv) {
    throw "Either the turn or board element isn't present in the document";
  }

  const turnH1 = possiblyNullTurnH1;
  const boardDiv = possiblyNullBoardDiv;

  let game: ticTacToeController;

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
      game = ticTacToeController(player1Name, player2Name);
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

PresentationController();
