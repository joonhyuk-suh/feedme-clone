import Link from "next/link";

import { Converter } from "@/components/feed-me/converter";
import { ThemeToggle } from "@/components/feed-me/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 pt-3 pb-10">
      <header className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="sm" render={<Link href="/settings" />} nativeButton={false}>
          계정
        </Button>
        <ThemeToggle />
      </header>
      <Converter />
      <footer className="mt-10 border-t pt-4 text-center text-xs text-muted-foreground">
        본문 추출: Defuddle · 변환한 내용은 저장하지 않습니다.
      </footer>
    </main>
  );
}
