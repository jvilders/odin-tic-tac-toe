import { cellContent } from "./types.js";
export default function makeCell() {
    let contents = cellContent.Empty;
    function changeValue(newValue) {
        contents = newValue;
    }
    function getValue() {
        return contents;
    }
    return { getValue, changeValue };
}
//# sourceMappingURL=boardCell.js.map