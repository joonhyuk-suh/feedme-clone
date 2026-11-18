"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ConvertedPage } from "@/lib/feed-me/document";
import { createClient } from "@/lib/supabase/server";

import type { SaveResult } from "./types";

/** 변환 결과를 저장한다. 같은 원본 URL이 있으면 최신 내용과 저장 시각으로 덮어쓴다. */
export async function saveArticle(page: ConvertedPage): Promise<SaveResult> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return { status: "error" };

  const { data: existing, error: findError } = await supabase
    .from("saved_articles")
    .select("id")
    .eq("user_id", userId)
    .eq("url", page.url)
    .maybeSingle();
  if (findError) return { status: "error" };

  const { error } = await supabase.from("saved_articles").upsert(
    {
      user_id: userId,
      url: page.url,
      title: page.title,
      author: page.author ?? "",
      markdown: page.markdown,
      saved_at: new Date().toISOString(),
    },
    { onConflict: "user_id,url" }
  );
  if (error) return { status: "error" };

  revalidatePath("/saved");
  return { status: existing ? "overwritten" : "created" };
}

/** 저장한 글을 지우고 목록으로 돌아간다. 실패하면 오류를 돌려준다. */
export async function deleteArticle(id: string): Promise<{ status: "error" }> {
  const supabase = await createClient();
  const { error } = await supabase.from("saved_articles").delete().eq("id", id);
  if (error) return { status: "error" };

  revalidatePath("/saved");
  redirect("/saved");
}
