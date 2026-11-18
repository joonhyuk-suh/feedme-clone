/** 입력을 변환 가능한 웹 주소로 정규화한다. 웹 주소가 아니면 null. */
export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw || /\s/.test(raw)) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (!/^[^.]+\..{2,}$/.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}
