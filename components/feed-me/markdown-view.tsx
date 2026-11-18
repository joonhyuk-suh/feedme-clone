import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownView({ markdown }: { markdown: string }) {
  return (
    <div
      className={[
        "mt-5 text-[15px] leading-7 wrap-anywhere",
        "[&_h1]:mt-7 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold",
        "[&_h2]:mt-7 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold",
        "[&_h3]:mt-5 [&_h3]:mb-1.5 [&_h3]:font-semibold",
        "[&_p]:mb-3.5 [&_ul]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3.5 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_a]:underline [&_a]:underline-offset-4 [&_img]:my-3 [&_img]:max-w-full [&_img]:rounded-md",
        "[&_blockquote]:mb-3.5 [&_blockquote]:border-l-[3px] [&_blockquote]:pl-3.5 [&_blockquote]:text-muted-foreground",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-px [&_code]:font-mono [&_code]:text-[13px]",
        "[&_pre]:mb-3.5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-muted [&_pre]:p-3",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_table]:mb-3.5 [&_table]:block [&_table]:overflow-x-auto [&_table]:text-[13px]",
        "[&_th]:border [&_th]:bg-muted [&_th]:px-2.5 [&_th]:py-1.5 [&_th]:text-left [&_td]:border [&_td]:px-2.5 [&_td]:py-1.5",
      ].join(" ")}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
