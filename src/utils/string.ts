import diff_match_patch from "diff-match-patch";

export function transformString(input: string) {
    let result = input.trim();

    result = result.replace(/\(.*?\)/g, "").trim();

    result = result.replace(/\s+/g, "、");

    const quoteIndex = result.indexOf("“");
    if (quoteIndex !== -1) {
        result = result.slice(quoteIndex + 1);
    }

    return result;
}
// const input = '这是一个(测试)字符串 “包含 引号” 和括号的内容';
// console.log(transformString(input));


export function containsKanji(input: string) {
    // 使用正则表达式匹配日文汉字的Unicode范围
    const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf]/;
    return kanjiRegex.test(input);
}

export function getDiff(s0: string, s1: string) {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(
        s0 || "",
        s1 || ""
    );

    const htmlString = diff.map(([res, text]) => {
        return `<span class="${res === -1
            ? "text-wrong"
            : res === 1
                ? "text-correct"
                : ""
            } w-full break-words pointer-events-none">${text}</span>`;
    }).join("");

    return {
        diff,
        htmlString
    };
}