import { ConvertError, convertUrl } from "@/lib/feed-me/extract";
import { normalizeUrl } from "@/lib/feed-me/url";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = normalizeUrl(typeof body?.url === "string" ? body.url : "");
  if (!url) {
    return Response.json({ error: "invalid-url" }, { status: 400 });
  }
  try {
    return Response.json(await convertUrl(url));
  } catch (e) {
    if (e instanceof ConvertError) {
      return Response.json(
        { error: e.code, status: e.status },
        { status: e.code === "fetch-failed" ? 502 : 422 }
      );
    }
    return Response.json({ error: "fetch-failed" }, { status: 502 });
  }
}
