import { ICell, cellContent } from "./types.js";

export default function makeCell(): ICell {
  let contents: cellContent = cellContent.Empty;

  function changeValue(newValue: cellContent) {
    contents = newValue;
  }

  function getValue(): cellContent {
    return contents;
  }

  return { getValue, changeValue };
}
