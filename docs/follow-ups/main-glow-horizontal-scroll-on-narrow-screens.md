# 좁은 화면에서 메인 화면이 가로로 스크롤됩니다

**Symptom**: 폭 360px 화면에서 메인 화면(`/`)을 옆으로 밀면 빈 영역이 보이며 가로 스크롤됩니다. 라이트 모드에서 69px, 다크 모드에서 101px만큼 넘칩니다.

**Observed evidence**: `next dev`(localhost) + `agent-browser`, viewport 360×740에서 `document.documentElement.scrollWidth`가 라이트 429, 다크 461이었고 `scrollTo(200,0)` 뒤 `scrollX`가 69였습니다. 화면 밖으로 넘친 요소는 `components/feed-me/converter.tsx`의 두 번째 빛 덩어리 `span.absolute.top-32.left-[48%].w-64` 하나뿐이었습니다.

**Suspected cause**: 빛 덩어리 레이어(`absolute inset-0`)가 잘리지 않아 `left-[48%] w-64` 요소가 뷰포트 오른쪽으로 삐져나옵니다(추정). main-header-polish의 다크 모드 `scale-125`가 넘치는 폭을 늘렸지만, 라이트 모드에서도 이미 넘치고 있었습니다.

**What was tried**: main-header-polish 스펙이 라이트 모드 변경을 금지해서 손대지 않았습니다. 넘침 측정만 했습니다.

**Proposed next step**: 빛 덩어리 레이어나 `main`에 `overflow-x-clip`을 걸어 가로 스크롤을 없애고, 라이트/다크 모두 빛 번짐이 어색하게 잘리지 않는지 360px와 데스크톱에서 확인합니다.
