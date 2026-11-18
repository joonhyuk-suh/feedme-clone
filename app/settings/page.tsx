import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import { ProfileForm } from "./profile-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  // proxy.ts only does an optimistic redirect; verify the user again here.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/auth/login?next=/settings");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", claims.sub)
    .maybeSingle();

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 pt-3 pb-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          ← 변환기로 돌아가기
        </Link>
        <LogoutButton />
      </header>
      <div className="mx-auto mt-10 w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium tracking-normal">계정 설정</CardTitle>
            <CardDescription>{claims.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm displayName={profile?.display_name ?? ""} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
