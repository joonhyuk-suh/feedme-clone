import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { SavedArticleList } from "./saved-article-list";

test("저장한 글이 없으면 빈 상태와 변환 화면으로 가는 길을 보여 준다", () => {
  render(<SavedArticleList articles={[]} />);

  expect(screen.getByText("아직 저장한 글이 없습니다")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "글 변환하러 가기" })).toHaveAttribute("href", "/");
});

test("각 항목은 제목, 원본 사이트 주소, 저장 날짜를 보여 주고 상세로 이어진다", () => {
  render(
    <SavedArticleList
      articles={[
        {
          id: "11111111-1111-4111-8111-111111111111",
          url: "https://en.wikipedia.org/wiki/Markdown",
          title: "Markdown",
          // 한국 시간 2026년 11월 18일 오전 9시
          savedAt: "2026-11-18T00:00:00+00:00",
        },
      ]}
    />
  );

  const link = screen.getByRole("link", { name: /Markdown/ });
  expect(link).toHaveAttribute("href", "/saved/11111111-1111-4111-8111-111111111111");
  expect(link).toHaveTextContent("en.wikipedia.org");
  expect(link).toHaveTextContent("2026. 11. 18.");
});
