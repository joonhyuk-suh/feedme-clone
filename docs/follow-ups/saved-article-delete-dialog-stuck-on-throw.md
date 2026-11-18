# 저장한 글 삭제 액션이 예외를 던지면 확인 대화상자가 멈춤

- 증상: `components/saved-articles/delete-article-button.tsx`의 `remove()`가 `deleteArticle` 예외(오프라인 등)를 잡지 않아 `deleting`이 true로 남고, 취소·삭제 버튼이 모두 비활성화된 채 대화상자를 닫을 수 없다.
- 근거: `code-review low`(saved-articles PR) 지적. 정상 네트워크의 런타임 검증(AC6)에서는 재현되지 않았다.
- 추정 원인: 오류를 결과 값(`{ status: "error" }`)으로만 처리하고 throw 경로는 처리하지 않는다.
- 시도한 것: 없음(검증·리뷰 예산상 범위 밖).
- 다음 단계: `SaveButton`처럼 `.catch(() => ({ status: "error" }))`로 감싸 오류 알림 경로로 보낸다.
