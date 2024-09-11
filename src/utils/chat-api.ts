import { fetchEventSource } from "@microsoft/fetch-event-source";

const apiUrl = "https://api.openai.com/v1/chat/completions";
const defaultPrompt = process.env.NEXT_PUBLIC_OPENAI_PROMPT;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};
const data = {
  model: "gpt-3.5-turbo-0125",
  max_tokens: 100,
  stream: true,
};

export async function callChatApi(content: string, {
  onopen,
  onmessage,
  onclose,
  onerror,
  prompt
}: any) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content },
          { role: 'system', content: prompt },
        ]
      }), // 传递对话的消息
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat data');
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let result = "";

    let done = false;
    let bufferText = "";

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      const chunk = decoder.decode(value, { stream: true });
      const regex = /0:"([^"]+)"/g;
      let match;
      while ((match = regex.exec(chunk)) !== null) {
        // bufferText += match[1];
        onmessage(match[1])
        console.log(chunk, match[1])
        // setTimeout(() => {
        //   result += bufferText;  // 将缓冲区的内容追加到当前文本
        //   bufferText = "";            // 清空缓冲区
        //   onmessage(result)
        // }, 1000);  // 设置一个合适的时间间隔
      }
    }
    onclose();
  }
  catch (e) {
    onerror(e);
  }
}

// export function fetchChatApi(content: string, prompt: string) {
//   return fetch(apiUrl, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify({
//       model: 'gpt-4-turbo', // 使用指定的模型
//       messages: [
//         { role: "system", content: prompt || defaultPrompt },
//         { role: "user", content },
//       ],
//       max_tokens: 100, // 控制输出的长度
//       temperature: 0.7, // 控制生成内容的创意性
//     }),
//   })
// }
