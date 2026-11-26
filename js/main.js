// 메인 페이지: data/weeks.json을 읽어서 주간 카드 목록을 그린다

const listEl = document.getElementById("week-list");

// 카드 하나의 HTML 만들기
function weekCard(w) {
  // 아직 기한이 남은 쿠폰 개수 (기한이 지나면 자동으로 빠진다)
  const activeCoupons = (w.couponUntil || []).filter((u) => !isExpired(u)).length;
  const couponBadge = activeCoupons
    ? `<span class="badge coupon-on">쿠폰 ${activeCoupons}개</span>`
    : `<span class="badge coupon-off">쿠폰 없음</span>`;

  // 마감이 다가오는 보상 (이미 지났으면 표시하지 않는다)
  const deadline =
    w.deadline && !isExpired(w.deadline.until)
      ? `<p class="deadline">⏰ ${esc(w.deadline.text)} · ${untilText(w.deadline.until)}</p>`
      : "";

  const tags = w.keywords.map((k) => `<li>${esc(k)}</li>`).join("");

  return `
    <a class="week-card" href="week.html?w=${encodeURIComponent(w.id)}">
      ${w.thumb ? `<img class="thumb" src="${esc(w.thumb)}" alt="" loading="lazy">` : ""}
      <div class="card-body">
        <div class="card-top">
          <h2>${shortDate(w.start)} ~ ${shortDate(w.end)}</h2>
          ${couponBadge}
        </div>
        <ul class="tags">${tags}</ul>
        ${deadline}
      </div>
    </a>`;
}

// 목록 불러와서 최신 주가 위로 오게 정렬 후 그리기
async function renderList() {
  try {
    const weeks = await loadJSON("data/weeks.json");
    weeks.sort((a, b) => b.id.localeCompare(a.id));
    listEl.innerHTML = weeks.length
      ? weeks.map(weekCard).join("")
      : `<p class="empty">아직 정리된 주가 없어요.</p>`;
  } catch (err) {
    showError(listEl, err);
  }
}

renderList();
