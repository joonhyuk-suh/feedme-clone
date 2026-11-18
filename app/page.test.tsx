import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: () => {} }),
}));

const router = { replace: vi.fn(), refresh: vi.fn(), push: vi.fn() };
vi.mock("next/navigation", () => ({ useRouter: () => router }));

const signOut = vi.fn(async () => ({ error: null }));
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { signOut } }),
}));

type Session = { email: string; displayName: string | null } | null;
let session: Session = null;
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      getClaims: async () => ({
        data: session ? { claims: { sub: "user-1", email: session.email } } : null,
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: session ? { display_name: session.displayName } : null,
          }),
        }),
      }),
    }),
  }),
}));

import Home from "@/app/page";

async function renderHome() {
  render(await Home());
  return within(screen.getByRole("banner"));
}

beforeEach(() => {
  session = null;
  vi.clearAllMocks();
});

test("홈 화면은 FEED-ME 제목과 URL 입력란을 보여준다", async () => {
  await renderHome();

  expect(screen.getByRole("heading", { level: 1, name: "FEED-ME" })).toBeInTheDocument();
  expect(screen.getByLabelText("웹 페이지 URL")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "변환하기" })).toBeInTheDocument();
});

test("로그아웃 상태 헤더에는 메인으로 돌아오는 로그인 링크만 있고 계정 버튼은 없다", async () => {
  const header = await renderHome();

  expect(header.getByRole("button", { name: "로그인" })).toHaveAttribute(
    "href",
    "/auth/login?next=%2F"
  );
  expect(header.queryByText("계정")).not.toBeInTheDocument();
  expect(header.queryByRole("button", { name: "로그아웃" })).not.toBeInTheDocument();
});

test("로그인 상태 헤더는 표시 이름(계정 설정 링크)과 로그아웃 버튼을 보여준다", async () => {
  session = { email: "me@example.com", displayName: "준혁" };
  const header = await renderHome();

  expect(header.getByRole("button", { name: "준혁" })).toHaveAttribute("href", "/settings");
  expect(header.getByRole("button", { name: "로그아웃" })).toBeInTheDocument();
  expect(header.queryByRole("button", { name: "로그인" })).not.toBeInTheDocument();
});

test("표시 이름이 비어 있으면 헤더에 이메일 주소를 보여준다", async () => {
  session = { email: "me@example.com", displayName: null };
  const header = await renderHome();

  expect(header.getByRole("button", { name: "me@example.com" })).toHaveAttribute(
    "href",
    "/settings"
  );
});

test("헤더의 로그아웃은 메인에 머문 채 화면만 새로 고친다", async () => {
  session = { email: "me@example.com", displayName: "준혁" };
  const header = await renderHome();

  fireEvent.click(header.getByRole("button", { name: "로그아웃" }));

  await waitFor(() => expect(router.refresh).toHaveBeenCalled());
  expect(signOut).toHaveBeenCalled();
  expect(router.replace).not.toHaveBeenCalled();
});

test("로그아웃 상태 헤더에는 저장한 글이 없다", async () => {
  const header = await renderHome();

  expect(header.queryByRole("link", { name: "저장한 글" })).not.toBeInTheDocument();
});

test("로그인 상태 헤더 맨 앞에 저장한 글이 있다", async () => {
  session = { email: "me@example.com", displayName: "준혁" };
  const header = await renderHome();

  const first = header.getAllByRole("link")[0];
  expect(first).toHaveTextContent("저장한 글");
  expect(first).toHaveAttribute("href", "/saved");
});

test("푸터는 변환한 내용을 저장하지 않는다고 말하지 않는다", async () => {
  await renderHome();

  expect(screen.getByRole("contentinfo")).not.toHaveTextContent(
    "변환한 내용은 저장하지 않습니다."
  );
});
