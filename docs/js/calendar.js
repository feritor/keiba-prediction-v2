// レースデータ: { 'YYYY-MM-DD': [{ name, url, grade }, ...] }
// 新しいレースを追加するときはここに追記する
const RACE_EVENTS = {
  '2026-03-15': [
    { name: 'スプリングS', url: 'race/spring-s-2026.html', grade: 'g2' },
    { name: '金鯱賞',     url: 'race/kinko-sho-2026.html', grade: 'g2' },
  ],
  '2026-03-21': [
    { name: 'フラワーC',  url: 'race/flower-cup-2026.html',    grade: 'g3' },
    { name: 'ファルコンS', url: 'race/falcon-s-2026.html', grade: 'g3' },
  ],
  '2026-03-22': [
    { name: '阪神大賞典', url: 'race/hanshin-daishoten-2026.html', grade: 'g2' },
    { name: '愛知杯',     url: 'race/aichi-cup-2026.html',     grade: 'g3' },
  ],
  '2026-03-28': [
    { name: '毎日杯', url: 'race/mainichi-hai-2026.html', grade: 'g3' },
    { name: '日経賞', url: 'race/nikkei-sho-2026.html', grade: 'g2' },
  ],
};

const GRADE_COLOR = { g1: '#e63946', g2: '#457b9d', g3: '#2d6a4f', default: '#999' };
const DOW_LABELS = ['日','月','火','水','木','金','土'];

let calYear, calMonth;

function initCal() {
  const today = new Date();
  calYear  = today.getFullYear();
  calMonth = today.getMonth(); // 0-indexed
  renderCal();
}

function renderCal() {
  const label = document.getElementById('cal-label');
  const grid  = document.getElementById('cal-grid');
  label.textContent = `${calYear}年${calMonth + 1}月`;

  // 曜日ヘッダー
  let html = DOW_LABELS.map((d, i) => {
    const cls = i === 0 ? 'sun' : i === 6 ? 'sat' : '';
    return `<div class="cal-dow ${cls}">${d}</div>`;
  }).join('');

  const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=日
  const lastDate = new Date(calYear, calMonth + 1, 0).getDate();
  const today    = new Date();

  // 空白セル
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  // 日付セル
  for (let d = 1; d <= lastDate; d++) {
    const key    = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dow    = new Date(calYear, calMonth, d).getDay();
    const isToday = (calYear === today.getFullYear() && calMonth === today.getMonth() && d === today.getDate());
    const events  = RACE_EVENTS[key] || [];

    let cls = 'cal-day';
    if (dow === 0) cls += ' sun';
    if (dow === 6) cls += ' sat';
    if (isToday)   cls += ' today';
    if (events.length) cls += ' has-race';

    // ドット
    const dots = events.map(e => {
      const color = GRADE_COLOR[e.grade] || GRADE_COLOR.default;
      return `<span class="cal-dot" style="background:${color};"></span>`;
    }).join('');

    // クリック: 1件はそのページへ、複数はアーカイブへスクロール
    const onclick = events.length === 1
      ? `onclick="location.href='${events[0].url}'"`
      : events.length > 1
        ? `onclick="scrollToArchive('${calYear}年','${calMonth + 1}月')"`
        : '';

    const title = events.map(e => e.name).join(' / ');

    html += `<div class="${cls}" ${onclick} ${title ? `title="${title}"` : ''}>${d}${dots}</div>`;
  }

  grid.innerHTML = html;
}

function scrollToArchive(year, month) {
  document.querySelectorAll('.archive-year summary').forEach(s => {
    if (s.textContent.trim().startsWith(year)) {
      s.closest('details').open = true;
      s.closest('details').querySelectorAll('.archive-month summary').forEach(ms => {
        if (ms.textContent.trim().startsWith(month)) {
          ms.closest('details').open = true;
          ms.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  });
}

document.getElementById('cal-prev').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCal();
});
document.getElementById('cal-next').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCal();
});

initCal();
