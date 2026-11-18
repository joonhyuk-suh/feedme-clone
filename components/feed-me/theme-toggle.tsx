"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // 서버 렌더에서는 테마를 알 수 없어, 마운트 뒤에만 실제 테마로 라벨을 정한다.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const toNext = mounted && resolvedTheme === "dark" ? "light" : "dark";
  const label = toNext === "dark" ? "다크 모드로 전환" : "라이트 모드로 전환";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => setTheme(toNext)}
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </Button>
  );
}
