import { parseHTML } from "linkedom";
import { Defuddle } from "defuddle/node";

import type { ConvertedPage } from "./document";

export class ConvertError extends Error {
  constructor(
    public code: "fetch-failed" | "empty-content",
    message: string,
    public status?: number
  ) {
    super(message);
  }
}

/** URL의 페이지를 가져와 본문을 Markdown으로 추출한다. */
export async function convertUrl(url: string): Promise<ConvertedPage> {
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; FeedMe/1.0)",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } catch {
    throw new ConvertError("fetch-failed", "접속하지 못했습니다.");
  }
  if (!res.ok) {
    throw new ConvertError("fetch-failed", `HTTP ${res.status}`, res.status);
  }
  const type = res.headers.get("content-type") ?? "";
  if (!/html|xml/i.test(type)) {
    throw new ConvertError("empty-content", "HTML 페이지가 아닙니다.");
  }

  const html = await res.text();
  let result;
  try {
    const { document } = parseHTML(html);
    result = await Defuddle(document, res.url || url, { markdown: true });
  } catch {
    throw new ConvertError("empty-content", "본문을 추출하지 못했습니다.");
  }
  const markdown = (result.content ?? "").trim();
  if (!markdown) {
    throw new ConvertError("empty-content", "본문을 찾지 못했습니다.");
  }
  return {
    url,
    title: result.title?.trim() || new URL(url).hostname,
    author: result.author?.trim() ?? "",
    markdown,
  };
}
