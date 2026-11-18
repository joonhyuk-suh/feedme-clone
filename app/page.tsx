import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { Converter } from "@/components/feed-me/converter";
import { ThemeToggle } from "@/components/feed-me/theme-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

// Header label for the signed-in user: 표시 이름, or the email when it is empty.
async function getAccountLabel() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", claims.sub)
    .maybeSingle();

  return profile?.display_name || claims.email || "계정";
}

export default async function Home() {
  const accountLabel = await getAccountLabel();

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 pt-3 pb-10">
      <header className="flex min-w-0 items-center justify-end gap-1">
        {accountLabel ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="min-w-0 shrink justify-start"
              render={<Link href="/settings" title={accountLabel} />}
              nativeButton={false}
            >
              <span className="truncate">{accountLabel}</span>
            </Button>
            <LogoutButton variant="ghost" size="sm" redirectTo={null} />
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            render={<Link href={`/auth/login?next=${encodeURIComponent("/")}`} />}
            nativeButton={false}
          >
            로그인
          </Button>
        )}
        <ThemeToggle />
      </header>
      <Converter />
      <footer className="mt-10 border-t pt-4 text-center text-xs text-muted-foreground">
        본문 추출: Defuddle · 변환한 내용은 저장하지 않습니다.
      </footer>
    </main>
  );
}
