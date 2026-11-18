"use client";

import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteArticle } from "@/lib/saved-articles/actions";

/** 되돌릴 수 없다는 확인을 거쳐 저장한 글을 지운다. 성공하면 서버가 목록으로 보낸다. */
export function DeleteArticleButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    const result = await deleteArticle(id);
    // 성공하면 redirect로 이 화면을 떠나므로 여기에는 실패만 돌아온다.
    if (result?.status === "error") {
      setDeleting(false);
      setOpen(false);
      toast.error("삭제하지 못했습니다", { description: "잠시 뒤 다시 시도해 주세요." });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
        <Trash2Icon /> 삭제
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>이 글을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            저장한 글에서 지워지며 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={deleting} onClick={remove}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
