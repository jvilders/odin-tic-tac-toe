import { makeGameBoard, makePlayer, cellContent } from "./gameBoard/index.js";
import { win, tie } from "./gameOutcome.js";
export default function twoPlayerTicTacToeController(player1Name, player2Name) {
    const game = makeGameBoard();
    const players = [
        makePlayer(player1Name, cellContent.Crosses),
        makePlayer(player2Name, cellContent.Noughts),
    ];
    let activePlayerIndex = 0;
    function getActivePlayer() {
        return players[activePlayerIndex];
    }
    function announceRound() {
        const activePlayer = getActivePlayer();
        game.showBoard();
        console.log(`${activePlayer.getName()}'s turn (${activePlayer.getMark()})!`);
    }
    function playRound(row, column) {
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
//# sourceMappingURL=twoPlayerController.js.map