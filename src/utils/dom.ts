// 避免带有格式的粘贴
export const insertPlainTextAtCursor = (plainText: string) => {
    const range = window.getSelection()?.getRangeAt(0);
    range?.deleteContents();
    const textNode = document.createTextNode(plainText);
    range?.insertNode(textNode);
}