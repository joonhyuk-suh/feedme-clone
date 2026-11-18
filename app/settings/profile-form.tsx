"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateDisplayName, type ProfileFormState } from "./actions";

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(
    updateDisplayName,
    { status: "idle" }
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="display_name">표시 이름</Label>
        <Input id="display_name" name="display_name" maxLength={50} defaultValue={displayName} />
      </div>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      {state.status === "saved" && <p className="text-sm text-muted-foreground">저장했습니다.</p>}
      <Button type="submit" className="self-start" disabled={pending}>
        {pending ? "저장하는 중..." : "저장"}
      </Button>
    </form>
  );
}
