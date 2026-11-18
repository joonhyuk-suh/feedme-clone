import { createClient } from "@/lib/supabase/server";

import type { SavedArticle } from "./types";

// RLS가 본인 글만 돌려주므로 사용자 조건을 따로 붙이지 않는다.

export async function listSavedArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_articles")
    .select("id, url, title, saved_at")
    .order("saved_at", { ascending: false });
  if (error) throw error;
  return data.map((row) => ({
    id: row.id as string,
    url: row.url as string,
    title: row.title as string,
    savedAt: row.saved_at as string,
  }));
}

/** 없거나 다른 사용자의 글, 형식이 틀린 id면 null. */
export async function getSavedArticle(id: string): Promise<SavedArticle | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_articles")
    .select("id, url, title, author, markdown, saved_at")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    url: data.url,
    title: data.title,
    author: data.author,
    markdown: data.markdown,
    savedAt: data.saved_at,
  };
}
