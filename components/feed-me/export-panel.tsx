"use client";

import { useState, type ReactNode } from "react";
import { CopyIcon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  buildExportDocument,
  buildLlmMessage,
  toFileName,
  type ConvertedPage,
} from "@/lib/feed-me/document";
import { LLM_LABEL, planLlmHandoff, type Llm } from "@/lib/feed-me/llm";

const PRESETS = ["요약해줘", "한국어로 번역해줘", "쉽게 설명해줘"];
const CUSTOM = "custom";

export function ExportPanel({ page, actions }: { page: ConvertedPage; actions?: ReactNode }) {
  const [choice, setChoice] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const exportDoc = buildExportDocument(page);
  const prompt = choice === CUSTOM ? custom.trim() : (choice ?? "");
  const preview = buildLlmMessage(prompt, exportDoc);

  async function copy() {
    try {
      await navigator.clipboard.writeText(exportDoc);
      toast.success("Markdown을 복사했습니다", {
        description: "제목·저자·원본 URL과 본문",
      });
    } catch {
      toast.error("복사하지 못했습니다", {
        description: "브라우저가 클립보드 접근을 막았습니다.",
      });
    }
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([exportDoc], { type: "text/markdown;charset=utf-8" })
    );
    const name = toFileName(page);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${name} 파일을 내려받았습니다`);
  }

  async function openLlm(llm: Llm) {
    if (choice === CUSTOM && !prompt) {
      toast.error("프롬프트를 입력하세요", {
        description:
          "직접 입력을 선택했다면 보낼 문장이 필요합니다. 선택을 해제하면 본문만 보냅니다.",
      });
      return;
    }
    const handoff = planLlmHandoff(llm, preview);
    if (handoff.kind === "clipboard") {
      try {
        await navigator.clipboard.writeText(preview);
      } catch {
        toast.error("복사하지 못했습니다", {
          description: "브라우저가 클립보드 접근을 막았습니다.",
        });
        return;
      }
      toast.info("본문이 길어 클립보드에 복사했습니다", {
        description: `새 탭에서 ${handoff.host} 새 대화가 열립니다. 입력창에 붙여넣기(Ctrl+V) 하세요.`,
        duration: 6000,
      });
    } else {
      toast.success(`${LLM_LABEL[llm]}에서 새 대화를 열었습니다`, {
        description: `${handoff.host} 새 탭에 프롬프트와 본문이 입력된 채로 열립니다.`,
      });
    }
    window.open(handoff.url, "_blank", "noopener");
  }

  const hint = prompt
    ? "프롬프트를 본문 앞에 붙여 보냅니다."
    : choice === CUSTOM
      ? "보낼 프롬프트를 입력하세요. 저장되지 않습니다."
      : "프롬프트를 고르지 않으면 본문만 보냅니다.";

  return (
    <Card
      aria-label="내보내기"
      className="grid gap-4 p-4 max-md:order-first md:sticky md:top-4"
    >
      {actions && (
        <>
          <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div>
          <Separator />
        </>
      )}
      <section className="grid gap-2">
        <h3 className="text-sm font-medium">Markdown 내보내기</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={copy}>
            <CopyIcon /> 복사하기
          </Button>
          <Button variant="outline" size="sm" onClick={download}>
            <DownloadIcon /> .md 다운로드
          </Button>
        </div>
      </section>
      <Separator />
      <section className="grid gap-2">
        <h3 className="text-sm font-medium">LLM으로 보내기</h3>
        <ToggleGroup
          aria-label="프롬프트"
          variant="outline"
          size="sm"
          className="flex-wrap"
          value={choice ? [choice] : []}
          onValueChange={(v) => setChoice(v[0] ?? null)}
        >
          {PRESETS.map((p) => (
            <ToggleGroupItem key={p} value={p}>
              {p}
            </ToggleGroupItem>
          ))}
          <ToggleGroupItem value={CUSTOM}>직접 입력</ToggleGroupItem>
        </ToggleGroup>
        {choice === CUSTOM && (
          <Textarea
            autoFocus
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="예: 이 글에서 실무에 바로 쓸 수 있는 팁만 뽑아줘"
            aria-label="직접 입력한 프롬프트"
          />
        )}
        <p className="text-xs text-muted-foreground">{hint}</p>
        <div
          aria-label="보낼 내용 미리보기"
          className="max-h-24 overflow-hidden rounded-md bg-muted px-2.5 py-2 font-mono text-xs leading-normal wrap-anywhere whitespace-pre-wrap text-muted-foreground"
        >
          {preview.slice(0, 400)}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => openLlm("chatgpt")}>
            ChatGPT로 열기
          </Button>
          <Button size="sm" onClick={() => openLlm("claude")}>
            Claude로 열기
          </Button>
        </div>
      </section>
    </Card>
  );
}
