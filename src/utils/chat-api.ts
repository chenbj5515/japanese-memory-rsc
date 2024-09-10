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

export function callChatApi(content: string, {
    onopen,
    onmessage,
    onclose,
    onerror,
    prompt
}: any) {
  fetchEventSource(apiUrl, {
    method: "POST",
    body: JSON.stringify({
      ...data,
      messages: [
        { role: "system", content: prompt || defaultPrompt },
        { role: "user", content },
      ],
    }),
    headers,
    openWhenHidden: true,
    onopen,
    onmessage,
    onclose,
    onerror,
  });
}

export function fetchChatApi(content: string, prompt: string) {
  return fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0125', // 使用指定的模型
      messages: [
        { role: "system", content: prompt || defaultPrompt },
        { role: "user", content },
      ],
      max_tokens: 100, // 控制输出的长度
      temperature: 0.7, // 控制生成内容的创意性
    }),
  })
}
