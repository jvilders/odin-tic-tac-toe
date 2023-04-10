import { makeGameBoard, makePlayer, cellContent, } from "./gameBoard/index.js";
import { win, tie } from "./gameOutcome.js";
export default function aiTicTacToeController(player1Name) {
    const game = makeGameBoard();
    const realPlayer = makePlayer(player1Name, cellContent.Crosses);
    const aiPlayer = makePlayer("AI", cellContent.Noughts);
    function getActivePlayer() {
        return realPlayer;
    }
    function playRound(row, column) {
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
    function _lt(a, b) {
        return a < b;
    }
    function _gt(a, b) {
        return a > b;
    }
    function _switch_player(player) {
        return player === aiPlayer ? realPlayer : aiPlayer;
    }
    function minimax(board, depth, player, isMaximizing) {
        if (game.hasWon(isMaximizing ? player : _switch_player(player))) {
            return [10 - depth, -1, -1];
        }
        if (game.hasWon(isMaximizing ? _switch_player(player) : player)) {
            return [-10 + depth, -1, -1];
        }
        if (game.isTie()) {
            return [0, -1, -1];
        }
        let value = [isMaximizing ? -9999 : 9999, -1, -1];
        const f = isMaximizing ? _gt : _lt;
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                const boardCell = board[row][column];
                if (boardCell.getValue() !== cellContent.Empty) {
                    continue;
                }
                boardCell.changeValue(player.getMark());
                const minimaxValue = minimax(board, depth + 1, _switch_player(player), !isMaximizing)[0];
                if (f(minimaxValue, value[0])) {
                    value = [minimaxValue, row, column];
                }
                boardCell.changeValue(cellContent.Empty);
            }
        }
        return value;
    }
    function pickBestMove(player) {
        const [bestMoveRow, bestMoveColumn] = minimax(game.getBoard(), 0, player, true).slice(1);
        return [bestMoveRow, bestMoveColumn];
    }
    return {
        playRound,
        getActivePlayer,
        getBoard: game.getBoard,
    };
}
//# sourceMappingURL=aiController.js.map