"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpIcon, CircleAlertIcon, Loader2Icon, XIcon } from "lucide-react";

import { ResultView } from "@/components/feed-me/result-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConvertedPage } from "@/lib/feed-me/document";
import { normalizeUrl } from "@/lib/feed-me/url";

type State =
  | { kind: "idle" }
  | { kind: "invalid" }
  | { kind: "loading" }
  | { kind: "done"; page: ConvertedPage }
  | { kind: "error"; error: "fetch-failed" | "empty-content"; status?: number };

const EXAMPLES = ["stephango.com/saw", "en.wikipedia.org/wiki/Markdown"];

export function Converter({
  resultActions,
}: {
  /** 변환을 마친 결과마다 내보내기 패널 위에 놓을 동작. 새 변환마다 새로 마운트된다. */
  resultActions?: (page: ConvertedPage) => ReactNode;
} = {}) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  // 지우기·새 변환 때 결과 화면의 상태(프롬프트 선택, 저장됨)를 함께 초기화하기 위한 키
  const [session, setSession] = useState(0);
  const loading = state.kind === "loading";

  async function convert(raw: string) {
    if (loading) return;
    const url = normalizeUrl(raw);
    if (!url) {
      setState({ kind: "invalid" });
      return;
    }
    setInput(url);
    setSession((s) => s + 1);
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) setState({ kind: "done", page: data });
      else if (data.error === "invalid-url") setState({ kind: "invalid" });
      else setState({ kind: "error", error: data.error, status: data.status });
    } catch {
      setState({ kind: "error", error: "fetch-failed" });
    }
  }

  function clear() {
    setInput("");
    setState({ kind: "idle" });
    setSession((s) => s + 1);
  }

  return (
    <>
      <section className="relative isolate py-2">
        {/* Dark mode uses a stronger glow and glass so the input stands out (spec: 비교안 C). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [&>span]:dark:scale-125 [&>span]:dark:bg-foreground/26"
        >
          <span className="absolute top-28 left-[8%] h-28 w-56 rounded-full bg-foreground/10 blur-3xl" />
          <span className="absolute top-32 left-[48%] h-24 w-64 rounded-full bg-foreground/10 blur-3xl" />
          <span className="absolute top-24 right-[6%] h-20 w-36 rounded-full bg-foreground/10 blur-3xl" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          FEED-ME
        </h1>
        <p className="mt-1.5 mb-5 text-muted-foreground">
          어떤 URL이든, Markdown으로.
        </p>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            convert(input);
          }}
        >
          <InputGroup className="h-12 rounded-xl border-foreground/15 bg-background/55 shadow-lg backdrop-blur-md dark:border-foreground/32 dark:bg-foreground/10 dark:shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--foreground)_20%,transparent),0_0_24px_0_color-mix(in_oklab,var(--foreground)_10%,transparent),0_10px_30px_-10px_rgb(0_0_0/0.6)]">
            <InputGroupInput
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="https://example.com"
              aria-label="웹 페이지 URL"
              aria-invalid={state.kind === "invalid" || undefined}
              aria-describedby={state.kind === "invalid" ? "url-error" : undefined}
              disabled={loading}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (state.kind === "invalid") setState({ kind: "idle" });
              }}
            />
            <InputGroupAddon align="inline-end">
              {input && !loading && (
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  aria-label="지우기"
                  title="지우기"
                  onClick={clear}
                >
                  <XIcon />
                </InputGroupButton>
              )}
              <InputGroupButton
                type="submit"
                variant="default"
                size="icon-sm"
                aria-label={loading ? "변환 중…" : "변환하기"}
                title="변환하기"
                disabled={loading}
              >
                {loading ? <Loader2Icon className="animate-spin" /> : <ArrowUpIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
        {state.kind === "invalid" && (
          <p id="url-error" role="alert" className="mt-1.5 text-sm text-destructive">
            올바른 웹 주소가 아닙니다. <b>example.com/글주소</b>처럼 입력해 주세요.
          </p>
        )}
      </section>

      {(state.kind === "idle" || state.kind === "invalid") && (
        <div className="mt-6 rounded-xl border border-dashed p-7 text-center text-muted-foreground">
          <h3 className="text-[15px] font-medium text-foreground">
            변환할 페이지의 URL을 붙여넣으세요
          </h3>
          <p className="mt-1 text-sm">
            블로그 글, 뉴스 기사, 문서 페이지처럼 본문이 있는 페이지에 잘 맞습니다.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                className="rounded-full border bg-background px-2.5 py-0.5 font-mono text-xs text-foreground hover:bg-accent"
                onClick={() => convert(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.kind === "error" && (
        <Alert variant="destructive" className="mt-5">
          <CircleAlertIcon />
          <AlertTitle>
            {state.error === "empty-content"
              ? "본문을 찾지 못했습니다"
              : "페이지를 가져오지 못했습니다"}
          </AlertTitle>
          <AlertDescription>
            {state.error === "empty-content"
              ? "페이지는 열렸지만 추출할 글이 없습니다. 로그인이 필요하거나 화면을 스크립트로 그리는 페이지일 수 있습니다."
              : state.status
                ? `사이트가 자동 접속을 막았거나 응답하지 않았습니다 (HTTP ${state.status}). 브라우저에서 페이지를 연 뒤 본문을 직접 복사해 주세요.`
                : "사이트에 접속하지 못했습니다. 주소를 확인하거나 잠시 뒤 다시 시도해 주세요."}
          </AlertDescription>
        </Alert>
      )}

      {loading && (
        <div
          aria-busy="true"
          className="mt-6 grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_300px]"
        >
          <Card className="gap-3 p-6">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-4 h-3.5" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-3.5 w-3/5" />
          </Card>
          <Card className="gap-3 p-4">
            <Skeleton className="h-8" />
            <Skeleton className="h-16" />
            <Skeleton className="h-8" />
          </Card>
        </div>
      )}

      {state.kind === "done" && (
        <ResultView
          key={session}
          page={state.page}
          actions={resultActions?.(state.page)}
        />
      )}
    </>
  );
}
