# 웹 페이지 본문 추출

## Decisions

- 본문 추출은 `defuddle` 라이브러리를 직접 써서 Markdown으로 받습니다. DOM 구현은 `linkedom`을 씁니다.
- 대상 페이지를 가져오고 변환하는 일은 서버(`app/api/convert`)에서 합니다.
- 대상 사이트의 응답 상태를 변환 전에 확인하고, 4xx·5xx나 접속 실패는 오류로 돌려줍니다. 페이지는 열렸지만 추출한 본문이 비어 있으면 "본문을 찾지 못했다"로 구분합니다.
- 서버가 가져온 HTML에 본문이 없으면(로그인이 필요한 페이지, 스크립트로 그리는 페이지) 본문 없음으로 처리합니다.

## Boundaries

- 403 등으로 자동 접속을 막는 사이트를 우회하지 않습니다. 예: `https://news.hada.io/`는 403을 돌려줍니다.
- 사용자가 입력한 임의의 URL을 서버가 가져오므로 내부망 주소 요청 같은 악용 가능성이 남지만, 강의용 범위라 막지 않습니다.

## Why

브라우저에서 다른 사이트의 HTML을 직접 가져오면 CORS에 막히므로 서버에서 가져옵니다. 응답 상태를 먼저 보는 이유는, 403 안내문처럼 HTML이 아닌 본문을 `linkedom` + `defuddle`에 그대로 넘기면 `documentElement`가 null이라는 예외로 실패하기 때문입니다.

## Reconsider when

- `linkedom`에서 파싱 문제가 생기면 `jsdom`으로 바꿉니다. 둘 다 `defuddle/node`와 동작하는 것을 확인했습니다.
- 스크립트로 그리는 페이지를 지원해야 한다는 요구가 생기면 서버 측 브라우저 렌더링을 검토합니다.

## Still-rejected alternatives

- defuddle.md 호스팅 API — 요청 수 제한과 유료 키가 생깁니다.
- 봇 차단 우회 — 사이트의 의사를 존중하고 범위를 작게 유지합니다.

## Evidence worth preserving

- `defuddle` 0.19.6을 Node 26.13.1, `defuddle/node`, `linkedom` 조합으로 돌려 일반 글, 위키 문서, X 게시물에서 제목·저자·Markdown 본문이 나오는 것을 확인했습니다.
