import Link from "next/link";
import { redirect } from "next/navigation";

import { SavedArticleList } from "@/components/saved-articles/saved-article-list";
import { listSavedArticles } from "@/lib/saved-articles/queries";
import { createClient } from "@/lib/supabase/server";

export default async function SavedArticlesPage() {
  const supabase = await createClient();
  // proxy.ts only does an optimistic redirect; verify the user again here.
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login?next=/saved");

  const articles = await listSavedArticles();

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 pt-3 pb-10">
      <header className="flex items-center">
        <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          ← 변환기로 돌아가기
        </Link>
      </header>
      <h1 className="mt-6 mb-5 text-2xl font-semibold tracking-tight">저장한 글</h1>
      <SavedArticleList articles={articles} />
    </main>
  );
}
