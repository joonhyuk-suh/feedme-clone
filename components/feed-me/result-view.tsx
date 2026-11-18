import type { ReactNode } from "react";

import { ExportPanel } from "@/components/feed-me/export-panel";
import { MarkdownView } from "@/components/feed-me/markdown-view";
import { Card } from "@/components/ui/card";
import type { ConvertedPage } from "@/lib/feed-me/document";

/** 변환 결과의 본문과 내보내기 패널. `actions`는 내보내기 패널 맨 위에 놓인다. */
export function ResultView({ page, actions }: { page: ConvertedPage; actions?: ReactNode }) {
  return (
    <div className="mt-6 grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_300px]">
      <Card className="p-6 md:px-7">
        <header className="border-b pb-4">
          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            title={page.url}
            className="block truncate text-xs text-muted-foreground hover:underline"
          >
            {page.url.replace(/^https?:\/\//, "")}
          </a>
          <h2 className="mt-2 mb-1.5 text-2xl leading-snug font-semibold tracking-tight wrap-anywhere">
            {page.title}
          </h2>
          <p className="flex flex-wrap gap-x-2.5 text-[13px] text-muted-foreground">
            {page.author && <span>{page.author}</span>}
            {page.author && <span aria-hidden>·</span>}
            <span>약 {page.markdown.length.toLocaleString("ko-KR")}자</span>
          </p>
        </header>
        <MarkdownView markdown={page.markdown} />
      </Card>
      <ExportPanel page={page} actions={actions} />
    </div>
  );
}
