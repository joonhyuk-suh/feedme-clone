import Link from "next/link";
import { redirect } from "next/navigation";
import { FileQuestionIcon } from "lucide-react";

import { ResultView } from "@/components/feed-me/result-view";
import { DeleteArticleButton } from "@/components/saved-articles/delete-article-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getSavedArticle } from "@/lib/saved-articles/queries";
import { createClient } from "@/lib/supabase/server";

export default async function SavedArticlePage({ params }: PageProps<"/saved/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  // proxy.ts only does an optimistic redirect; verify the user again here.
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect(`/auth/login?next=${encodeURIComponent(`/saved/${id}`)}`);

  const article = await getSavedArticle(id);

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 pt-3 pb-10">
      <header className="flex items-center">
        <Link href="/saved" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          ← 저장한 글 목록
        </Link>
      </header>
      {article ? (
        <ResultView page={article} actions={<DeleteArticleButton id={article.id} />} />
      ) : (
        <Empty className="mt-6 border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileQuestionIcon />
            </EmptyMedia>
            <EmptyTitle>글을 찾을 수 없습니다</EmptyTitle>
            <EmptyDescription>삭제되었거나 주소가 잘못되었습니다.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/saved" className={buttonVariants({ size: "sm" })}>
              저장한 글 목록으로
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </main>
  );
}
