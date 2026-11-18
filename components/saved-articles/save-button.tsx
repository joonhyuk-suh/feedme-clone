"use client";

import { useState } from "react";
import { BookmarkCheckIcon, BookmarkIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ConvertedPage } from "@/lib/feed-me/document";
import { saveArticle } from "@/lib/saved-articles/actions";

/** 변환 결과 하나를 저장한다. 새 변환 결과마다 새로 마운트해야 다시 저장할 수 있다. */
export function SaveButton({ page }: { page: ConvertedPage }) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  async function save() {
    setState("saving");
    const result = await saveArticle(page).catch(() => ({ status: "error" as const }));
    if (result.status === "error") {
      setState("idle");
      toast.error("저장하지 못했습니다", { description: "잠시 뒤 다시 시도해 주세요." });
      return;
    }
    setState("saved");
    if (result.status === "overwritten") {
      toast.success("이미 저장한 글을 최신 내용으로 덮어썼습니다");
    } else {
      toast.success("저장한 글에 저장했습니다");
    }
  }

  return (
    <Button variant="outline" size="sm" disabled={state !== "idle"} onClick={save}>
      {state === "saving" ? (
        <Loader2Icon className="animate-spin" />
      ) : state === "saved" ? (
        <BookmarkCheckIcon />
      ) : (
        <BookmarkIcon />
      )}
      {state === "saved" ? "저장됨" : "저장"}
    </Button>
  );
}
