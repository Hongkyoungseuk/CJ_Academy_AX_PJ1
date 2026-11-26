// 상세 페이지: 주소의 ?w=2026-11-26 값을 보고 data/2026-11-26.json을 읽어서 그린다

const detailEl = document.getElementById("week-detail");
const weekId = new URLSearchParams(location.search).get("w");

// 항목 하나 (이름 + 설명 + 기한 + 이미지)
function itemHTML(it) {
  const expired = isExpired(it.until);
  const until = it.until ? `<span class="until ${expired ? "past" : ""}">${untilText(it.until)}</span>` : "";
  const img = it.image
    ? `<figure><img src="${esc(it.image.src)}" alt="${esc(it.image.alt)}" loading="lazy"><figcaption>${esc(it.image.alt)}</figcaption></figure>`
    : "";
  return `
    <li class="item ${expired ? "expired" : ""}">
      <div class="item-head"><strong>${esc(it.name)}</strong>${until}</div>
      ${it.desc ? `<p>${esc(it.desc)}</p>` : ""}
      ${img}
    </li>`;
}

// 섹션 하나 (업데이트, 이벤트, 상품 …)
function sectionHTML(sec) {
  return `
    <section class="block">
      <h2>${esc(sec.title)}</h2>
      <ul class="items">${sec.items.map(itemHTML).join("")}</ul>
    </section>`;
}

// 쿠폰 섹션: 쓸 수 있는 쿠폰은 복사 버튼, 지난 쿠폰은 회색 취소선
function couponHTML(data) {
  const list = data.coupons || [];
  const rows = list
    .map((c) => {
      const expired = isExpired(c.until);
      const copyBtn = expired
        ? ""
        : `<button class="copy" data-code="${esc(c.code)}">복사</button>`;
      return `
        <li class="coupon ${expired ? "expired" : ""}">
          <div class="coupon-head">
            <code>${esc(c.code)}</code>${copyBtn}
          </div>
          <p>${esc(c.name)} · ${esc(c.reward)}</p>
          <p class="until ${expired ? "past" : ""}">${expired ? "종료 · " : ""}${untilText(c.until)}</p>
        </li>`;
    })
    .join("");
  const activeCount = list.filter((c) => !isExpired(c.until)).length;
  return `
    <section class="block">
      <h2>쿠폰</h2>
      <p class="note">${activeCount ? `지금 쓸 수 있는 쿠폰 ${activeCount}개` : "지금 쓸 수 있는 쿠폰은 없어요."}</p>
      <ul class="coupons">${rows}</ul>
      ${data.couponHowTo ? `<p class="note">입력 방법: ${esc(data.couponHowTo)}</p>` : ""}
    </section>`;
}

// 동영상 섹션: 유튜브는 페이지 안에서 바로 재생
function videoHTML(videos) {
  if (!videos || !videos.length) return "";
  const items = videos
    .map((v) =>
      v.youtube
        ? `<figure class="video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(v.youtube)}" title="${esc(v.title)}" allowfullscreen loading="lazy"></iframe><figcaption>${esc(v.title)}</figcaption></figure>`
        : `<p>🎬 ${esc(v.title)}${v.note ? ` · ${esc(v.note)}` : ""}</p>`
    )
    .join("");
  return `<section class="block"><h2>동영상</h2>${items}</section>`;
}

// 원문 링크 + 이미지 출처
function sourceHTML(data) {
  const links = (data.sources || [])
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`)
    .join("");
  const excluded = (data.excluded || []).length
    ? `<p class="note">정리에서 뺀 글 (웹툰·이벤트성): ${data.excluded.map(esc).join(" · ")}</p>`
    : "";
  return `
    <section class="block">
      <h2>원문 · 출처</h2>
      <ul class="sources">${links}</ul>
      ${excluded}
      <p class="note">이미지 출처: 트릭컬 리바이브 공식 카페 (저작권 에피드게임즈)</p>
    </section>`;
}

// 복사 버튼 누르면 쿠폰 코드를 클립보드에 넣고 잠깐 "복사됨" 표시
detailEl.addEventListener("click", async (e) => {
  const btn = e.target.closest("button.copy");
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.code);
    btn.textContent = "복사됨!";
  } catch {
    btn.textContent = "복사 실패";
  }
  setTimeout(() => (btn.textContent = "복사"), 1500);
});

// 전체 그리기
async function renderWeek() {
  if (!weekId || !/^\d{4}-\d{2}-\d{2}$/.test(weekId)) {
    detailEl.innerHTML = `<p class="error">어느 주인지 알 수 없어요. <a href="index.html">목록</a>에서 골라 주세요.</p>`;
    return;
  }
  try {
    const data = await loadJSON(`data/${weekId}.json`);
    document.title = `${shortDate(data.start)} ~ ${shortDate(data.end)} · 트릭컬 리바이브 주간 공지`;
    document.getElementById("week-title").textContent = `${shortDate(data.start)} ~ ${shortDate(data.end)}`;
    document.getElementById("week-range").textContent = data.summary || "";

    const tags = data.keywords.map((k) => `<li>${esc(k)}</li>`).join("");
    detailEl.innerHTML = `
      <section class="block glance">
        <h2>한눈에</h2>
        <ul class="tags">${tags}</ul>
      </section>
      ${data.sections.map(sectionHTML).join("")}
      ${couponHTML(data)}
      ${videoHTML(data.videos)}
      ${sourceHTML(data)}`;
  } catch (err) {
    showError(detailEl, err);
  }
}

renderWeek();
