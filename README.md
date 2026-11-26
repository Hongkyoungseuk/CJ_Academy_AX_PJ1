# CJ_Academy_PJ1 · 트릭컬 리바이브 주간 공지

트릭컬 리바이브 공식 카페의 공지를 **업데이트 주기(매주 목요일) 단위로 묶어 핵심 키워드만** 정리한 페이지입니다.
개인 공부용 비공식 페이지이며, 이미지 저작권은 에피드게임즈에 있습니다.

- 사이트: https://hongkyoungseuk.github.io/CJ_Academy_PJ1/
- 출처: https://cafe.naver.com/trickcal

## 구조

```
index.html            메인: 주간 카드 목록
week.html             상세: week.html?w=2026-11-26
css/style.css
js/common.js          날짜·기한 계산 등 공통 함수
js/main.js            목록 그리기
js/week.js            상세 그리기, 쿠폰 복사 버튼
data/weeks.json       주간 목록 (카드에 보이는 내용)
data/<날짜>.json       그 주 상세 내용
images/<날짜>/         그 주 핵심 이미지 3~5장 (폭 800px webp)
```

## 매주 추가하는 방법

1. 그 주 업데이트일(목요일) 날짜로 `data/<날짜>.json` 을 만든다 (기존 파일 형식 그대로)
2. 핵심 이미지 3~5장을 `images/<날짜>/` 에 넣는다
3. `data/weeks.json` 배열에 그 주 항목을 하나 추가한다
4. 커밋 → push 하면 Pages에 반영된다

쿠폰·보상의 `until`(기한)이 지나면 페이지가 알아서 "종료"·취소선으로 바꿔 보여 준다.
