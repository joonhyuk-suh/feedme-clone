export type ConvertedPage = {
  url: string;
  title: string;
  author: string;
  markdown: string;
};

/** 복사·다운로드·LLM 열기에 쓰는 내보내기 문서를 만든다. */
export function buildExportDocument(page: ConvertedPage): string {
  const lines = [`# ${page.title}`, ""];
  if (page.author) lines.push(`저자: ${page.author}`);
  lines.push(`원본: ${page.url}`, "", "---", "", page.markdown);
  return lines.join("\n");
}

/** 프롬프트가 있으면 `프롬프트 + 빈 줄 + 문서`, 없으면 문서만. */
export function buildLlmMessage(prompt: string, exportDocument: string): string {
  const p = prompt.trim();
  return p ? `${p}\n\n${exportDocument}` : exportDocument;
}

/** OS에서 쓸 수 없는 문자를 뺀 `.md` 파일 이름. */
export function toFileName(page: Pick<ConvertedPage, "title" | "url">): string {
  const clean = (s: string) =>
    s
      .replace(/[\/:*?"<>|\u0000-\u001f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80)
      .trim();
  const fromTitle = clean(page.title);
  if (fromTitle) return `${fromTitle}.md`;
  try {
    return `${clean(new URL(page.url).hostname) || "page"}.md`;
  } catch {
    return "page.md";
  }
}
