interface IOpions {
  onopen?: () => void;
  onmessage: (str: string) => void;
  onclose: () => void;
  onerror: (err?: Error) => void;
  prompt: string
}

export async function callChatApi(content: string, {
  onopen,
  onmessage,
  onclose,
  onerror,
  prompt
}: IOpions) {
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
    onopen?.();

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      const chunk = decoder.decode(value, { stream: true });
      const regex = /0:"([^"]+)"/g;
      let match;
      while ((match = regex.exec(chunk)) !== null) {
        onmessage(match[1])
      }
    }
    onclose();
  }
  catch (e) {
    onerror(e);
  }
}
