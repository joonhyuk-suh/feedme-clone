import { Converter } from "@/components/feed-me/converter";
import { ThemeToggle } from "@/components/feed-me/theme-toggle";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 pt-3 pb-10">
      <header className="flex justify-end">
        <ThemeToggle />
      </header>
      <Converter />
      <footer className="mt-10 border-t pt-4 text-center text-xs text-muted-foreground">
        본문 추출: Defuddle · 변환한 내용은 저장하지 않습니다.
      </footer>
    </main>
  );
}
