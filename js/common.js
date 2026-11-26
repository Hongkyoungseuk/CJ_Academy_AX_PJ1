// 메인·상세 페이지가 같이 쓰는 도우미 함수 모음

// JSON 파일 읽기 (실패하면 에러를 던져서 화면에 안내를 띄운다)
async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path} 를 불러오지 못했어요 (${res.status})`);
  return res.json();
}

// "2026-11-26T10:59" 같은 문자열을 Date로 바꾼다 (한국 시간 기준으로 적어 둔 값)
function toDate(iso) {
  return new Date(iso + (iso.length <= 10 ? "T23:59:59+09:00" : ":00+09:00"));
}

// 기한이 지났는지 확인 (기한이 없으면 안 지난 것으로 본다)
function isExpired(until) {
  if (!until) return false;
  return toDate(until) < new Date();
}

// "2026-11-26" → "11/26(목)" 처럼 짧게 표시
function shortDate(iso) {
  const d = toDate(iso.slice(0, 10));
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]})`;
}

// 기한 문자열을 "12/3(목) 10:59까지"처럼 표시 (시간이 있으면 시간도 붙인다)
function untilText(until) {
  if (!until) return "";
  const time = until.length > 10 ? " " + until.slice(11, 16) : "";
  return `${shortDate(until)}${time}까지`;
}

// 글자를 HTML에 넣을 때 태그로 해석되지 않도록 바꿔 준다
function esc(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 불러오기 실패 시 영역에 안내 문구를 띄운다
function showError(el, err) {
  el.innerHTML = `<p class="error">${esc(err.message)}</p>`;
}
