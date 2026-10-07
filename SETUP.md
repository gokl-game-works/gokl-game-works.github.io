# GOKL GAME WORKS — Cyberpunk 60 Edition

사이버펑크 비중을 확실히 높인 버전입니다.

## 변경점
- 거의 블랙에 가까운 배경
- 시안 / 퍼플 / 마젠타 네온 포인트
- HUD 스타일 장식
- 스캔라인 / 노이즈 / 그리드
- 홀로그램 느낌의 유리 패널
- 강한 네온 CTA 버튼
- 프로젝트 카드 틸트 / 히어로 패럴랙스
- 슬로건: `게임과 새로운 시도를 위한 공간.`
- 메타 문구: `GAME WORKS & EXPERIMENTS`

## 적용 방법
1. 파일 전체를 GitHub Pages 저장소에 업로드합니다.
2. `gokl-game-works`를 실제 GitHub 아이디로 바꿉니다.
3. 저장소 Settings → Pages → Deploy from a branch → main → /(root)

## 테마
- 기본: 다크(사이버펑크 중심)
- 토글 클릭 시 라이트 모드 전환


## Dual Theme 자동 전환
- 07:00 ~ 18:59: Apple-inspired Light
- 19:00 ~ 06:59: Cyberpunk Dark
- 테마 버튼 한 번 클릭: 수동 모드로 전환
- 테마 버튼 더블클릭: 자동 시간 모드로 복귀
- 수동 선택은 localStorage에 저장되어 다음 방문에도 유지
- 자동 모드에서는 페이지가 켜진 상태에서도 1분마다 시간대를 확인


## Typography refinement
- 메인: `게임과 / 새로운 시도를 / 위한 공간.` 3줄 고정
- `위한 공간.`을 한 줄로 묶고 아래로 내려 간격 확보
- ABOUT 섹션도 동일한 줄바꿈 구조 적용


## Copy refinement
- Hero: `게임과 새로운 시도를 위한 공간.`
- About: `게임을 좋아해서 시작한 작업들.`


## Light theme color refinement
- 상단 로고/네비/라벨을 검정·회색 중심으로 변경
- 파란색은 `공간.`과 일부 포인트에만 사용
- 주요 CTA는 라이트 모드에서 블랙 버튼으로 변경


## Light headline fix
- 라이트모드 메인 헤드라인은 검정 중심
- `공간.`만 블루 포인트 유지


## Project Motion Upgrade
- Light mode: Apple-style subtle lift / scale / soft highlight
- Dark mode: mouse-tracking cyan/purple glow, stronger tilt, neon edge line
- Project cards animate in on load
- Filter changes use fade + slide transitions
- In-progress status has a subtle pulse in dark mode
- Mobile / touch devices automatically reduce effects
- prefers-reduced-motion is respected


## Review fixes
- Removed duplicate project filter click handler
- Removed legacy always-on tilt handler
- Light mode now stays restrained and flat
- Dark mode alone gets reactive 3D tilt
- Reduced-motion preference is respected by JavaScript as well as CSS


## Hero clipping fix
- Increased hero headline line-height
- Added top padding to headline and hero copy
- Prevented overflow clipping on large Korean glyphs


## Progress display refinement
- Main card: removed single 72% progress value
- Main card now shows `IN PROGRESS`
- Detail page adds category progress:
  - Translation 100%
  - Review 75%
  - Graphics 45%
  - Testing 30%
- These values are placeholders and can be edited directly in `projects/dw8xlce.html`


## Patch Installer Download
Current public installer:
`GOKL_GAME_WORKS_Patch_Installer_v0.6.1_Windows_x64.zip`

Direct download:
`https://github.com/gokl-game-works/gokl-patch-installer/releases/download/v0.6.1/GOKL_GAME_WORKS_Patch_Installer_v0.6.1_Windows_x64.zip`

사이트의 다운로드 버튼은 현재 위 Release Asset으로 직접 연결됩니다.
