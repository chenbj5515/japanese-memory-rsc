export * from "./time";
export * from "./speak-text";
export * from "./chat-api";

export const insertPlainTextAtCursor = (plainText: string) => {
  const range = window.getSelection()?.getRangeAt(0);
  range?.deleteContents();
  const textNode = document.createTextNode(plainText);
  range?.insertNode(textNode);
};
