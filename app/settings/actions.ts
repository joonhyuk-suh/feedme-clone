"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = { status: "idle" | "saved" | "error"; message?: string };

export async function updateDisplayName(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return { status: "error", message: "로그인이 필요합니다." };

  const raw = formData.get("display_name");
  const displayName = typeof raw === "string" ? raw.trim() : "";
  if (displayName.length > 50) {
    return { status: "error", message: "표시 이름은 50자 이하로 입력하세요." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName || null, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) return { status: "error", message: "저장하지 못했습니다." };

  revalidatePath("/settings");
  return { status: "saved" };
}
