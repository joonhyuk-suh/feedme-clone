import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { Toaster } from "@/components/ui/sonner";
import type { SaveResult } from "@/lib/saved-articles/types";

vi.mock("next-themes", () => ({ useTheme: () => ({ theme: "light" }) }));

// 서버 액션은 네트워크 너머 Supabase에 쓰는 경계다.
const saveArticle = vi.fn<() => Promise<SaveResult>>();
vi.mock("@/lib/saved-articles/actions", () => ({ saveArticle: () => saveArticle() }));

import { SaveButton } from "./save-button";

const page = { url: "https://a.dev/x", title: "제목", author: "", markdown: "본문" };

function renderButton() {
  return render(
    <>
      <SaveButton page={page} />
      <Toaster />
    </>
  );
}

beforeEach(() => saveArticle.mockReset());

describe("저장 버튼", () => {
  test("처음 저장하면 새로 저장했다고 알리고 저장됨으로 바뀐다", async () => {
    saveArticle.mockResolvedValue({ status: "created" });
    renderButton();

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(await screen.findByText("저장한 글에 저장했습니다")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장됨" })).toBeDisabled();
  });

  test("이미 저장한 URL이면 덮어썼다고 알린다", async () => {
    saveArticle.mockResolvedValue({ status: "overwritten" });
    renderButton();

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(
      await screen.findByText("이미 저장한 글을 최신 내용으로 덮어썼습니다")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장됨" })).toBeDisabled();
  });

  test("저장에 실패하면 오류를 알리고 다시 누를 수 있다", async () => {
    saveArticle.mockResolvedValue({ status: "error" });
    renderButton();

    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(await screen.findByText("저장하지 못했습니다")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장" })).toBeEnabled();
  });
});
