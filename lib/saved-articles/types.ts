import type { ConvertedPage } from "@/lib/feed-me/document";

/** 로그인한 사용자가 자기 계정에 보관한 변환 결과의 스냅샷. */
export type SavedArticle = ConvertedPage & { id: string; savedAt: string };

export type SaveResult = { status: "created" | "overwritten" | "error" };
