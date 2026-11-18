import { describe, expect, test } from "vitest";

import { buildExportDocument, buildLlmMessage, toFileName } from "./document";
import { MAX_ENCODED_QUERY_LENGTH, planLlmHandoff } from "./llm";
import { normalizeUrl } from "./url";

const page = { url: "https://a.dev/x", title: "제목", author: "김서연", markdown: "본문" };

describe("normalizeUrl", () => {
  test("스킴이 없으면 https를 붙인다", () => {
    expect(normalizeUrl("stephango.com/saw")).toBe("https://stephango.com/saw");
  });
  test.each(["", "   ", "블로그 글 주소", "hello", "a b.com"])("%j는 거절한다", (v) => {
    expect(normalizeUrl(v)).toBeNull();
  });
});

describe("buildExportDocument", () => {
  test("저자가 있으면 저자 줄을 넣는다", () => {
    expect(buildExportDocument(page)).toBe(
      "# 제목\n\n저자: 김서연\n원본: https://a.dev/x\n\n---\n\n본문"
    );
  });
  test("저자가 없으면 저자 줄을 생략한다", () => {
    expect(buildExportDocument({ ...page, author: "" })).toBe(
      "# 제목\n\n원본: https://a.dev/x\n\n---\n\n본문"
    );
  });
});

describe("buildLlmMessage", () => {
  test("프롬프트는 빈 줄을 두고 문서 앞에 붙는다", () => {
    expect(buildLlmMessage("요약해줘", "DOC")).toBe("요약해줘\n\nDOC");
    expect(buildLlmMessage("", "DOC")).toBe("DOC");
  });
});

describe("toFileName", () => {
  test("OS에서 쓸 수 없는 문자를 뺀다", () => {
    expect(toFileName({ ...page, title: 'a/b:c*"d?' })).toBe("abcd.md");
  });
  test("제목이 비면 호스트 이름을 쓴다", () => {
    expect(toFileName({ ...page, title: "" })).toBe("a.dev.md");
  });
});

describe("planLlmHandoff", () => {
  test("짧으면 q에 담아 연다", () => {
    const h = planLlmHandoff("claude", "안녕");
    expect(h).toMatchObject({ kind: "url", url: `https://claude.ai/new?q=${encodeURIComponent("안녕")}` });
  });
  test("길면 클립보드 경로로 분기하고 내용은 URL에 담지 않는다", () => {
    const h = planLlmHandoff("chatgpt", "가".repeat(MAX_ENCODED_QUERY_LENGTH));
    expect(h).toEqual({ kind: "clipboard", url: "https://chatgpt.com/", host: "chatgpt.com" });
  });
});
