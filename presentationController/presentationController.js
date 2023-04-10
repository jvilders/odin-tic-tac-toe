import { twoPlayerTicTacToeController, aiTicTacToeController, } from "./gameController/index.js";
export default function presentationController() {
    const possiblyNullTurnH1 = document.querySelector(".turn");
    const possiblyNullBoardDiv = document.querySelector(".board");
    if (!possiblyNullTurnH1 || !possiblyNullBoardDiv) {
        throw "Either the turn or board element isn't present in the document";
    }
    const turnH1 = possiblyNullTurnH1;
    const boardDiv = possiblyNullBoardDiv;
    let game;
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
    function clickListener(clickEvent) {
        console.log(clickEvent);
        const selectedCell = clickEvent.target;
        if (!selectedCell.classList.contains("board-element")) {
            console.log("not a grid cell, returning");
            return;
        }
        const selectedRow = Number(selectedCell.getAttribute("data-row"));
        const selectedColumn = Number(selectedCell.getAttribute("data-column"));
        const possibleGameEnd = game.playRound(selectedRow, selectedColumn);
        renderBoard();
        if (possibleGameEnd) {
            turnH1.textContent = possibleGameEnd.endMessage();
            // clean up click listener to prevent further interaction
            boardDiv.removeEventListener("click", clickListener);
        }
    }
    const playerNameForm = document.querySelector(".name-form");
    playerNameForm === null || playerNameForm === void 0 ? void 0 : playerNameForm.addEventListener("submit", (submitEvent) => {
        submitEvent.preventDefault();
        const formData = new FormData(submitEvent.target);
        const player1Name = formData.get("player1-name");
        const player2Name = formData.get("player2-name");
        if (!player2Name) {
            game = aiTicTacToeController(player1Name);
        }
        else {
            game = twoPlayerTicTacToeController(player1Name, player2Name);
        }
        renderBoard();
        boardDiv.addEventListener("click", clickListener);
    });
    const submitButton = document.querySelector("form > button");
    playerNameForm === null || playerNameForm === void 0 ? void 0 : playerNameForm.addEventListener("submit", (submitEvent) => {
        submitEvent.preventDefault();
        submitButton.textContent = "Reset";
    }, { once: true });
}
//# sourceMappingURL=presentationController.js.map