import diff_match_patch from "diff-match-patch";

/**
 * 文字列を変換する関数
 * 1. 文字列の前後の空白を削除
 * 2. 括弧()とその中身を削除
 * 3. 連続する空白を「、」に置換
 * 4. 引用符「"」以降の文字列を抽出
 * @param input 変換したい文字列
 * @returns 変換後の文字列
 */
export function transformString(input: string) {
    let result = input.trim();

    // 全角括弧と半角括弧の中身を削除
    result = result.replace(/[（(].*?[）)]/g, "").trim();

    // 全角空白と半角空白を「、」に置換
    result = result.replace(/[\s\u3000]+/g, "、");

    const quoteIndex = result.indexOf("“");
    if (quoteIndex !== -1) {
        result = result.slice(quoteIndex + 1);
    }

    return result;
}
// const input = '这是一个(测试)字符串 “包含 引号” 和括号的内容';
// console.log(transformString(input));

export function parseJSONSafely(input: string) {
    try {
        const parsed = JSON.parse(input);
        return parsed;
    } catch (e) {
        return input;
    }
}

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