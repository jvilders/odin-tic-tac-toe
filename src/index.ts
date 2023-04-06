enum cellContent {
  Empty = "",
  Crosses = "X",
  Noughts = "O",
}

interface cell {
  getValue(): cellContent;
  changeValue(newValue: cellContent.Crosses | cellContent.Noughts): void;
}

function cell(): cell {
  let contents: cellContent = cellContent.Empty;

  function changeValue(newValue: cellContent.Crosses | cellContent.Noughts) {
    contents = newValue;
  }

  function getValue(): cellContent {
    return contents;
  }

  return { getValue, changeValue };
}

function gameBoard() {
  const board: cell[][] = [
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

  return { markSquare, getBoard, showBoard, hasWon };
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

interface ticTacToeController {
  playRound(row: number, column: number): player | undefined;
  getActivePlayer(): player;
  getBoard(): cell[][];
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

  function playRound(row: number, column: number) {
    const activePlayer = getActivePlayer();
    const moveResult = game.markSquare(activePlayer, row, column);
    if (typeof moveResult === "string") {
      console.log(moveResult);
      return;
    }

    if (game.hasWon(activePlayer)) {
      console.log(`${activePlayer.getName()} wins!`);
      return activePlayer;
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

  const playerNameForm = document.querySelector<HTMLFormElement>(".name-form");
  playerNameForm?.addEventListener("submit", (submitEvent) => {
    submitEvent.preventDefault();
    const formData = new FormData(submitEvent.target as HTMLFormElement);

    const player1Name = formData.get("player1-name") as string;
    const player2Name = formData.get("player2-name") as string;

    game = ticTacToeController(player1Name, player2Name);
    renderBoard();

    boardDiv.addEventListener("click", (clickEvent) => {
      console.log(clickEvent);
      const selectedCell = clickEvent.target as HTMLSpanElement;
      if (!selectedCell.classList.contains("board-element")) {
        console.log("not a grid cell, returning");
        return;
      }

      const selectedRow = Number(
        selectedCell.getAttribute("data-row") as string
      );
      const selectedColumn = Number(
        selectedCell.getAttribute("data-column") as string
      );

      game.playRound(selectedRow, selectedColumn);
      renderBoard();
    });
  });
}

PresentationController();
