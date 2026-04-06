# 📰 뉴스 모니터 (News Monitor)

> 키워드 기반 실시간 뉴스 모니터링 모바일 PWA

## 소개

투자 관심 종목 및 커스텀 키워드의 최신 뉴스를 한 눈에 확인하는 모바일 최적화 PWA입니다.  
Google News RSS를 기반으로 뉴스를 수집하며, 별도 서버 없이 정적 파일 한 장(`index.html`)으로 동작합니다.

## 주요 기능

- **키워드 뉴스 수집** — 등록한 키워드별 최신 뉴스를 Google News RSS에서 수집
- **개별 새로고침** — 키워드 카드마다 ↻ 버튼으로 단독 갱신 가능
- **실시간 검색** — 홈 화면 검색바로 전체 키워드 뉴스 즉시 필터링
- **3중 프록시 폴백** — rss2json → codetabs → allorigins 순 자동 전환
- **PWA 설치** — 홈 화면 추가 시 앱처럼 전체 화면으로 실행
- **다크 테마** — 다크 UI 고정
- **뒤로가기 지원** — 히스토리 API로 SPA 탐색 시 데이터 유지
- **수동 새로고침** — 앱 실행 시 자동 수집 없음, 필요할 때만 갱신

## 기술 스택

| 항목 | 내용 |
|---|---|
| 구현 방식 | 단일 HTML 파일 (HTML + CSS + JS 인라인) |
| 뉴스 소스 | Google News RSS |
| CORS 우회 | rss2json / codetabs / allorigins 3중 프록시 |
| 오프라인 지원 | Service Worker (sw.js) |
| 배포 | Netlify 정적 호스팅 |

## 파일 구조

```
news-monitor-src/
├── index.html      # 앱 전체 (단일 파일)
├── sw.js           # Service Worker
├── manifest.json   # PWA 매니페스트
└── netlify.toml    # Netlify 배포 설정
```

## 로컬 실행

```bash
npx serve .
# 또는
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속

## Netlify 배포

**ZIP 드래그앤드롭**
```bash
zip -j news-monitor-netlify.zip index.html sw.js manifest.json netlify.toml
```
[app.netlify.com](https://app.netlify.com) 에 ZIP 드래그앤드롭

**GitHub 자동 배포**
1. Netlify 대시보드 → Add new site → Import an existing project
2. GitHub 연결 → 이 레포 선택
3. Branch: `main` / Build command: 없음 / Publish directory: `.`
4. Deploy 클릭

## 버전 히스토리

| 버전 | 내용 |
|---|---|
| v2.0 | rss2json count 파라미터 제거(유료화 대응), 3중 프록시 재구성, 수동 새로고침 전환 |
| v1.9 | 개별 키워드 ↻ 새로고침, 홈 검색바, 뒤로가기 버그 수정 |
| v1.x | 초기 버전 |

## 라이선스

MIT
