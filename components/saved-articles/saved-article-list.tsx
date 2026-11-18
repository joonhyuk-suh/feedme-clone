import Link from "next/link";
import { BookmarkIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { SavedArticle } from "@/lib/saved-articles/types";

type Item = Pick<SavedArticle, "id" | "url" | "title" | "savedAt">;

const dateFormat = new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeZone: "Asia/Seoul" });

function siteOf(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function SavedArticleList({ articles }: { articles: Item[] }) {
  if (articles.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookmarkIcon />
          </EmptyMedia>
          <EmptyTitle>아직 저장한 글이 없습니다</EmptyTitle>
          <EmptyDescription>
            URL을 변환한 뒤 결과 화면의 저장 버튼을 누르면 여기에 모입니다.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/" className={buttonVariants({ size: "sm" })}>
            글 변환하러 가기
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Card className="gap-0 py-0">
      <ul className="divide-y">
        {articles.map((a) => (
          <li key={a.id}>
            <Link
              href={`/saved/${a.id}`}
              className="grid gap-1 px-5 py-4 hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
            >
              <span className="font-medium wrap-anywhere">{a.title}</span>
              <span className="flex flex-wrap gap-x-2.5 text-[13px] text-muted-foreground">
                <span className="truncate">{siteOf(a.url)}</span>
                <span aria-hidden>·</span>
                <time dateTime={a.savedAt}>{dateFormat.format(new Date(a.savedAt))}</time>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
