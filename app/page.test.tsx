import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: () => {} }),
}));

import Home from "@/app/page";

test("홈 화면은 FEED-ME 제목과 URL 입력란을 보여준다", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { level: 1, name: "FEED-ME" })
  ).toBeInTheDocument();
  expect(screen.getByLabelText("웹 페이지 URL")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "변환하기" })).toBeInTheDocument();
});
