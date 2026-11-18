export type Llm = "chatgpt" | "claude";

export const LLM_LABEL: Record<Llm, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
};

const LLM_HOST: Record<Llm, string> = {
  chatgpt: "chatgpt.com",
  claude: "claude.ai",
};

// 인코딩된 q 값이 이 길이를 넘으면 URL 대신 클립보드로 넘긴다. (보수적인 값)
export const MAX_ENCODED_QUERY_LENGTH = 6000;

function baseUrl(llm: Llm): string {
  return llm === "chatgpt" ? "https://chatgpt.com/" : "https://claude.ai/new";
}

export type LlmHandoff =
  | { kind: "url"; url: string; host: string }
  | { kind: "clipboard"; url: string; host: string };

/** 보낼 내용이 짧으면 q에 담아 열고, 길면 클립보드 경로로 분기한다. */
export function planLlmHandoff(llm: Llm, message: string): LlmHandoff {
  const host = LLM_HOST[llm];
  const encoded = encodeURIComponent(message);
  if (encoded.length <= MAX_ENCODED_QUERY_LENGTH) {
    return { kind: "url", url: `${baseUrl(llm)}?q=${encoded}`, host };
  }
  return { kind: "clipboard", url: baseUrl(llm), host };
}
