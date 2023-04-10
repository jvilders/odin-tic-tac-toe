import { makeCell, cellContent } from "./boardCell/index.js";
export default function makeGameBoard() {
    const board = [
        [makeCell(), makeCell(), makeCell()],
        [makeCell(), makeCell(), makeCell()],
        [makeCell(), makeCell(), makeCell()],
    ];
    function markSquare(player, row, column) {
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
        console.log(board.map((boardRow) => boardRow.map((boardCell) => boardCell.getValue())));
    }
    function isTie() {
        for (const boardRow of board) {
            for (const boardCell of boardRow) {
                if (boardCell.getValue() === cellContent.Empty) {
                    return false;
                }
            }
        }
        return true;
    }
    function hasWon(player) {
        // naive implementation for now
        const targetMark = player.getMark();
        // check rows
        if (board.some((boardRow) => boardRow.every((cell) => cell.getValue() === targetMark))) {
            return true;
        }
        // check columns
        for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
            if (board.every((boardRow) => boardRow[columnIndex].getValue() === targetMark)) {
                return true;
            }
        }
        // check diagonals
        if ((board[0][0].getValue() === targetMark &&
            board[1][1].getValue() === targetMark &&
            board[2][2].getValue() === targetMark) ||
            (board[0][2].getValue() === targetMark &&
                board[1][1].getValue() === targetMark &&
                board[2][0].getValue() === targetMark)) {
            return true;
        }
        return false;
    }
    return { markSquare, getBoard, showBoard, isTie, hasWon };
}
//# sourceMappingURL=gameBoard.js.map