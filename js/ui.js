// ===== 화면 UI (시뮬레이션 전용) =====

const UI = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const G = () => Game.S;
  const view = { tab: 'home', season: 'cur', chart: 'auto', sprayF: 'all', pitchF: 'all', pitchMode: 'dot', life: 'love', asset: 'house' };
  let busy = false;

  // ---------- 아이콘 ----------
  const P = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const IC = {
    home: P('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
    swap: P('<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>'),
    plane: P('<path d="M2 16l20-7-20-7 4 7-4 7zM6 9h8"/>'),
    season: P('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    player: P('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    life: P('<path d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.5 3.6 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.5 4.3 6.8C19.5 16.4 12 21 12 21z"/>'),
    record: P('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>'),
    gear: P('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>'),
    train: P('<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>'),
    rest: P('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
    star: P('<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>'),
    coin: P('<circle cx="12" cy="12" r="9"/><path d="M8 9l2 6 2-5 2 5 2-6M7 12h10"/>'),
    fan: P('<path d="M3 11v2a2 2 0 0 0 2 2h1l5 4V5L6 9H5a2 2 0 0 0-2 2zM16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/>'),
    video: P('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>'),
    book: P('<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>'),
    heart: P('<path d="M12 21s-7.5-4.6-9.3-9.2C1.4 8.5 3.6 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.5 4.3 6.8C19.5 16.4 12 21 12 21z"/>'),
    house: P('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-6h6v6"/>'),
    car: P('<path d="M5 17H3v-5l2-5h14l2 5v5h-2M5 12h14"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/>'),
    flag: P('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    chev: P('<path d="m9 6 6 6-6 6"/>'),
    phone: P('<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'),
    gift: P('<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18M12 8v13M12 8S10 3 7.5 4 9 8 12 8zM12 8s2-5 4.5-4S15 8 12 8z"/>'),
    play: P('<path d="M6 4l14 8-14 8z"/>'),
  };
  IC.love = IC.heart;

  // ---------- 팀 컬러 ----------
  function lum(hex) { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; }
  function applyTeam() {
    try { const t = localStorage.getItem('baseballLife.theme'); if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; } catch (e) { /* */ }
    const S = G(); if (!S) return;
    const c = Game.myColors();
    let col = c.c1;
    if (lum(col) < 0.12 && lum(c.c2) > 0.12 && lum(c.c2) < 0.85) col = c.c2;
    if (lum(col) < 0.12) col = '#4a5568';
    const r = document.documentElement.style;
    r.setProperty('--team', col);
    r.setProperty('--team-ink', lum(col) > 0.62 ? '#191f28' : '#ffffff');
  }

  // ---------- 공통 ----------
  function bar(v, max = 100, cls = '') { return `<div class="bar ${cls}"><i style="width:${Math.max(0, Math.min(100, v / max * 100))}%"></i></div>`; }
  function gradeTag(v) { const g = Game.grade(v); return `<span class="gr gr-${g}">${g}</span>`; }
  function starStr(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
  function photo(id) { return `<img src="images/${id}.jpg" alt="" onerror="this.remove()">`; }
  function toast(t) { const e = $('#toast'); e.textContent = t; e.className = 'on'; clearTimeout(e._t); e._t = setTimeout(() => (e.className = ''), 1800); }

  // ---------- 시트 ----------
  const mq = []; let open = false;
  function sheet(o) { mq.push(o); if (!open) nextSheet(); }
  function nextSheet() {
    const o = mq.shift();
    const root = $('#modal-root');
    if (!o) { open = false; root.className = ''; root.innerHTML = ''; return; }
    open = true; root.className = 'on';
    root.innerHTML = `<div class="sheet" role="dialog">${o.title ? `<h2>${o.title}</h2>` : ''}<div class="s-body"></div><div class="s-btns ${o.row ? 'row' : ''}"></div></div>`;
    const body = $('.s-body', root);
    if (typeof o.body === 'string') body.innerHTML = o.body; else if (o.body) body.appendChild(o.body);
    const close = () => nextSheet();
    if (o.onRender) o.onRender(body, close);
    (o.buttons || [{ label: '확인' }]).forEach((b) => {
      const e = document.createElement('button');
      e.className = 'btn ' + (b.cls || '');
      e.innerHTML = b.label; if (b.disabled) e.disabled = true;
      e.onclick = () => { close(); if (b.onClick) b.onClick(); };
      $('.s-btns', root).appendChild(e);
    });
    root.onclick = (e) => { if (e.target === root && o.dismiss) close(); };
  }
  function clearSheets() { mq.length = 0; nextSheet(); }

  // ---------- 렌더 ----------
  function render() {
    const S = G();
    applyTeam();
    if (!S) return intro();
    if (S.phase === 'RETIRED') return ending();
    const s = $('#screen');
    s.className = 'screen';
    s.innerHTML = ({ home, season, player, life, record })[view.tab]() + tabbar();
    s.onclick = onClick;
  }
  function tabbar() {
    const t = [['home', '홈'], ['season', '시즌'], ['player', '선수'], ['life', '라이프'], ['record', '기록']];
    return `<div class="tabbar"><nav>${t.map(([k, n]) => `<button data-tab="${k}" class="${view.tab === k ? 'on' : ''}">${IC[k]}${n}</button>`).join('')}</nav></div>`;
  }
  function header(title) {
    return `<div class="hdr"><div><h1>${title}</h1><div class="date">${Game.dateStr()} · ${esc(Game.affiliation())}</div></div><button class="icon-btn" data-a="settings" aria-label="설정">${IC.gear}</button></div>`;
  }

  // ---------- 기간 표시 ----------
  function pcol(c) { return c === 'team' ? 'var(--team)' : c; }
  function periodCard() {
    const S = G();
    const P = Game.period();
    const tl = Game.timeline();
    const segs = tl.map((t) => `<i style="flex:${t.n};background:${pcol(t.color)}" title="${t.name}"></i>`).join('');
    const pos = (S.week + 0.5) / 48 * 100;
    const seen = {};
    const labels = tl.filter((t) => !seen[t.name] && (seen[t.name] = 1)).map((t) => `<span class="${t.name === P.name || (P.name.startsWith(t.name)) ? 'on' : ''}"><i style="background:${pcol(t.color)}"></i>${t.name}</span>`).join('');
    const cur = tl.find((t) => S.week >= t.from && S.week < t.from + t.n);
    const nxt = cur && tl[tl.indexOf(cur) + 1];
    const left = cur ? cur.from + cur.n - S.week : 0;
    const nextTxt = nxt ? `${nxt.name}까지 ${left}주` : '';
    return `<div class="card period">
      <div class="pd-top"><span class="pd-pill" style="background:${pcol(P.color)}">${P.name}</span><small>${nextTxt}</small></div>
      <p class="pd-desc">${P.desc}</p>
      <div class="pd-bar">${segs}<b style="left:${pos}%"></b></div>
      <div class="pd-lbl">${labels}</div>
    </div>`;
  }

  // ---------- 홈 ----------
  function seasonKpis(t) {
    const out = [['경기', Math.max(t.G, t.PG)]];
    if (Game.isBatter()) out.push(['타율', Game.fmtAvg(t.H, t.AB)], ['홈런', t.HR]);
    if (Game.isPitcher()) out.push(['평균자책', Game.fmtEra(t)], [t.SV > t.W ? '세이브' : '승', t.SV > t.W ? t.SV : t.W]);
    return Game.isBatter() && Game.isPitcher() ? [out[1], out[2], out[3]] : out;
  }
  function home() {
    const S = G();
    const o = Game.ovr();
    if (S.ovrMark == null || S.ovrMarkYear !== S.year) { S.ovrMark = o; S.ovrMarkYear = S.year; }
    const d = o - S.ovrMark;
    const roleTxt = Game.amateur() ? (S.pos === 'P' ? '투수' : S.pos === 'TW' ? `${Game.fpos().name} / 투수` : Game.fpos().name) : Game.roleLabel();
    const acts = Game.actions();
    if (S.phase !== 'HS') acts.push({ id: 'date', name: '데이트', icon: 'love', sub: S.partner ? '연인과 시간 보내기' : '호감도 올리기' });
    const iconOf = { train: 'train', rest: 'rest', star: 'star', coin: 'coin', heart: 'fan', chart: 'video', cal: 'book' };
    return `${header('야구 인생')}
      ${periodCard()}
      <div class="card">
        <div class="profile">
          <div class="avatar">${esc(S.name.slice(-2))}${photo('player')}</div>
          <div>
            <div class="who">${esc(S.name)} · #${S.num} · ${S.age}세</div>
            <div class="ovr"><span>종합 능력치</span>${o} ${gradeTag(o)}</div>
            <div class="delta ${d > 0 ? 'up' : d < 0 ? 'down' : ''}">${d ? `올해 ${d > 0 ? '+' : ''}${d} · ` : ''}${roleTxt}</div>
          </div>
        </div>
        <div class="kpis">${seasonKpis(S.st).map(([k, v]) => `<div class="kpi"><small>${k}</small><b>${v}</b></div>`).join('')}</div>
        <div class="gauges">
          <div class="gauge">피로${bar(S.fat, 100, S.fat > 70 ? 'bad' : S.fat > 45 ? 'warn' : 'good')}<em>${Math.round(S.fat)}</em></div>
          <div class="gauge">멘탈${bar(S.mental, 100, 'blue')}<em>${Math.round(S.mental)}</em></div>
          <div class="gauge">인기${bar(S.fame, 100, 'pink')}<em>${Math.round(S.fame)}</em></div>
          ${S.phase === 'KBO' || S.phase === 'MLB' ? `<div class="gauge">신뢰${bar(S.trust, 100, S.trust < 35 ? 'bad' : '')}<em>${Math.round(S.trust)}</em></div>` : ''}
        </div>
        <div class="kv" style="margin-top:8px"><span>보유 자산</span><b>${Game.won(S.money)}</b></div>
        ${S.injury ? `<div class="kv"><span>부상</span><b style="color:var(--bad)">${S.injury}주 결장</b></div>` : ''}
      </div>
      <div class="card">
        <div class="card-t"><h3>이번 주에 할 일</h3><small>고르면 한 주가 지나요</small></div>
        <div class="tiles">${acts.map((a) => `<button class="tile ${a.disabled ? 'off' : ''}" data-act="${a.id}">${IC[iconOf[a.icon] || a.icon] || IC.star}<b>${a.name}</b><small>${a.disabled || (a.id === 'train' && Game.period().train > 1 ? `효과 ${Game.period().train}배 (${Game.period().name})` : a.sub)}</small></button>`).join('')}</div>
      </div>
      <div class="card">
        <div class="card-t"><h3>확인할 일</h3></div>
        <div class="list">
          <div class="li"><div class="ic team">${IC.flag}</div><div class="tx"><b>${nextTitle()}</b><small>${nextEventText()}</small></div></div>
          <button class="li" data-a="auto4"><div class="ic">${IC.play}</div><div class="tx"><b>4주 자동 진행</b><small>피로하면 쉬고, 부족한 능력을 훈련해요</small></div><span class="chev">${IC.chev}</span></button>
          <button class="li" data-a="autoS"><div class="ic">${IC.play}</div><div class="tx"><b>다음 이벤트까지 자동 진행</b><small>드래프트, 계약, 시상식이 오면 멈춰요</small></div><span class="chev">${IC.chev}</span></button>
        </div>
      </div>
      <div class="card">
        <div class="card-t"><h3>최근 소식</h3></div>
        <div class="list">${S.log.slice(0, 6).map((l) => `<div class="li"><div class="tx"><b style="font-size:15px;font-weight:500">${esc(l.t)}</b><small>${l.d}</small></div></div>`).join('')}</div>
      </div>`;
  }
  function nextTitle() {
    const S = G();
    if (Game.amateur()) { const dy = (S.phase === 'HS' && S.grade === 3) || (S.phase === 'UNI' && (S.grade === 2 || S.grade === 4)); return dy && S.week < 34 ? '드래프트가 다가와요' : `${S.phase === 'UNI' ? '대학' : '고교'} 대회 일정`; }
    if (S.phase === 'INDY') return Game.inRegular() ? '독립리그 시즌 중' : '독립리그 비시즌';
    if (Game.inRegular()) return '정규시즌 진행 중';
    return Game.isOffseason() ? '비시즌' : '시즌 준비';
  }
  function nextEventText() {
    const S = G();
    const w = S.week;
    if (Game.amateur()) {
      const CAL = Game.amCal();
      const cal = CAL[w];
      if (S.hs.tourn && S.hs.tourn.alive && cal && cal.t === 'tourn') return `${S.hs.tourn.name} 진행 중 · 다음 ${Game.ROUNDS[S.hs.tourn.round] || ''}`;
      const ups = Object.entries(CAL).map(([k, v]) => [+k, v]).filter(([k, v]) => k >= w && v.start);
      const parts = [];
      if (ups.length) parts.push(`다음 대회 ${ups[0][1].name} (${Math.floor(ups[0][0] / 4) + 1}월 ${(ups[0][0] % 4) + 1}주)`);
      if (((S.phase === 'HS' && S.grade === 3) || (S.phase === 'UNI' && S.grade === 4)) && w < 34) parts.push('9월 3주 KBO 신인 드래프트');
      if (S.phase === 'UNI' && S.grade === 2 && w < 34) parts.push('8월 말 얼리 드래프트 신청 가능');
      if (!parts.length) parts.push(w >= 40 || w < 8 ? '동계 훈련 기간이라 훈련 효과가 15% 높아요' : (S.phase === 'UNI' ? 'U-리그 진행 중' : '주말리그 진행 중'));
      return parts.join(' · ');
    }
    const c = Game.seasonCfg();
    if (w < c.reg[0]) return (w >= c.camp[0] && w <= c.camp[1]) ? '스프링캠프 중이라 훈련 효과가 30% 높아요' : `시즌 개막까지 ${c.reg[0] - w}주`;
    if (w <= c.reg[1]) {
      const ws = (S.level === 'KBO1' || S.level === 'MLB') ? Game.weekSeries() : [];
      const vs = ws.length ? `<br>이번 주 ${ws.map((x, i) => `${i ? '금~일' : '화~목'} ${x.home ? 'vs' : '@'} ${esc(Game.teamInfo(x.opp).short || Game.teamInfo(x.opp).name)}`).join(' · ')}` : '';
      if (S.phase === 'KBO') { const st = Game.standings(); const r = st.findIndex((t) => t.id === S.team) + 1; const t = st[r - 1]; return `팀 ${r}위 (${t.w}승 ${t.l}패) · 정규시즌 ${c.reg[1] - w + 1}주 남음${vs}`; }
      return `${Game.LEVEL_LABEL[S.level]} · 팀 ${S.teamRec.w}승 ${S.teamRec.l}패${vs}`;
    }
    if (w <= c.post[1]) return S.post && S.post.alive ? '포스트시즌 진행 중' : '포스트시즌 (팀 탈락)';
    return '휴식과 훈련으로 다음 시즌을 준비해요';
  }

  // ---------- 시즌 ----------
  function season() {
    const S = G();
    const ch = view.season === 'prev' && S.chartPrev ? S.chartPrev : S.chart;
    const both = Game.isBatter() && Game.isPitcher();
    let kind = view.chart;
    if (kind === 'auto' || (kind === 'spray' && !Game.isBatter()) || (kind === 'pitch' && !Game.isPitcher())) kind = Game.isBatter() ? 'spray' : 'pitch';
    const t = S.st;
    const sl = (arr) => `<div class="statline">${arr.map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>`;
    let statCard = '';
    if (Game.isBatter()) statCard += sl([['타율', Game.fmtAvg(t.H, t.AB)], ['홈런', t.HR], ['타점', t.RBI], ['OPS', Game.fmtOps(t)], ['경기', t.G], ['안타', t.H], ['볼넷', t.BB], ['도루', t.SB]]);
    if (Game.isPitcher()) statCard += (statCard ? '<div style="height:14px"></div>' : '') + sl([['평균자책', Game.fmtEra(t)], ['승-패', `${t.W}-${t.L}`], ['이닝', Game.fmtIp(t.OUTS)], ['탈삼진', t.PSO], ['경기', t.PG], ['세이브', t.SV], ['홀드', t.HLD], ['WHIP', t.OUTS ? ((t.PH + t.PBB) * 3 / t.OUTS).toFixed(2) : '-']]);
    return `${header('시즌')}
      <div class="card"><div class="card-t"><h3>${S.year} 시즌 기록</h3><small>${Game.chartLabel(S.chart).replace(/^\d+ /, '') || (Game.amateur() ? '공식전' : Game.LEVEL_LABEL[S.level])}</small></div>${statCard}</div>
      <div class="card">
        <div class="card-t"><h3>${kind === 'spray' ? '타구 분포도' : '투구 분포도'}</h3><small>${esc(Game.chartLabel(ch))}</small></div>
        ${S.chartPrev ? `<div class="seg" style="margin-bottom:10px"><button data-season="cur" class="${view.season !== 'prev' ? 'on' : ''}">이번 시즌</button><button data-season="prev" class="${view.season === 'prev' ? 'on' : ''}">지난 시즌</button></div>` : ''}
        ${both ? `<div class="seg" style="margin-bottom:10px"><button data-chart="spray" class="${kind === 'spray' ? 'on' : ''}">타구</button><button data-chart="pitch" class="${kind === 'pitch' ? 'on' : ''}">투구</button></div>` : ''}
        ${kind === 'spray' ? sprayChart(ch.spray) : pitchChart(ch.pitches)}
      </div>
      ${leagueCard()}`;
  }

  function sprayChart(data) {
    const F = view.sprayF;
    const pts = data.filter((p) => F === 'all' || (F === 'hit' ? p[2] > 0 : F === 'xbh' ? p[2] >= 2 : p[2] === 0));
    const W = 320, H = 280, hx = 160, hy = 270, k = 1.75;
    const xy = (a, d) => [hx + d * Math.sin(a * Math.PI / 180) * k, hy - d * Math.cos(a * Math.PI / 180) * k];
    const arc = []; for (let a = -45; a <= 45; a += 3) arc.push(xy(a, Game.fenceDist(a)));
    const fieldPath = `M${hx},${hy} ` + arc.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z';
    const inf = []; for (let a = -45; a <= 45; a += 5) inf.push(xy(a, 29));
    const infPath = `M${hx},${hy} ` + inf.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z';
    const b1 = xy(45, 27.4), b2 = xy(0, 38.8), b3 = xy(-45, 27.4), md = xy(0, 18.4);
    const col = ['var(--faint)', '#3182f6', '#f08c00', '#f08c00', '#e5484d'];
    const dots = pts.slice().sort((a, b) => a[2] - b[2]).map((p) => { const [x, y] = xy(p[0], p[1]); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${p[2] === 4 ? 4.2 : 3.4}" fill="${col[p[2]]}" fill-opacity="${p[2] ? 0.9 : 0.55}"/>`; }).join('');
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="타구 분포도">
      <path d="${fieldPath}" fill="var(--field)" stroke="var(--line)" stroke-width="2"/>
      <path d="${infPath}" fill="var(--dirt)"/>
      <path d="M${hx},${hy} L${b1[0].toFixed(1)},${b1[1].toFixed(1)} L${b2[0].toFixed(1)},${b2[1].toFixed(1)} L${b3[0].toFixed(1)},${b3[1].toFixed(1)} Z" fill="var(--field)" stroke="var(--card)" stroke-width="1.5"/>
      <circle cx="${md[0].toFixed(1)}" cy="${md[1].toFixed(1)}" r="5" fill="var(--dirt)"/>
      <line x1="${hx}" y1="${hy}" x2="${arc[0][0].toFixed(1)}" y2="${arc[0][1].toFixed(1)}" stroke="var(--card)" stroke-width="1.5"/>
      <line x1="${hx}" y1="${hy}" x2="${arc[arc.length - 1][0].toFixed(1)}" y2="${arc[arc.length - 1][1].toFixed(1)}" stroke="var(--card)" stroke-width="1.5"/>
      ${dots}
    </svg>`;
    const n = data.length || 1;
    const side = (f) => Math.round(data.filter(f).length / n * 100);
    const q = (v) => Math.round(data.filter((p) => p[3] === v).length / n * 100);
    const hr = data.filter((p) => p[2] === 4);
    const chips = [['all', '전체'], ['hit', '안타'], ['xbh', '장타'], ['out', '아웃']];
    return `<div class="chips" style="margin-bottom:10px">${chips.map(([k2, v]) => `<button class="chip ${F === k2 ? 'on' : ''}" data-sprayf="${k2}">${v}</button>`).join('')}</div>
      ${data.length ? `<div class="chart-box">${svg}</div>
      <div class="legend"><span><i style="background:#e5484d"></i>홈런</span><span><i style="background:#f08c00"></i>2·3루타</span><span><i style="background:#3182f6"></i>단타</span><span><i style="background:var(--faint)"></i>아웃</span></div>
      <div class="summary"><div><small>좌측</small><b>${side((p) => p[0] < -15)}%</b></div><div><small>중앙</small><b>${side((p) => Math.abs(p[0]) <= 15)}%</b></div><div><small>우측</small><b>${side((p) => p[0] > 15)}%</b></div>
      <div><small>땅볼</small><b>${q(0)}%</b></div><div><small>라인드라이브</small><b>${q(1)}%</b></div><div><small>뜬공</small><b>${q(2) + q(3)}%</b></div></div>
      <p class="hint">인플레이 타구 ${data.length}개${hr.length ? ` · 홈런 평균 비거리 ${Math.round(hr.reduce((a, p) => a + p[1], 0) / hr.length)}m` : ''}</p>`
      : '<div class="empty">아직 기록된 타구가 없어요.<br>경기를 치르면 여기에 쌓여요.</div>'}`;
  }

  const PCOL = { FF: '#e5484d', SI: '#f08c00', FC: '#9c6644', SL: '#e6b800', SW: '#12b886', CU: '#3182f6', CH: '#12a150', FS: '#7048e8' };
  function pitchChart(data) {
    const F = view.pitchF, mode = view.pitchMode;
    const keys = Game.PKEYS;
    const pts = data.filter((p) => F === 'all' || keys[p[2]] === F);
    const W = 300, H = 330, cx = 150, cy = 150, ux = 56, uy = 70;
    const X = (u) => cx + u / 100 * ux, Y = (v) => cy + v / 100 * uy;
    let inner = '';
    if (mode === 'heat') {
      const n = 5, step = 3.4 / n, cnt = Array(n * n).fill(0);
      pts.forEach((p) => { const i = Math.floor((p[0] / 100 + 1.7) / step), j = Math.floor((p[1] / 100 + 1.7) / step); if (i >= 0 && i < n && j >= 0 && j < n) cnt[j * n + i]++; });
      const mx = Math.max(1, ...cnt), tot = Math.max(1, pts.length);
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
        const c = cnt[j * n + i];
        const x0 = cx + (-1.7 + i * step) * ux, y0 = cy + (-1.7 + j * step) * uy;
        inner += `<rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${(step * ux).toFixed(1)}" height="${(step * uy).toFixed(1)}" fill="var(--team)" fill-opacity="${(0.05 + 0.85 * c / mx).toFixed(2)}"/>`;
        inner += `<text x="${(x0 + step * ux / 2).toFixed(1)}" y="${(y0 + step * uy / 2 + 4).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="${c / mx > 0.55 ? 'var(--team-ink)' : 'var(--text)'}">${Math.round(c / tot * 100)}%</text>`;
      }
    } else {
      inner = pts.map((p) => `<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3" fill="${PCOL[keys[p[2]]]}" fill-opacity="0.5"/>`).join('');
    }
    const zone = `<rect x="${cx - ux}" y="${cy - uy}" width="${ux * 2}" height="${uy * 2}" fill="none" stroke="var(--text)" stroke-width="2"/>
      ${[1, 2].map((i) => `<line x1="${(cx - ux + ux * 2 * i / 3).toFixed(1)}" y1="${cy - uy}" x2="${(cx - ux + ux * 2 * i / 3).toFixed(1)}" y2="${cy + uy}" stroke="var(--text)" stroke-opacity="0.25"/><line x1="${cx - ux}" y1="${(cy - uy + uy * 2 * i / 3).toFixed(1)}" x2="${cx + ux}" y2="${(cy - uy + uy * 2 * i / 3).toFixed(1)}" stroke="var(--text)" stroke-opacity="0.25"/>`).join('')}`;
    const plate = `<path d="M${cx - 40},${H - 34} L${cx + 40},${H - 34} L${cx + 40},${H - 26} L${cx},${H - 12} L${cx - 40},${H - 26} Z" fill="var(--card2)" stroke="var(--faint)"/>`;
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="투구 분포도"><rect x="0" y="0" width="${W}" height="${H - 40}" rx="12" fill="var(--card2)"/>${inner}${zone}${plate}</svg>`;
    const tot = Math.max(1, data.length);
    const used = keys.map((k, i) => [k, data.filter((p) => p[2] === i).length]).filter(([, c]) => c > 0);
    const n = Math.max(1, pts.length);
    const inZ = Math.round(pts.filter((p) => Math.abs(p[0]) <= 100 && Math.abs(p[1]) <= 100).length / n * 100);
    const str = Math.round(pts.filter((p) => p[3] >= 1 && p[3] <= 3).length / n * 100);
    const kp = {}; data.filter((p) => p[3] === 3).forEach((p) => (kp[p[2]] = (kp[p[2]] || 0) + 1));
    const best = Object.entries(kp).sort((a, b) => b[1] - a[1])[0];
    return `<div class="seg" style="margin-bottom:10px"><button data-pmode="dot" class="${mode === 'dot' ? 'on' : ''}">점</button><button data-pmode="heat" class="${mode === 'heat' ? 'on' : ''}">히트맵</button></div>
      <div class="chips" style="margin-bottom:10px"><button class="chip ${F === 'all' ? 'on' : ''}" data-pitchf="all">전체</button>${used.map(([k, c]) => `<button class="chip ${F === k ? 'on' : ''}" data-pitchf="${k}"><i style="background:${PCOL[k]}"></i>${PITCHES[k].name} ${Math.round(c / tot * 100)}%</button>`).join('')}</div>
      ${data.length ? `<div class="chart-box">${svg}</div>
      <div class="summary"><div><small>존 안 비율</small><b>${inZ}%</b></div><div><small>스트라이크</small><b>${str}%</b></div><div><small>삼진 결정구</small><b style="font-size:15px">${best ? PITCHES[keys[best[0]]].name : '-'}</b></div></div>
      <p class="hint">포수 시점 · ${F === 'all' ? '전체' : PITCHES[F].name} ${pts.length.toLocaleString()}구</p>`
      : '<div class="empty">아직 던진 공이 없어요.<br>마운드에 오르면 여기에 쌓여요.</div>'}`;
  }

  function leagueCard() {
    const S = G();
    if (S.phase === 'INDY') {
      return `<div class="card"><div class="card-t"><h3>${Game.teamInfo(S.team).name}</h3><small>${S.teamRec.w}승 ${S.teamRec.l}패</small></div>
        <p class="hint" style="margin-top:0">독립리그에는 연봉이 없어요. 시즌 중 성적이 좋거나 비시즌에 실력이 충분하면 KBO 구단이 신고선수 계약을 제안해요.</p></div>`;
    }
    if (Game.amateur()) {
      const ev = Object.entries(Game.amCal()).filter(([, v]) => v.start).map(([k, v]) => {
        const k2 = +k;
        let status = k2 < S.week ? '종료' : '예정';
        if (S.hs.tourn && S.hs.tourn.name === v.name) status = S.hs.tourn.alive ? '진행 중' : (S.trophies.includes(`${S.year} ${v.name} 우승`) ? '우승' : `${Game.ROUNDS[Math.min(S.hs.tourn.round, 5)]} 탈락`);
        return `<div class="kv"><span>${Math.floor(k2 / 4) + 1}월 ${(k2 % 4) + 1}주 ${v.name}</span><b>${status}</b></div>`;
      }).join('');
      return `<div class="card"><div class="card-t"><h3>${S.phase === 'UNI' ? '대학 대회' : '고교 대회'}</h3><small>${S.year}</small></div>${ev}</div>
        <div class="card"><div class="card-t"><h3>스카우트 관심도</h3></div>
          <div class="gauge">KBO${bar(S.hs.scoutK, 100)}<em>${Math.round(S.hs.scoutK)}</em></div>
          <div class="gauge" style="margin-top:8px">MLB${bar(S.hs.scoutM, 100, 'blue')}<em>${Math.round(S.hs.scoutM)}</em></div>
          <p class="hint">${S.phase === 'UNI' ? '2학년(얼리)과 4학년 때 드래프트에 나갈 수 있어요.' : '3학년 8월 말에 진로를 정하고 9월 3주에 KBO 신인 드래프트가 열려요.'} 구속 145km 이상이거나 종합 능력치가 높으면 메이저리그 스카우트가 찾아와요.</p></div>`;
    }
    if (S.phase === 'KBO') {
      const st = Game.standings();
      return `<div class="card"><div class="card-t"><h3>KBO 순위</h3><small>${S.year}</small></div><div class="tbl-wrap"><table><tr><th>순위</th><th>팀</th><th>승</th><th>패</th><th>승률</th></tr>
        ${st.map((t, i) => `<tr class="${t.id === S.team ? 'me' : ''}"><td>${i + 1}</td><td style="text-align:left"><span class="tdot" style="background:${t.c1}"></span>${t.name}</td><td>${t.w}</td><td>${t.l}</td><td>${(t.w / Math.max(1, t.w + t.l)).toFixed(3).replace(/^0/, '')}</td></tr>`).join('')}</table></div></div>`;
    }
    const ladder = ['RK', 'A', 'A+', 'AA', 'AAA', 'MLB'];
    return `<div class="card"><div class="card-t"><h3>${Game.teamInfo(S.team).name}</h3><small>${S.teamRec.w}승 ${S.teamRec.l}패</small></div>
      <div class="chips">${ladder.map((l) => `<span class="chip ${l === S.level ? 'on' : ''}">${Game.LEVEL_LABEL[l]}</span>`).join('')}</div>
      <p class="hint">종합 능력치와 최근 성적이 좋으면 한 단계씩 올라가요.</p></div>`;
  }

  // ---------- 선수 ----------
  function player() {
    const S = G();
    const pot = Math.max(1, Math.min(5, Math.round((S.pot - 50) / 9)));
    let h = `${header('선수')}
      <div class="card"><div class="profile"><div class="avatar">${esc(S.name.slice(-2))}${photo('player')}</div><div>
        <div class="who">${Game.POS_LABEL[S.pos]}${Game.isBatter() ? ` (${Game.fpos().name})` : ''} · ${S.throws === 'L' ? '좌투' : '우투'}${S.bats === 'L' ? '좌타' : S.bats === 'S' ? '양타' : '우타'} · #${S.num}</div>
        <div class="ovr">${esc(S.name)}</div><div class="small muted">잠재력 <span class="stars">${starStr(pot)}</span></div></div></div></div>`;
    if (Game.isBatter()) {
      const b = S.bat;
      const canMove = Game.amateur() || Game.isOffseason();
      h += `<div class="card"><div class="kv"><span>수비 포지션</span><b>${Game.fpos().name}</b></div><button class="btn full sub" data-a="fpos" ${canMove ? '' : 'disabled'}>${canMove ? '포지션 바꾸기' : '포지션은 비시즌에 바꿀 수 있어요'}</button></div>`;
      h += `<div class="card"><div class="card-t"><h3>타격</h3><small>종합 ${Game.batOVR()}</small></div>
        ${[['con', '컨택'], ['pow', '파워'], ['eye', '선구안'], ['spd', '주력'], ['def', '수비'], ['arm', '송구']].map(([k, n]) => `<div class="ab"><span>${n}</span>${bar(b[k])}<em>${Math.round(b[k])}</em>${gradeTag(b[k])}</div>`).join('')}</div>`;
    }
    if (Game.isPitcher()) {
      const p = S.pit;
      h += `<div class="card"><div class="card-t"><h3>투구</h3><small>종합 ${Game.pitOVR()}</small></div>
        <div class="ab"><span>구속</span>${bar(p.vel - 115, 50)}<em>${p.vel.toFixed(0)}</em><span class="small muted">km</span></div>
        ${[['ctl', '제구'], ['stf', '구위'], ['sta', '체력']].map(([k, n]) => `<div class="ab"><span>${n}</span>${bar(p[k])}<em>${Math.round(p[k])}</em>${gradeTag(p[k])}</div>`).join('')}
        <div style="margin-top:10px">${Object.entries(p.pitches).map(([k, v]) => `<div class="kv"><span><span class="tdot" style="background:${PCOL[k]}"></span>${PITCHES[k].full}</span><span class="pips">${Array.from({ length: 7 }, (_, i) => `<i class="${i < v ? 'on' : ''}"></i>`).join('')}</span></div>`).join('')}</div></div>`;
    }
    const c = S.contract;
    h += `<div class="card"><div class="card-t"><h3>계약</h3></div>
      <div class="kv"><span>소속</span><b>${esc(Game.affiliation())}</b></div>
      <div class="kv"><span>역할</span><b>${Game.amateur() ? (S.phase === 'UNI' ? '대학 선수' : '고교 선수') : Game.roleLabel()}</b></div>
      ${c ? `<div class="kv"><span>연봉</span><b>${c.kind === 'milb' && !c.arb ? (S.level === 'MLB' ? Game.usd(780000) + ' (최저)' : '마이너 계약') : Game.won(c.salary)}${c.years ? ` · ${c.years}년 남음` : ''}</b></div>` : ''}
      ${S.phase === 'KBO' ? `<div class="kv"><span>FA까지</span><b>1군 ${S.service} / 7시즌</b></div>` : ''}
      ${S.phase === 'MLB' ? `<div class="kv"><span>FA까지</span><b>서비스 타임 ${S.mlbService} / 6년</b></div>` : ''}
      ${c && Game.clauseText(Object.assign({ lg: c.lg }, c, { optAmt: c.optAmt ? (c.lg === 'MLB' ? c.optAmt / USD : c.optAmt) : 0 })) ? `<div class="kv"><span>특약</span><b>${esc(Game.clauseText(Object.assign({ lg: c.lg }, c, { optAmt: c.optAmt ? (c.lg === 'MLB' ? c.optAmt / USD : c.optAmt) : 0 })))}</b></div>` : ''}</div>`;
    if (S.phase === 'KBO' || S.phase === 'MLB') {
      const rq = Game.requestState();
      h += `<div class="card"><div class="card-t"><h3>구단에 요청</h3><small>감독 신뢰 ${Math.round(S.trust)}</small></div>
        <div class="list">
          <button class="li" data-rq="trade" ${rq.trade ? 'disabled' : ''}><div class="ic">${IC.swap}</div><div class="tx"><b>트레이드 요청</b><small>${rq.trade || '다른 팀에서 새 출발 · 감독 신뢰 크게 하락'}</small></div></button>
          ${rq.postShow ? `<button class="li" data-rq="post" ${rq.post ? 'disabled' : ''}><div class="ic">${IC.plane}</div><div class="tx"><b>메이저리그 포스팅 요청</b><small>${rq.post || '구단 허락을 받으면 시즌 후 MLB 구단과 협상'}</small></div></button>` : ''}
        </div></div>`;
    }
    return h;
  }

  // ---------- 라이프 ----------
  function life() {
    const S = G();
    let h = `${header('라이프')}<div class="seg"><button data-life="love" class="${view.life === 'love' ? 'on' : ''}">연애</button><button data-life="asset" class="${view.life === 'asset' ? 'on' : ''}">집 · 차</button></div>`;
    if (view.life === 'love') {
      if (S.phase === 'HS') return h + `<div class="card"><div class="empty">지금은 야구에 집중할 때예요.<br>프로에 입단해 성인이 되면 새로운 만남이 시작돼요.</div></div>`;
      const secN = Object.keys(S.secret || {}).filter((k) => S.secret[k]).length;
      const mainId = Game.mainLove();
      h += `${mainId ? `<div class="card"><div class="kv"><span>${S.spouse ? '배우자' : '연인'}</span><b>${HEROINES.find((x) => x.id === mainId).name}</b></div>${secN || S.sus > 0 ? `<div class="gauge sus">의심${bar(S.sus, 100, 'bad')}<em>${Math.round(S.sus)}</em></div><p class="hint" style="margin:6px 0 0">${secN ? `비밀 연인 ${secN}명 · 의심도가 높을수록 들킬 확률이 올라가요. 매주 조금씩 줄어요.` : '의심이 조금씩 가라앉는 중이에요.'}</p>` : ''}</div>` : ''}
        <div class="heroes">${HEROINES.map((x) => {
          const r = S.rel[x.id];
          if (!r) {
            const hint = x.mlbOnly ? '메이저리그에서 만나요' : x.kboOnly ? 'KBO 구단에서 만나요' : x.injury ? '다쳤을 때 만나요' : x.fame ? '인기가 오르면 만나요' : '곧 만나요';
            return `<div class="hero locked"><div class="ph">?</div><div class="meta"><b>???</b><small>${hint}</small></div></div>`;
          }
          const st = Game.relStage(r.aff, x.id);
          return `<button class="hero" data-hero="${x.id}"><div class="ph">${x.name.slice(-2)}${photo(x.id)}<span class="tag ${st === 7 ? 'secret' : st >= 4 ? 'bad' : 'team'} st">${Game.STAGE_NAME[st]}</span></div><div class="meta"><b>${x.name}</b><small>${x.age}세 · ${x.job}</small>${bar(r.aff, 100, 'pink')}</div></button>`;
        }).join('')}</div>
        <p class="hint">연락은 사람마다 주 1회 무료예요. 데이트는 그 주의 행동을 써요.</p>`;
      return h;
    }
    if (S.phase === 'HS') return h + `<div class="card"><div class="empty">아직 학생이라 모아둔 돈이 없어요.<br>계약금과 연봉으로 집과 차를 살 수 있어요.</div></div>`;
    const tab = view.asset;
    const items = tab === 'house' ? HOUSES : CARS;
    h += `<div class="card"><div class="kv"><span>보유 자산</span><b>${Game.won(S.money)}</b></div>${S.phase === 'MLB' ? `<div class="kv"><span>달러 환산</span><b>${Game.usd(S.money / USD)}</b></div>` : ''}</div>
      <div class="card"><div class="seg" style="margin-bottom:6px"><button data-asset="house" class="${tab === 'house' ? 'on' : ''}">집</button><button data-asset="car" class="${tab === 'car' ? 'on' : ''}">자동차</button></div>
      ${items.map((it) => {
        const own = tab === 'house' ? S.houses.includes(it.id) : S.cars.includes(it.id);
        const cur = tab === 'house' ? S.house === it.id : S.car === it.id;
        const eff = tab === 'house' ? `회복 +${it.cond} · 멘탈 +${it.mental}` : `인기 +${it.fame} · 데이트 +${it.date}`;
        let act;
        if (cur) act = `<span class="tag team">${tab === 'house' ? '거주 중' : '타는 중'}</span>${it.id !== 'home' ? `<button class="mini sub" data-sell="${it.id}">팔기</button>` : ''}`;
        else if (own) act = `<button class="mini" data-buy="${it.id}">${tab === 'house' ? '이사' : '타기'}</button>${it.id !== 'home' ? `<button class="mini sub" data-sell="${it.id}">팔기</button>` : ''}`;
        else act = `<button class="mini" data-buy="${it.id}" ${S.money < it.price || (it.mlbOnly && S.phase !== 'MLB') ? 'disabled' : ''}>구매</button>`;
        return `<div class="shop-row"><div class="ic">${tab === 'house' ? IC.house : IC.car}</div><div class="tx"><b>${it.name}</b><small>${it.desc}</small><small>${eff}</small><span class="price">${it.price ? Game.won(it.price) : '무료'}</span></div><div class="act">${act}</div></div>`;
      }).join('')}</div>
      <p class="hint">매달 생활비와 유지비가 나가요. 집은 90%, 차는 60% 가격에 팔 수 있어요.</p>`;
    return h;
  }

  // ---------- 기록 ----------
  function record() {
    const S = G();
    const rows = S.career.slice().reverse();
    const tot = Game.careerTotals();
    let table = '';
    if (rows.length) {
      if (Game.isBatter()) table += `<div class="tbl-wrap"><table><tr><th>시즌</th><th>G</th><th>타율</th><th>HR</th><th>타점</th><th>OPS</th><th>WAR</th></tr>${rows.map((c) => `<tr><td>${c.year} ${esc(c.team.split(' ')[0])}<small>${c.level}</small></td><td>${c.st.G}</td><td>${Game.fmtAvg(c.st.H, c.st.AB)}</td><td>${c.st.HR}</td><td>${c.st.RBI}</td><td>${Game.fmtOps(c.st)}</td><td>${c.war ?? '-'}</td></tr>`).join('')}</table></div>`;
      if (Game.isPitcher()) table += `<div class="tbl-wrap" style="margin-top:10px"><table><tr><th>시즌</th><th>G</th><th>승</th><th>패</th><th>세</th><th>이닝</th><th>ERA</th><th>K</th></tr>${rows.map((c) => `<tr><td>${c.year} ${esc(c.team.split(' ')[0])}<small>${c.level}</small></td><td>${c.st.PG}</td><td>${c.st.W}</td><td>${c.st.L}</td><td>${c.st.SV}</td><td>${Game.fmtIp(c.st.OUTS)}</td><td>${Game.fmtEra(c.st)}</td><td>${c.st.PSO}</td></tr>`).join('')}</table></div>`;
    }
    const c = S.phase === 'KBO' || S.phase === 'MLB' ? Game.seasonCfg() : null;
    const wk = (w) => `${Math.floor(w / 4) + 1}월 ${(w % 4) + 1}주`;
    return `${header('기록')}
      ${tot.seasons ? `<div class="card"><div class="card-t"><h3>프로 통산</h3><small>${tot.seasons}시즌</small></div><p class="pre" style="margin:0">${Game.seasonSummary(tot)}</p><div class="kv" style="margin-top:6px"><span>통산 WAR</span><b>${tot.war}</b></div></div>` : ''}
      <div class="card"><div class="card-t"><h3>시즌별 기록</h3></div>${table || '<div class="empty">시즌이 끝나면 기록이 쌓여요.</div>'}</div>
      <div class="card"><div class="card-t"><h3>우승 · 수상</h3><small>${S.trophies.length + S.awards.length}개</small></div>
        ${S.trophies.length || S.awards.length ? `<div class="list">${S.trophies.map((t) => `<div class="li"><div class="ic team">${IC.record}</div><div class="tx"><b>${esc(t)}</b></div></div>`).join('')}${S.awards.map((t) => `<div class="li"><div class="ic">${IC.star}</div><div class="tx"><b>${esc(t)}</b></div></div>`).join('')}</div>` : '<div class="empty">아직 없어요.</div>'}</div>
      ${periodCard()}
      ${c ? `<div class="card"><div class="card-t"><h3>${S.year} 일정</h3></div>
        <div class="kv"><span>스프링캠프</span><b>${wk(c.camp[0])}부터</b></div><div class="kv"><span>정규시즌</span><b>${wk(c.reg[0])} ~ ${wk(c.reg[1])}</b></div>
        <div class="kv"><span>올스타전</span><b>${wk(c.allstar)}</b></div><div class="kv"><span>포스트시즌</span><b>${wk(c.post[0])}부터</b></div>
        <div class="kv"><span>시상식</span><b>${wk(c.awards)}</b></div><div class="kv"><span>FA 시장</span><b>${wk(c.fa)}</b></div></div>` : ''}`;
  }

  // ---------- 클릭 ----------
  function onClick(e) {
    const t = (sel) => e.target.closest(sel);
    let b;
    if ((b = t('[data-tab]'))) { view.tab = b.dataset.tab; render(); window.scrollTo(0, 0); return; }
    if ((b = t('[data-rq]'))) { if (!b.disabled) requestSheet(b.dataset.rq); return; }
    if ((b = t('[data-a]'))) { const a = b.dataset.a; if (a === 'settings') return settings(); if (a === 'fpos') return fposSheet(); if (a === 'auto4') return startAuto(4); if (a === 'autoS') return startAuto(60); }
    if ((b = t('[data-act]'))) return onAction(b.dataset.act, b.classList.contains('off'));
    if ((b = t('[data-season]'))) { view.season = b.dataset.season; return render(); }
    if ((b = t('[data-chart]'))) { view.chart = b.dataset.chart; return render(); }
    if ((b = t('[data-sprayf]'))) { view.sprayF = b.dataset.sprayf; return render(); }
    if ((b = t('[data-pitchf]'))) { view.pitchF = b.dataset.pitchf; return render(); }
    if ((b = t('[data-pmode]'))) { view.pitchMode = b.dataset.pmode; return render(); }
    if ((b = t('[data-life]'))) { view.life = b.dataset.life; return render(); }
    if ((b = t('[data-asset]'))) { view.asset = b.dataset.asset; return render(); }
    if ((b = t('[data-hero]'))) return heroDetail(b.dataset.hero);
    if ((b = t('[data-buy]')) && !b.disabled) return buy(b.dataset.buy);
    if ((b = t('[data-sell]'))) return sell(b.dataset.sell);
  }

  // ---------- 주간 진행 ----------
  function onAction(id, off) {
    if (busy) return;
    if (off) { toast(Game.actions().find((a) => a.id === id).disabled); return; }
    if (id === 'train' || id === 'lesson') return trainPicker(id);
    if (id === 'date') { view.tab = 'life'; view.life = 'love'; render(); toast('데이트할 사람을 골라주세요'); return; }
    runWeek(id);
  }
  function trainPicker(act) {
    const S = G();
    const list = Game.trainingList();
    const val = (x) => {
      if (x.attr === 'vel') return `${S.pit.vel.toFixed(1)}km`;
      if (x.attr === 'pitch') return `${Object.keys(S.pit.pitches).length}구종`;
      const v = (['ctl', 'stf', 'sta'].includes(x.attr) ? S.pit : S.bat)[x.attr];
      return `${Math.round(v)}`;
    };
    sheet({
      title: act === 'lesson' ? `개인 레슨 (${Game.won(Game.lessonCost())})` : '어떤 훈련을 할까요?', dismiss: true,
      body: `<div class="list">${list.map((x) => `<button class="li" data-tr="${x.id}"><div class="tx"><b>${x.name}</b><small>${x.desc}</small></div><span class="val">${val(x)}</span></button>`).join('')}</div>
        <p class="hint">${S.fat > 70 ? '피로가 높아 효과가 떨어지고 부상 위험이 있어요.' : S.fat > 50 ? '피로가 쌓여 효과가 조금 줄어요.' : '컨디션이 좋아요.'}</p>`,
      buttons: [{ label: '취소', cls: 'sub' }],
      onRender: (b, close) => { b.onclick = (e) => { const x = e.target.closest('[data-tr]'); if (!x) return; const tr = list.find((q) => q.id === x.dataset.tr); close(); if (tr.id === 'pitch') pitchPicker(act, tr); else runWeek(act, tr); }; },
    });
  }
  function pitchPicker(act, tr) {
    const S = G();
    const all = ['FF', ...Game.PITCH_ORDER];
    sheet({
      title: '어떤 구종을 연마할까요?', dismiss: true,
      body: `<div class="list">${all.map((k) => { const lv = S.pit.pitches[k]; return `<button class="li" data-k="${k}" ${lv >= 7 ? 'disabled' : ''}><div class="tx"><b><span class="tdot" style="background:${PCOL[k]}"></span>${PITCHES[k].full}</b><small>${lv ? '레벨 올리기' : '새 구종 도전 (실패할 수도 있어요)'}</small></div><span class="val">${lv ? `Lv ${lv}` : '-'}</span></button>`; }).join('')}</div>`,
      buttons: [{ label: '취소', cls: 'sub' }],
      onRender: (b, close) => { b.onclick = (e) => { const x = e.target.closest('[data-k]'); if (!x || x.disabled) return; close(); runWeek(act, Object.assign({}, tr, { pitch: x.dataset.k, name: `${PITCHES[x.dataset.k].name} 연마` })); }; },
    });
  }
  function runWeek(act, sub) {
    Game.planWeek(act, sub);
    report(Game.finishWeek());
  }
  function report(rep, auto) {
    const w = rep.week;
    const parts = [];
    if (auto) parts.push(`<p class="muted small">${auto}</p>`);
    if (rep.gains && rep.gains.length) parts.push(`<div class="chips" style="margin:8px 0">${rep.gains.map((g) => `<span class="chip">${esc(g)}</span>`).join('')}</div>`);
    if (rep.dateLine && rep.dateHid) {
      const h = HEROINES.find((x) => x.id === rep.dateHid);
      if (rep.dateNarr) parts.push(`<div class="night"><div class="night-ph">${photo(h.id)}</div><p>${esc(rep.dateLine)}</p></div>`);
      else parts.push(`<div class="bubble"><div class="who">${h.name}</div>${esc(rep.dateLine)}</div>`);
    }
    const anim = rep.anim;
    const showS = !auto && anim && anim.spray.length > 0;
    const showP = !auto && anim && anim.pitches.length > 0;
    const replay = (showS || showP) && rep.games.length;
    if (replay) parts.push(`<div class="replay"><div class="rp-cap" id="rp-cap">경기 시작</div><div class="rp-charts ${showS && showP ? 'two' : ''}">${showS ? miniField() : ''}${showP ? miniZone() : ''}</div><button class="mini sub" id="rp-skip">결과 바로 보기</button></div>`);
    const gRow = (g) => `<div class="${g.win ? 'w' : 'l'} ${replay ? 'pend' : ''}" data-gi="${g.gi != null ? g.gi : ''}"><em>${g.win ? '승' : '패'}</em><span>${g.title ? `<b>${esc(g.title)}</b> ` : ''}${esc(g.label)}${g.sp ? ` <small class="sp">선발 ${esc(g.sp)}</small>` : ''}</span><b>${g.ours}:${g.theirs}</b></div>`;
    if (rep.series && rep.series.length) {
      rep.series.forEach((x, i) => {
        const tagCls = x.tag === '스윕' || x.tag === '위닝시리즈' ? 'good' : 'bad';
        parts.push(`<div class="series"><div class="ser-h"><div><b>${esc(x.opp)}</b> <small>${x.when} · ${x.home ? '홈' : '원정'} 3연전</small></div><span class="tag ${tagCls}">${x.tag} ${x.w}승 ${x.l}패</span></div><div class="games">${rep.games.filter((g) => g.ser && g.ser.i === i).map(gRow).join('')}</div></div>`);
      });
    } else if (rep.games.length) parts.push(`<div class="games">${rep.games.map(gRow).join('')}</div>`);
    if (w && (w.PA || w.PG)) {
      const l = [];
      if (w.PA) l.push(`타격 ${w.AB}타수 ${w.H}안타${w.HR ? ` ${w.HR}홈런` : ''}${w.RBI ? ` ${w.RBI}타점` : ''}${w.BB ? ` ${w.BB}볼넷` : ''}${w.SB ? ` ${w.SB}도루` : ''}`);
      if (w.PG) l.push(`투구 ${w.PG}경기 ${Game.fmtIp(w.OUTS)}이닝 ${w.ER}실점 ${w.PSO}탈삼진${w.W ? ` ${w.W}승` : ''}${w.L ? ` ${w.L}패` : ''}${w.SV ? ` ${w.SV}세이브` : ''}`);
      parts.push(`<div class="weekline">${l.join('<br>')}</div>`);
    } else if (rep.games.length) parts.push('<div class="weekline">이번 주는 경기에 나서지 못했어요.</div>');
    (rep.lines || []).forEach((l) => parts.push(`<p class="small muted">${esc(l)}</p>`));
    (rep.events || []).forEach((l) => parts.push(`<p style="color:var(--bad)">${esc(l)}</p>`));
    if (!parts.length) parts.push('<p class="muted">조용한 한 주가 지나갔어요.</p>');
    if (rep.period && !auto) parts.unshift(`<span class="pd-pill sm" style="background:${pcol(rep.period.color)}">${rep.period.name}</span>`);
    sheet({ title: auto ? '자동 진행 결과' : `${rep.title} 결과`, body: parts.join(''), buttons: [{ label: '확인', onClick: () => { clearTimeout(rpTimer); render(); processPending(); } }], onRender: (b) => { if (replay) runReplay(b, rep); } });
  }

  // ---------- 경기 리플레이 (주간 결과에서 경기마다 점이 찍힘) ----------
  let rpTimer = null;
  const SPRAY_COL = ['#9aa3ae', '#3182f6', '#f08c00', '#f08c00', '#e5484d'];
  function miniField() {
    const hx = 120, hy = 206, k = 1.32;
    const xy = (a, d) => [hx + d * Math.sin(a * Math.PI / 180) * k, hy - d * Math.cos(a * Math.PI / 180) * k];
    const arc = []; for (let a = -45; a <= 45; a += 5) arc.push(xy(a, Game.fenceDist(a)));
    const inf = []; for (let a = -45; a <= 45; a += 9) inf.push(xy(a, 29));
    const P2 = (pts) => `M${hx},${hy} ` + pts.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z';
    return `<svg viewBox="0 0 240 214" class="rp-svg" data-kind="spray"><path d="${P2(arc)}" fill="var(--field)" stroke="var(--line)" stroke-width="1.5"/><path d="${P2(inf)}" fill="var(--dirt)"/><g class="dots"></g></svg>`;
  }
  function miniZone() {
    return `<svg viewBox="0 0 240 214" class="rp-svg" data-kind="pitch"><rect x="0" y="0" width="240" height="214" rx="10" fill="var(--card)"/><rect x="${120 - 44}" y="${105 - 55}" width="88" height="110" fill="none" stroke="var(--text)" stroke-width="1.5"/><g class="dots"></g></svg>`;
  }
  function dotFor(kind, p) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    if (kind === 'spray') {
      const k = 1.32;
      c.setAttribute('cx', (120 + p[1] * Math.sin(p[0] * Math.PI / 180) * k).toFixed(1));
      c.setAttribute('cy', (206 - p[1] * Math.cos(p[0] * Math.PI / 180) * k).toFixed(1));
      c.setAttribute('r', p[2] === 4 ? 4.6 : 3.6);
      c.setAttribute('fill', SPRAY_COL[p[2]]);
    } else {
      c.setAttribute('cx', (120 + p[0] / 100 * 44).toFixed(1));
      c.setAttribute('cy', (105 + p[1] / 100 * 55).toFixed(1));
      c.setAttribute('r', 2.8);
      c.setAttribute('fill', PCOL[Game.PKEYS[p[2]]]);
      c.setAttribute('fill-opacity', '0.7');
    }
    return c;
  }
  function runReplay(body, rep) {
    clearTimeout(rpTimer);
    const games = rep.games.filter((g) => g.gi != null);
    const order = games.map((g) => g.gi);
    const cap = $('#rp-cap', body);
    const svgs = $$('.rp-svg', body);
    let step = 0;
    const show = (gi, instant) => {
      const g = rep.games.find((x) => x.gi === gi);
      svgs.forEach((sv) => {
        const kind = sv.dataset.kind;
        const list = (kind === 'spray' ? rep.anim.spray : rep.anim.pitches).filter((p) => p[p.length - 1] === gi);
        const grp = sv.querySelector('.dots');
        list.forEach((p, i) => { const d = dotFor(kind, p); if (!instant) { d.classList.add('pop'); d.style.animationDelay = Math.min(i * (kind === 'spray' ? 120 : 8), 600) + 'ms'; } grp.appendChild(d); });
      });
      const row = body.querySelector(`.games [data-gi="${gi}"]`);
      if (row) row.classList.remove('pend');
      if (g && cap) cap.innerHTML = `<b>${esc(g.ser ? `${g.ser.opp} ${g.label}` : g.label)}</b> ${g.win ? '승' : '패'} ${g.ours}:${g.theirs}${g.sp ? ` · 상대 선발 ${esc(g.sp)}` : ''}${g.me ? ` · ${esc(g.me)}` : ''}`;
    };
    const tick = () => {
      if (step >= order.length) { if (cap) cap.innerHTML += ' <span class="muted">· 이번 주 끝</span>'; $('#rp-skip', body)?.remove(); return; }
      show(order[step++]);
      rpTimer = setTimeout(tick, 900);
    };
    $('#rp-skip', body).onclick = () => { clearTimeout(rpTimer); while (step < order.length) show(order[step++], true); $('#rp-skip', body)?.remove(); if (cap) cap.textContent = '이번 주 전체 결과'; };
    rpTimer = setTimeout(tick, 300);
  }

  // ---------- 자동 진행 ----------
  function startAuto(max) {
    if (busy) return;
    busy = true;
    let n = 0, w = 0, l = 0, last = null;
    const agg = Game._sim.blankStats();
    const evs = [];
    const step = () => {
      const S = G();
      if (S.pending.length || n >= max || S.phase === 'RETIRED') {
        busy = false;
        if (!last) { render(); processPending(); return; }
        report({ title: '', week: agg, games: [], gains: [], lines: [], events: evs }, `${n}주 진행 · ${w + l ? `팀 ${w}승 ${l}패 · ` : ''}지금 ${Game.dateStr()}`);
        return;
      }
      let act = 'train', sub = null;
      if (S.injury > 0 || S.fat > 62) act = 'rest';
      else {
        const list = Game.trainingList();
        const gap = (x) => {
          if (x.attr === 'vel') return (S.caps.vel - S.pit.vel) * 3;
          if (x.attr === 'pitch') return Object.keys(S.pit.pitches).length < 3 ? 25 : Object.values(S.pit.pitches).reduce((a, v) => a + (7 - v), 0) * 3;
          const ob = ['ctl', 'stf', 'sta'].includes(x.attr) ? S.pit : S.bat;
          return (S.caps[x.attr] - ob[x.attr]) * ({ con: 1.3, pow: 1.2, ctl: 1.3, stf: 1.2 }[x.attr] || 1);
        };
        const top = list.slice().sort((a, b) => gap(b) - gap(a)).slice(0, 3);
        sub = top[Math.floor(Math.random() * top.length)];
        if (sub.id === 'pitch') {
          const own = Object.entries(S.pit.pitches).filter(([, v]) => v < 7).sort((a, b) => a[1] - b[1]);
          const pk = Object.keys(S.pit.pitches).length < 3 ? Game.PITCH_ORDER.find((k) => !S.pit.pitches[k]) : (own[0] || ['FF'])[0];
          sub = Object.assign({}, sub, { pitch: pk });
        }
      }
      Game.planWeek(act, sub);
      last = Game.finishWeek();
      Object.keys(agg).forEach((k) => (agg[k] += (last.week && last.week[k]) || 0));
      last.games.forEach((g) => (g.win ? w++ : l++));
      (last.events || []).forEach((x) => evs.push(x));
      n++;
      setTimeout(step, 0);
    };
    step();
  }

  // ---------- 대기 이벤트 ----------
  function processPending() {
    const S = G();
    if (!S) return;
    if (open) { setTimeout(processPending, 250); return; }
    if (S.phase === 'RETIRED') return ending();
    const ev = S.pending.shift();
    if (!ev) { Game.save(); return; }
    Game.save();
    const after = () => { if (G().phase === 'RETIRED') return ending(); render(); processPending(); };
    const done = (choice) => {
      const fol = Game.resolve(ev, choice);
      Game.save();
      if (fol) sheet({ title: fol.title, body: `<p class="pre">${esc(fol.text)}</p>`, buttons: [{ label: '확인', onClick: after }] });
      else after();
    };
    const d = ev.data;
    const heroBlock = (h, lines, extra) => `<div class="hd-ph">${h.name.slice(-2)}${photo(h.id)}</div>${lines.map((l, i) => `<div class="bubble">${i === 0 ? `<div class="who">${h.name} · ${h.age}세 ${h.job}</div>` : ''}${esc(l)}</div>`).join('')}${extra ? `<p style="color:var(--bad);font-weight:600">${extra}</p>` : ''}`;
    switch (ev.type) {
      case 'msg': sheet({ title: d.title, body: `<p class="pre">${esc(d.text)}</p>`, buttons: [{ label: '확인', onClick: () => done() }] }); break;
      case 'love': {
        const L = Game.loveInfo(d);
        const h = HEROINES.find((x) => x.id === L.hid);
        sheet({ title: L.title, body: (L.news ? `<div class="news-flash">${esc(L.news)}</div>` : '') + heroBlock(h, L.lines), buttons: L.opts.map((o, i) => ({ label: esc(o), cls: 'sub opt', onClick: () => done(i) })) });
        break;
      }
      case 'meet': { const h = HEROINES.find((x) => x.id === d.hid); sheet({ title: '새로운 만남', body: `<p class="muted">${h.meet}에서</p>` + heroBlock(h, h.intro), buttons: [{ label: '확인', onClick: () => done() }] }); break; }
      case 'path': {
        const o = Game.ovr();
        const btns = d.offers.map((of, i) => ({ label: `${Game.teamInfo(of.team).name}<small>계약금 ${Game.usd(of.bonus)} (약 ${Game.won(of.bonus * USD)})</small>`, onClick: () => done(i) }));
        btns.push({ label: 'KBO 신인 드래프트 참가', cls: d.offers.length ? 'sub' : '', onClick: () => done('KBO') });
        if (d.uni != null) btns.push({ label: `대학 진학<small>${UNIVS[d.uni].name} 입학 제안</small>`, cls: 'sub', onClick: () => done('UNI') });
        sheet({ title: '진로를 정할 차례예요', body: `<p>고교 마지막 여름이 끝났어요.</p><div class="kv"><span>종합 능력치</span><b>${o}</b></div><div class="kv"><span>KBO 스카우트 관심</span><b>${Math.round(S.hs.scoutK)}</b></div><div class="kv"><span>MLB 스카우트 관심</span><b>${Math.round(S.hs.scoutM)}</b></div><p>${d.offers.length ? `메이저리그 구단 ${d.offers.length}곳에서 계약을 제안했어요.` : '메이저리그 구단의 제안은 없었어요.'}</p>`, buttons: btns });
        break;
      }
      case 'draft': {
        let body;
        if (d.undrafted) body = `<p>${S.year + 1} KBO 신인 드래프트에서 이름이 불리지 않았어요.</p><p>${Game.teamInfo(d.team).name}에서 육성선수 계약을 제안했어요.</p>`;
        else { const t = Game.teamInfo(d.team); body = `<div class="draft" style="background:${t.c1}"><small>${S.year + 1} KBO 신인 드래프트 · ${d.round}라운드 ${d.inRound}순위 (전체 ${d.pick}번)</small><b>${t.name}</b></div><div class="kv"><span>계약금</span><b>${Game.won(d.bonus)}</b></div><div class="kv"><span>신인 연봉</span><b>3,000만원</b></div>`; }
        sheet({ title: '신인 드래프트', body, buttons: [{ label: '계약하기', onClick: () => done() }] });
        break;
      }
      case 'unidraft':
        sheet({ title: '얼리 드래프트', body: `<p>대학 2학년은 KBO 얼리 드래프트에 나갈 수 있어요.</p><div class="kv"><span>종합 능력치</span><b>${Game.ovr()}</b></div><p class="hint">지명을 못 받아도 4학년 때 다시 도전할 수 있어요.</p>`, row: true, buttons: [{ label: '4학년까지 다닌다', cls: 'sub', onClick: () => done('stay') }, { label: '신청한다', onClick: () => done('apply') }] });
        break;
      case 'undrafted': {
        const it = Game.teamInfo(d.indy);
        const btns = [];
        if (d.stage === 'HS') btns.push({ label: `대학 진학<small>${UNIVS[d.uni].name} 입학 제안</small>`, onClick: () => done('UNI') });
        if (d.stage === 'UNI2') btns.push({ label: '4학년 드래프트에 다시 도전', onClick: () => done('STAY') });
        else btns.push({ label: `독립리그 입단<small>${it.name} · 성적을 내면 신고선수로 프로 입단</small>`, cls: d.stage === 'HS' ? 'sub' : '', onClick: () => done('INDY') });
        sheet({ title: '지명을 받지 못했어요', body: `<p>${S.year + 1} KBO 신인 드래프트에서 끝내 이름이 불리지 않았어요.</p><p>여기서 끝낼 수는 없어요. 어떻게 할까요?</p>`, buttons: btns });
        break;
      }
      case 'tryout': {
        const t = Game.teamInfo(d.team);
        sheet({ title: '프로 구단의 연락', body: `<div class="draft" style="background:${t.c1}"><small>신고선수(육성선수) 계약 제안</small><b>${t.name}</b></div><p>독립리그에서의 활약을 지켜봤다고 해요. 연봉 3,000만원, 퓨처스(2군)부터 시작해요.</p>`, row: true, buttons: [{ label: '거절', cls: 'sub', onClick: () => done('no') }, { label: '계약한다', onClick: () => done('yes') }] });
        break;
      }
      case 'indyAsk': sheet({ title: '꿈을 계속 좇을까?', body: `<p>${S.age}세. 독립리그에서 또 한 시즌이 끝났어요.</p><p>한 시즌 더 도전할까요?</p>`, row: true, buttons: [{ label: '꿈을 접는다', cls: 'danger', onClick: () => done('retire') }, { label: '한 시즌 더', onClick: () => done('stay') }] }); break;
      case 'indyEnd': sheet({ title: '마지막 시즌', body: '<p>프로의 문은 끝내 열리지 않았어요. 그래도 끝까지 그라운드에 섰어요.</p>', buttons: [{ label: '은퇴', onClick: () => done() }] }); break;
      case 'nego': sheet({ title: `${S.year} 연봉 협상`, body: `${d.agent ? '<p class="small muted">에이전트가 협상 테이블에 함께 앉았어요.</p>' : ''}<div class="kv"><span>작년 연봉</span><b>${Game.won(d.prev)}</b></div><div class="kv"><span>작년 WAR</span><b>${d.war}</b></div><div class="kv"><span>구단 제시액</span><b>${Game.won(d.offer)}</b></div><p class="hint">더 요구하면 15% 인상을 노려볼 수 있지만, 실패하면 멘탈이 떨어져요.</p>`, row: true, buttons: [{ label: '더 요구하기', cls: 'sub', onClick: () => done('ask') }, { label: '수락', onClick: () => done('ok') }] }); break;
      case 'fa':
      case 'posting': {
        // 협상 도중 새로고침해도 이어지도록 대기열에 다시 넣어둔다
        S.pending.unshift(ev); Game.save();
        market(ev, (i) => { const q = G().pending; if (q[0] === ev) q.shift(); done(i); });
        break;
      }
      case 'trade':
        sheet({ title: '트레이드 후보', body: '<p>구단이 트레이드 상대를 찾아왔어요. 어디로 갈까요?</p>', buttons: d.offers.map((o, i) => ({ label: `${Game.teamInfo(o.team).name}<small>${o.note}</small>`, cls: 'sub', onClick: () => done(i) })).concat([{ label: '요청 철회하고 남기', cls: 'sub', onClick: () => done('stay') }]) });
        break;
      case 'traded':
        sheet({ title: '트레이드 통보', body: `<p>구단이 ${Game.teamInfo(d.team).name}와 트레이드에 합의했다고 알려왔어요.</p>${d.ntc ? '<p class="hint">계약서에 트레이드 거부권이 있어서 거절할 수 있어요.</p>' : ''}`, row: d.ntc, buttons: d.ntc ? [{ label: '거부권 행사', cls: 'sub', onClick: () => done('refuse') }, { label: '받아들인다', onClick: () => done('ok') }] : [{ label: '짐 싸기', onClick: () => done('ok') }] });
        break;
      case 'optout':
        sheet({ title: '옵트아웃 선택', body: `<p>계약서의 옵트아웃 조항을 쓸 수 있어요. 남은 계약은 ${d.left}년이에요. FA 시장에 다시 나갈까요?</p>`, row: true, buttons: [{ label: '남는다', cls: 'sub', onClick: () => done('stay') }, { label: '옵트아웃', onClick: () => done('out') }] });
        break;
      case 'choice': {
        const c2 = Game.choiceInfo(d.id);
        sheet({ title: c2.title, body: `<p class="pre">${esc(c2.text)}</p>`, buttons: c2.opts.map((o, i) => ({ label: esc(o.label), cls: 'sub opt', onClick: () => done(i) })) });
        break;
      }
      case 'invest': sheet({ title: '투자 제안', body: `<p>지인이 ${Game.won(d.amt)} 투자를 권해요. 오를 수도, 날릴 수도 있어요.</p>`, row: true, buttons: [{ label: '거절', cls: 'sub', onClick: () => done('no') }, { label: '투자', cls: 'danger', onClick: () => done('yes') }] }); break;
      case 'parents': sheet({ title: '부모님께 용돈', body: `<p>뒷바라지해 주신 부모님께 ${Game.won(d.amt)}을 드릴까요?</p>`, row: true, buttons: [{ label: '다음에', cls: 'sub', onClick: () => done('no') }, { label: '드린다', onClick: () => done('yes') }] }); break;
      case 'allstar':
        sheet({
          title: '올스타에 뽑혔어요', body: `<p>팬 투표로 올스타에 선정됐어요.${Game.isBatter() ? ' 홈런더비에도 초대받았어요.' : ''}</p>`, row: Game.isBatter(),
          buttons: Game.isBatter() ? [{ label: '올스타전만', cls: 'sub', onClick: () => done() }, { label: '홈런더비 참가', onClick: () => { const hr = Game.simDerby(); const r = Game.derbyResult(hr); sheet({ title: r.win ? '홈런더비 우승!' : '홈런더비 결과', body: `<div class="big-score">${hr}개</div><p class="muted" style="text-align:center">다른 참가자 ${r.ai.join('개, ')}개</p>`, buttons: [{ label: '확인', onClick: after }] }); } }] : [{ label: '확인', onClick: () => done() }],
        });
        break;
      case 'retireAsk': { const t = Game.careerTotals(); sheet({ title: '은퇴를 고민할 때', body: `<p>${S.age}세. 프로 ${t.seasons}시즌, 통산 WAR ${t.war}.</p><p>유니폼을 벗을까요?</p>`, row: true, buttons: [{ label: '은퇴', cls: 'danger', onClick: () => done('retire') }, { label: '현역 연장', onClick: () => done('stay') }] }); break; }
      case 'forcedRetire': sheet({ title: '은퇴', body: '<p>더 이상 나를 원하는 팀이 없어요. 그라운드를 떠날 시간이에요.</p>', buttons: [{ label: '은퇴식으로', onClick: () => done() }] }); break;
      case 'wedding': { const h = HEROINES.find((x) => x.id === S.partner); sheet({ title: '결혼식', body: heroBlock(h, ['드디어 오늘이네.', '마운드에 있든 타석에 있든, 제일 가까운 자리에서 응원할게.'], '결혼했어요! 멘탈이 크게 올랐어요.'), buttons: [{ label: '확인', onClick: () => done() }] }); break; }
      case 'breakup': { const h = HEROINES.find((x) => x.id === d.hid); sheet({ title: '이별', body: heroBlock(h, ['요즘 우리 너무 멀어진 것 같아.', '우리 그만하자. 응원은 계속할게.']), buttons: [{ label: '확인', onClick: () => done() }] }); break; }
      default: done();
    }
  }

  // ---------- 연애 상세 ----------
  function heroDetail(id) {
    const S = G();
    const h = HEROINES.find((x) => x.id === id);
    const r = S.rel[id];
    const st = Game.relStage(r.aff, id);
    const blocked = Game.dateBlocked(id);
    const propose = Game.proposeCheck(id);
    const canConfess = st === 3;
    const sneak = Game.cheating(id);
    const body = `<div class="hd-ph">${h.name.slice(-2)}${photo(h.id)}</div>
      <div class="kv" style="margin-top:10px"><span>${h.age}세 · ${h.job}</span><b>${Game.STAGE_NAME[st]}</b></div>
      <div class="gauge">호감${bar(r.aff, 100, 'pink')}<em>${Math.round(r.aff)}</em></div>
      <div class="list" style="margin-top:8px">
        <button class="li" data-h="call" ${Game.canContact(id) ? '' : 'disabled'}><div class="ic">${IC.phone}</div><div class="tx"><b>연락하기</b><small>${Game.canContact(id) ? '무료 · 호감 조금 상승' : '이번 주에 이미 연락했어요'}</small></div></button>
        <button class="li" data-h="date" ${blocked ? 'disabled' : ''}><div class="ic">${IC.heart}</div><div class="tx"><b>데이트</b><small>${blocked || (sneak ? '몰래 데이트 · 들킬 위험이 있어요' : '이번 주 행동을 써요')}</small></div></button>
        <button class="li" data-h="gift"><div class="ic">${IC.gift}</div><div class="tx"><b>선물</b><small>돈을 써서 호감 상승</small></div></button>
        ${canConfess ? `<button class="li" data-h="confess" ${r.aff >= 70 ? '' : 'disabled'}><div class="ic">${IC.star}</div><div class="tx"><b>고백하기</b><small>${r.aff >= 70 ? (sneak ? '성공하면 비밀 연인이 돼요' : '성공하면 연인이 돼요') : '호감 70부터 할 수 있어요'}</small></div></button>` : ''}
        ${S.partner === id && !S.engaged && !S.spouse ? `<button class="li" data-h="propose" ${propose ? 'disabled' : ''}><div class="ic">${IC.star}</div><div class="tx"><b>프러포즈</b><small>${propose || '반지와 신혼집 준비 완료'}</small></div></button>` : ''}
      </div>`;
    sheet({
      title: h.name, body, dismiss: true, buttons: [{ label: '닫기', cls: 'sub' }],
      onRender: (b, close) => {
        b.onclick = (e) => {
          const x = e.target.closest('[data-h]'); if (!x || x.disabled) return;
          const a = x.dataset.h; close();
          if (a === 'call') {
            const res = Game.contact(id);
            sheet({
              title: h.name, body: `<div class="hd-ph" style="aspect-ratio:1/1;max-height:30vh">${h.name.slice(-2)}${photo(h.id)}</div><div class="bubble">${esc(res.line)}</div><p class="small muted">어떻게 답할까요?</p>`,
              buttons: REPLY_TONES.map((t) => ({ label: t.label, cls: 'sub opt', onClick: () => { const r2 = Game.reply(id, t.id); talk(h, [r2.text], `${r2.like ? '반응이 좋아요! ' : ''}호감 +${r2.gain}`, () => heroDetail(id)); } })),
            });
          }
          else if (a === 'date') datePicker(h);
          else if (a === 'gift') giftPicker(h);
          else if (a === 'confess') { const ok = Game.confess(id); const sec = ok && Game.relStage(G().rel[id].aff, id) === 7; talk(h, ok ? (sec ? ['…너 만나는 사람 있는 거 알아.', '그래도 좋아. 우리 둘만 아는 걸로 하자.'] : ['사실 나도 같은 마음이었어요.', '오늘부터 1일이에요.']) : ['미안해요, 아직은 잘 모르겠어요.', '조금만 더 시간을 줄래요?'], ok ? (sec ? '비밀 연인이 됐어요. 들키지 않게 조심하세요.' : '연인이 됐어요!') : '호감 -10', render); }
          else if (a === 'propose') { const ok = Game.propose(id); talk(h, ok ? ['이거 반지야?', '응. 평생 옆에 있을게.'] : ['조금만 생각할 시간을 줘.'], ok ? '프러포즈 성공! 6주 뒤에 결혼식이에요.' : '호감 -8', render); }
        };
      },
    });
  }
  function talk(h, lines, extra, then) {
    sheet({ title: h.name, body: `<div class="hd-ph" style="aspect-ratio:1/1;max-height:30vh">${h.name.slice(-2)}${photo(h.id)}</div>${lines.map((l) => `<div class="bubble">${esc(l)}</div>`).join('')}${extra ? `<p style="color:var(--bad);font-weight:600">${extra}</p>` : ''}`, buttons: [{ label: '확인', onClick: then }] });
  }
  function datePicker(h) {
    const S = G();
    const off = Game.isOffseason();
    sheet({
      title: `${h.name}와 어디 갈까요?`, dismiss: true,
      body: `<div class="list">${DATE_PLACES.filter((p) => !p.special || Game.relStage(S.rel[h.id].aff, h.id) >= p.stage).map((p) => { const rk = Game.cheating(h.id) ? ` · 들킬 위험 +${Game.dateRiskOf(p.id)}` : ''; const why = p.needCar && !S.car ? '차가 있어야 해요' : p.offseason && !off ? '비시즌에만 가능' : S.money < p.cost ? '돈이 부족해요' : ''; return `<button class="li ${p.special ? 'special' : ''}" data-p="${p.id}" ${why ? 'disabled' : ''}><div class="tx"><b>${p.name}${h.fav === p.id ? ' ♥' : ''}</b><small>${why || (p.special ? `둘만의 밤 · 피로 +${p.fat} · 멘탈 +${p.mental}` : `피로 -${p.cond}`) + (why ? '' : rk)}</small></div><span class="val">${Game.won(p.cost)}</span></button>`; }).join('')}</div><p class="hint">♥ 표시는 ${h.name}이(가) 좋아하는 곳이에요.${Game.cheating(h.id) ? ' 연인 몰래 만나면 의심도가 쌓이고, 높을수록 들킬 확률이 올라가요.' : ''}</p>`,
      buttons: [{ label: '취소', cls: 'sub' }],
      onRender: (b, close) => { b.onclick = (e) => { const x = e.target.closest('[data-p]'); if (!x || x.disabled) return; close(); runWeek('date', { hid: h.id, place: x.dataset.p }); }; },
    });
  }
  function giftPicker(h) {
    const S = G();
    sheet({
      title: '선물하기', dismiss: true,
      body: `<div class="list">${GIFTS.map((g) => `<button class="li" data-g="${g.id}" ${S.money < g.cost || (g.ring && (S.ring || S.spouse)) ? 'disabled' : ''}><div class="tx"><b>${g.name}</b><small>${g.ring ? (S.ring ? '이미 준비했어요' : '프러포즈용') : `호감 +${g.aff}`}</small></div><span class="val">${Game.won(g.cost)}</span></button>`).join('')}</div>`,
      buttons: [{ label: '취소', cls: 'sub', onClick: () => heroDetail(h.id) }],
      onRender: (b, close) => { b.onclick = (e) => { const x = e.target.closest('[data-g]'); if (!x || x.disabled) return; close(); const r = Game.gift(h.id, x.dataset.g); toast(r.msg); heroDetail(h.id); }; },
    });
  }

  // ---------- 자산 ----------
  function buy(id) {
    const S = G();
    const tab = view.asset;
    const it = (tab === 'house' ? HOUSES : CARS).find((x) => x.id === id);
    const own = tab === 'house' ? S.houses.includes(id) : S.cars.includes(id);
    const go = () => { const r = tab === 'house' ? Game.buyHouse(id) : Game.buyCar(id); toast(r.msg); render(); };
    if (own) return go();
    sheet({ title: `${it.name} 구매`, body: `<p>${Game.won(it.price)}을 쓸까요? 남는 돈은 ${Game.won(S.money - it.price)}이에요.</p>`, row: true, buttons: [{ label: '취소', cls: 'sub' }, { label: '구매', onClick: go }] });
  }
  function sell(id) {
    const tab = view.asset;
    const it = (tab === 'house' ? HOUSES : CARS).find((x) => x.id === id);
    sheet({ title: `${it.name} 팔기`, body: `<p>${Game.won(it.price * (tab === 'house' ? 0.9 : 0.6))}에 팔 수 있어요.</p>`, row: true, buttons: [{ label: '취소', cls: 'sub' }, { label: '팔기', cls: 'danger', onClick: () => { const r = tab === 'house' ? Game.sellHouse(id) : Game.sellCar(id); if (r.msg) toast(r.msg); render(); } }] });
  }

  // ---------- 설정 ----------
  function settings() {
    let cur = 'system';
    try { cur = localStorage.getItem('baseballLife.theme') || 'system'; } catch (e) { /* */ }
    sheet({
      title: '설정', dismiss: true,
      body: `<div class="field"><label>화면 테마</label><div class="seg" id="th">${[['system', '시스템'], ['light', '라이트'], ['dark', '다크']].map(([k, n]) => `<button data-v="${k}" class="${cur === k ? 'on' : ''}">${n}</button>`).join('')}</div></div><p class="hint">게임은 매주 자동 저장돼요.</p>`,
      buttons: [
        { label: '실제 선수 명단', cls: 'sub', onClick: () => rosterSheet() },
        { label: '은퇴하기', cls: 'sub', onClick: () => sheet({ title: '정말 은퇴할까요?', body: '<p>커리어가 끝나고 엔딩으로 넘어가요.</p>', row: true, buttons: [{ label: '취소', cls: 'sub' }, { label: '은퇴', cls: 'danger', onClick: () => { Game.resolve({ type: 'forcedRetire', data: {} }); Game.save(); ending(); } }] }) },
        { label: '새로 시작하기', cls: 'sub', onClick: () => sheet({ title: '새로 시작할까요?', body: '<p>지금 저장된 선수는 지워져요.</p>', row: true, buttons: [{ label: '취소', cls: 'sub' }, { label: '새로 시작', cls: 'danger', onClick: () => { Game.wipe(); create(); } }] }) },
        { label: '닫기' }],
      onRender: (b) => { $('#th', b).onclick = (e) => { const x = e.target.closest('button'); if (!x) return; try { if (x.dataset.v === 'system') localStorage.removeItem('baseballLife.theme'); else localStorage.setItem('baseballLife.theme', x.dataset.v); } catch (er) { /* */ } $$('#th button', b).forEach((q) => q.classList.toggle('on', q === x)); applyTeam(); }; },
    });
  }

  function rosterSheet() {
    const info = Game.rosterInfo();
    let txt = Game.rosterText();
    sheet({
      title: '실제 선수 명단', dismiss: true,
      body: `<p class="hint">명단은 이 기기 브라우저에만 저장되고 게임 파일에는 들어가지 않아요. 상대 선발투수와 시상식 소식에 이름이 나와요.</p>
        <div class="field"><label>지금 등록된 명단</label><div class="weekline" id="ro-st">${info.players ? `${info.teams}개 팀, ${info.players}명` : '없음 (가상 이름 사용 중)'}</div></div>
        <div class="field"><label>명단 붙여넣기</label><textarea id="ro-tx" class="ro-tx" spellcheck="false" placeholder="[LG 트윈스]&#10;투수: 임찬규(1992), 손주영(1998)&#10;타자: 홍창기(1993), 문보경(2000)">${esc(Game.rosterText())}</textarea></div>
        <p class="hint">팀 이름은 [ ] 안에, 선수는 투수:, 타자: 뒤에 쉼표로 적어요. 괄호 속 출생연도를 적으면 나이가 들어 은퇴해요. 투수는 앞의 5명이 선발로 나와요.</p>`,
      buttons: [{ label: '비우기', cls: 'sub', onClick: () => { Game.setRoster(''); toast('명단을 지웠어요'); } }, { label: '저장', onClick: (b) => { const r = Game.setRoster(txt); toast(r.players ? `${r.teams}개 팀, ${r.players}명 저장${r.bad.length ? ` (모르는 팀: ${r.bad.join(', ')})` : ''}` : '인식된 선수가 없어요'); } }],
      onRender: (b) => { $('#ro-tx', b).oninput = (e) => { txt = e.target.value; }; },
    });
  }

  const FPOS_TIP = {
    C: '수비 부담이 가장 크지만 가치도 가장 높아요. 체력 소모가 커요.',
    SS: '내야의 핵심. 수비와 주력이 중요하고 가치가 높아요.',
    '2B': '수비와 발이 고루 필요한 내야수예요.',
    CF: '넓은 외야를 책임져요. 주력과 수비가 중요해요.',
    '3B': '강한 어깨가 필요한 핫코너예요.',
    RF: '강한 어깨가 필요한 외야수예요.',
    LF: '타격에 집중하기 좋은 외야수예요.',
    '1B': '수비 부담이 적어 타격이 특히 중요해요.',
    DH: '수비 없이 타격만. 대신 방망이로 증명해야 해요.',
  };
  function fposSheet() {
    const S = G();
    const cur = S.fpos;
    sheet({
      title: '포지션 변경', dismiss: true,
      body: `<div class="list">${Object.entries(Game.FPOS).map(([k, v]) => { S.fpos = k; const o = Game.batOVR(); S.fpos = cur; return `<button class="li" data-f="${k}" ${k === cur ? 'disabled' : ''}><div class="tx"><b>${v.name}${k === cur ? ' (지금)' : ''}</b><small>${FPOS_TIP[k]}</small></div><span class="val">타격 종합 ${o}</span></button>`; }).join('')}</div>`,
      buttons: [{ label: '취소', cls: 'sub' }],
      onRender: (b, close) => { b.onclick = (e) => { const x = e.target.closest('[data-f]'); if (!x || x.disabled) return; close(); Game.setFpos(x.dataset.f); toast(`${Game.FPOS[x.dataset.f].name}로 바꿨어요`); render(); }; },
    });
  }

  // ---------- FA 시장 / 포스팅 / 협상 ----------
  function offerTerms(of) {
    const t = Game.teamInfo(of.team);
    const money = of.lg === 'KBO'
      ? `${of.years}년 총액 ${Game.won(of.total + (of.optAmt || 0) * of.years)}${of.optAmt ? ` (보장 ${Game.won(of.total)})` : ''} · 계약금 ${Game.won(of.bonus)}`
      : `${of.years}년 ${Game.usd((of.aav + (of.optAmt || 0)) * of.years)} · 연 ${Game.usd(of.aav)}${of.optAmt ? ` + 옵션 ${Game.usd(of.optAmt)}` : ''}`;
    return { name: of.lg === 'MLB' ? `${t.name}` : t.name, money, clause: Game.clauseText(of) };
  }
  function chanceWord(p) { return p >= 0.7 ? ['높음', 'good'] : p >= 0.4 ? ['보통', 'warn'] : ['낮음', 'bad']; }
  function market(ev, finish) {
    const S = G();
    const d = ev.data;
    const posting = ev.type === 'posting';
    const intro = posting ? '포스팅에 응찰한 메이저리그 구단들이에요. 조건을 직접 협상할 수 있어요.'
      : S.phase === 'KBO' && S.contract && S.contract.kind === 'annual' ? 'KBO 1군 7시즌을 채워 FA 자격을 얻었어요. 조건을 직접 협상해 보세요.' : '계약이 끝나 FA 시장에 나왔어요. 조건을 직접 협상해 보세요.';
    const body = `<p>${intro}</p><p class="hint" style="margin-top:-4px">구단마다 협상은 3번까지예요. 무리하게 요구하면 관심도가 떨어지고, 협상 테이블을 떠날 수도 있어요.</p>
      <div class="offers">${d.offers.map((of, i) => {
        const t = offerTerms(of);
        return `<div class="offer ${of.agreed ? 'ok' : ''}">
          <div class="of-h"><b>${esc(t.name)}</b>${of.lg === 'MLB' ? '<span class="tag">MLB</span>' : ''}${of.agreed ? '<span class="tag good">합의</span>' : ''}</div>
          <div class="of-m">${t.money}</div>${t.clause ? `<div class="of-c">${esc(t.clause)}</div>` : ''}
          <div class="gauge">관심${bar(of.interest, 100, of.interest >= 65 ? 'good' : of.interest >= 40 ? 'warn' : 'bad')}<em>${of.interest}</em></div>
          <div class="of-b"><button class="btn sub" data-ng="${i}" ${of.agreed || (of.rounds || 0) >= 3 ? 'disabled' : ''}>${of.agreed ? '합의 완료' : (of.rounds || 0) >= 3 ? '협상 종료' : `협상하기 (${of.rounds || 0}/3)`}</button><button class="btn" data-sg="${i}">계약</button></div>
        </div>`;
      }).join('')}</div>`;
    sheet({
      title: posting ? '포스팅 결과' : 'FA 시장', body,
      buttons: posting ? [{ label: '모두 거절하고 잔류', cls: 'sub', onClick: () => finish('stay') }] : [],
      onRender: (b, close) => {
        b.onclick = (e) => {
          const n = e.target.closest('[data-ng]'); const g = e.target.closest('[data-sg]');
          if (n && !n.disabled) { close(); negoSheet(ev, +n.dataset.ng, finish); }
          if (g) {
            const of = d.offers[+g.dataset.sg]; const t = offerTerms(of);
            close();
            sheet({ title: `${t.name}와 계약할까요?`, body: `<p>${t.money}</p>${t.clause ? `<p class="small muted">${esc(t.clause)}</p>` : ''}`, row: true, buttons: [{ label: '다시 보기', cls: 'sub', onClick: () => market(ev, finish) }, { label: '계약', onClick: () => finish(+g.dataset.sg) }] });
          }
        };
      },
    });
  }
  function negoSheet(ev, i, finish) {
    const off = ev.data.offers[i];
    const kbo = off.lg === 'KBO';
    const dm = { money: 0, years: 0, opt: false, bonus: false, post: false, ntc: false, optout: false };
    const seg = (key, opts) => `<div class="seg ng" data-k="${key}">${opts.map(([v, n]) => `<button data-v="${v}" class="${String(dm[key]) === String(v) ? 'on' : ''}">${n}</button>`).join('')}</div>`;
    const chip = (key, n, tip) => `<button class="chip ng-c" data-c="${key}"><b>${n}</b><small>${tip}</small></button>`;
    const body = `<div class="kv"><span>${esc(offerTerms(off).name)} 관심도</span><b>${off.interest}</b></div>
      <div class="field"><label>금액</label>${seg('money', [[0, '그대로'], [10, '+10%'], [20, '+20%']])}</div>
      <div class="field"><label>계약 기간</label>${seg('years', [[-1, '1년 줄이기'], [0, '그대로'], [1, '1년 늘리기']])}</div>
      <div class="field"><label>계약 구조</label>${seg('opt', [[false, '전액 보장'], [true, '옵션 포함']])}<p class="hint" style="margin:4px 0 0">옵션 포함: 총액이 15% 늘지만 30%는 WAR ${kbo ? '2.5' : '2.0'} 이상일 때만 받아요. 구단이 좋아해요.</p></div>
      ${kbo ? `<div class="field"><label>계약금 비중</label>${seg('bonus', [[false, '기본 35%'], [true, '높게 50%']])}</div>` : ''}
      <div class="field"><label>특약</label><div class="chips ng-chips">${kbo ? chip('post', '메이저리그 진출 허용', '언제든 포스팅 요청 승인') : chip('optout', '옵트아웃', '3년 이상 계약, 2년 뒤 FA 선택')}${chip('ntc', '트레이드 거부권', '원치 않는 트레이드 거절')}</div></div>
      <div class="ng-prev" id="ng-prev"></div>`;
    const upd = (b) => {
      const p = Game.negoChance(off, dm);
      const pv = Game.previewDemand(off, dm);
      const t = offerTerms(pv); const [w, cls] = chanceWord(p);
      $('#ng-prev', b).innerHTML = `<div class="small muted">요구 조건</div><div class="ng-terms">${t.money}</div>${t.clause ? `<div class="of-c">${esc(t.clause)}</div>` : ''}<div class="kv" style="margin-top:6px"><span>받아들일 가능성</span><b class="c-${cls}">${w} (${Math.round(p * 100)}%)</b></div>`;
    };
    sheet({
      title: `협상 ${(off.rounds || 0) + 1}/3`, body, row: true,
      buttons: [{ label: '뒤로', cls: 'sub', onClick: () => market(ev, finish) }, { label: '제안하기', onClick: () => propose() }],
      onRender: (b) => {
        upd(b);
        b.onclick = (e) => {
          const sb = e.target.closest('.seg.ng button');
          if (sb) { const k = sb.parentNode.dataset.k; const v = sb.dataset.v; dm[k] = v === 'true' ? true : v === 'false' ? false : +v; $$('button', sb.parentNode).forEach((x) => x.classList.toggle('on', x === sb)); upd(b); return; }
          const c = e.target.closest('.ng-c');
          if (c) { const k = c.dataset.c; dm[k] = !dm[k]; c.classList.toggle('on', dm[k]); upd(b); }
        };
      },
    });
    function propose() {
      const r = Game.negotiate(off, dm);
      const S = G();
      const name = offerTerms(off).name;
      Game.save();
      if (r.res === 'accept') {
        ev.data.offers[i] = r.offer; Game.save();
        const t = offerTerms(r.offer);
        sheet({ title: '합의!', body: `<p>"좋습니다. 그 조건으로 하죠." ${esc(name)} 단장이 손을 내밀었다.</p><div class="kv"><span>계약 조건</span><b>${t.money}</b></div>${t.clause ? `<p class="small muted">${esc(t.clause)}</p>` : ''}`, row: true, buttons: [{ label: '다른 팀 보기', cls: 'sub', onClick: () => market(ev, finish) }, { label: '바로 계약', onClick: () => finish(i) }] });
      } else if (r.res === 'counter') {
        const t = offerTerms(r.offer);
        sheet({ title: '역제안', body: `<p>"${esc(r.why)}." ${esc(name)} 쪽에서 수정안을 내밀었다.</p><div class="kv"><span>수정안</span><b>${t.money}</b></div>${t.clause ? `<p class="small muted">${esc(t.clause)}</p>` : ''}`, row: true, buttons: [{ label: '거절', cls: 'sub', onClick: () => market(ev, finish) }, { label: '수정안 수락', onClick: () => { ev.data.offers[i] = r.offer; Game.save(); market(ev, finish); } }] });
      } else if (r.res === 'walk') {
        ev.data.offers.splice(i, 1);
        if (!ev.data.offers.length) ev.data.offers.push(Game.fallbackOffer());
        Game.save();
        sheet({ title: '협상 결렬', body: `<p>${esc(name)}이(가) 협상 테이블을 떠났다. "다른 선수를 알아보겠습니다."</p>`, buttons: [{ label: '돌아가기', onClick: () => market(ev, finish) }] });
      } else {
        sheet({ title: '거절', body: `<p>"그 조건은 어렵습니다." 관심도가 ${off.interest}(으)로 떨어졌어요.</p>`, buttons: [{ label: '돌아가기', onClick: () => market(ev, finish) }] });
      }
      void S;
    }
  }
  function requestSheet(kind) {
    const S = G();
    if (kind === 'trade') {
      sheet({ title: '트레이드 요청', body: `<p>구단에 공식적으로 트레이드를 요청할까요?</p><p class="hint">요청만으로 감독 신뢰가 18 떨어져요. 1~2주 뒤 구단이 후보 팀을 가져오면 직접 고를 수 있고, 성사되지 않으면 신뢰가 더 떨어져요. 벤치 멤버이거나 신뢰가 낮을수록 잘 받아들여져요.</p>`, row: true, buttons: [{ label: '취소', cls: 'sub' }, { label: '요청하기', cls: 'danger', onClick: () => { const t = Game.requestTrade(); sheet({ title: '요청 완료', body: `<p class="pre">${esc(t)}</p>`, buttons: [{ label: '확인', onClick: render }] }); } }] });
    } else {
      const clause = S.contract && S.contract.post;
      sheet({ title: '포스팅 요청', body: `<p>메이저리그 진출을 위해 구단에 포스팅을 요청할까요?</p><p class="hint">${clause ? '계약서에 메이저리그 진출 허용 조항이 있어서 바로 승인돼요.' : '감독 신뢰와 인기가 높을수록 허락받기 쉬워요. 거절당하면 신뢰 -12, 멘탈 -6이고 내년에 다시 할 수 있어요.'} 승인되면 시즌이 끝난 뒤 응찰한 구단과 직접 협상해요.</p>`, row: true, buttons: [{ label: '취소', cls: 'sub' }, { label: '요청하기', onClick: () => { const r = Game.requestPosting(); sheet({ title: r.ok ? '포스팅 승인!' : '포스팅 거절', body: `<p class="pre">${esc(r.text)}</p>`, buttons: [{ label: '확인', onClick: render }] }); } }] });
    }
  }

  // ---------- 시작 / 생성 ----------
  function intro() {
    const s = $('#screen');
    s.className = ''; s.onclick = null;
    const has = Game.hasSave();
    s.innerHTML = `<div class="intro"><div>
        <svg class="diamond" viewBox="0 0 120 120"><rect x="24" y="24" width="72" height="72" rx="6" transform="rotate(45 60 60)" fill="var(--field)" stroke="var(--team)" stroke-width="3"/><circle cx="60" cy="60" r="7" fill="var(--team)"/></svg>
        <h1>야구 인생</h1><p>고1 야구부에서 시작해<br>KBO와 메이저리그를 거쳐 은퇴할 때까지.</p></div>
      <div class="menu">${has ? '<button class="btn full" id="go-cont">이어하기</button>' : ''}<button class="btn full ${has ? 'sub' : ''}" id="go-new">새로 시작하기</button></div></div>`;
    if (has) $('#go-cont').onclick = () => { Game.load(); view.tab = 'home'; render(); processPending(); };
    $('#go-new').onclick = () => (has ? sheet({ title: '새로 시작할까요?', body: '<p>저장된 선수는 지워져요.</p>', row: true, buttons: [{ label: '취소', cls: 'sub' }, { label: '새로 시작', cls: 'danger', onClick: create }] }) : create());
  }
  function create() {
    const st = { pos: 'B', hand: 'RR', fpos: 'SS', school: 0, talent: Game.rollTalent() };
    const s = $('#screen');
    s.className = 'screen bare'; s.onclick = null;
    s.innerHTML = `<div class="hdr"><div><h1>선수 만들기</h1><div class="date">2027년 3월, 고등학교 1학년</div></div></div>
      <div class="card" style="display:flex;flex-direction:column;gap:14px">
        <div class="field"><label for="cr-name">이름</label><div class="row"><input id="cr-name" maxlength="8" placeholder="선수 이름"><input id="cr-num" type="number" min="0" max="99" value="17" style="width:84px;text-align:center" aria-label="등번호"></div></div>
        <div class="field"><label>포지션</label><div class="seg" id="cr-pos"><button data-v="B" class="on">타자</button><button data-v="P">투수</button><button data-v="TW">이도류</button></div></div>
        <div class="field" id="cr-fpos-wrap"><label>수비 포지션</label><div class="chips" id="cr-fpos">${Object.entries(Game.FPOS).map(([k, v]) => `<button class="chip ${k === 'SS' ? 'on' : ''}" data-v="${k}">${v.name}</button>`).join('')}</div><small class="muted" id="cr-fpos-tip"></small></div>
        <div class="field"><label>투타</label><div class="seg" id="cr-hand"><button data-v="RR" class="on">우투우타</button><button data-v="RL">우투좌타</button><button data-v="LL">좌투좌타</button><button data-v="RS">우투양타</button></div></div>
        <div class="field"><label for="cr-school">고등학교</label><select id="cr-school">${SCHOOLS.map((sc, i) => `<option value="${i}">${sc.name} (${sc.region}) 전력 ${'★'.repeat(Math.max(1, Math.round((sc.str - 58) / 4)))}</option>`).join('')}</select></div>
      </div>
      <div class="card"><div class="card-t"><h3>타고난 재능</h3><button class="mini sub" id="cr-roll">다시 뽑기</button></div><div id="cr-talent"></div></div>
      <button class="btn full" id="cr-go">야구부 입부하기</button>
      <button class="btn full sub" id="cr-back">뒤로</button>`;
    const draw = () => {
      $('#cr-fpos-wrap', s).hidden = st.pos === 'P';
      $('#cr-fpos-tip', s).textContent = FPOS_TIP[st.fpos];
      const t = st.talent, b = t.bat, p = t.pit;
      const pot = Math.max(1, Math.min(5, Math.round((t.pot - 50) / 9)));
      const cells = [];
      if (st.pos !== 'P') cells.push(['컨택', b.con], ['파워', b.pow], ['선구안', b.eye], ['주력', b.spd], ['수비', b.def], ['송구', b.arm]);
      if (st.pos !== 'B') cells.push(['구속', Math.round(p.vel) + 'km'], ['제구', p.ctl], ['구위', p.stf]);
      $('#cr-talent', s).innerHTML = `<div class="kv"><span>잠재력</span><b class="stars">${starStr(pot)}</b></div><div class="talent">${cells.map(([k, v]) => `<div>${k}<b>${typeof v === 'number' ? Math.round(v) : v}</b></div>`).join('')}</div><p class="hint">잠재력이 높을수록 더 높이 성장해요.</p>`;
    };
    const seg = (id, key) => { $(id, s).onclick = (e) => { const b = e.target.closest('button'); if (!b) return; $$(id + ' button', s).forEach((x) => x.classList.toggle('on', x === b)); st[key] = b.dataset.v; draw(); }; };
    seg('#cr-pos', 'pos'); seg('#cr-hand', 'hand');
    $('#cr-fpos', s).onclick = (e) => { const b = e.target.closest('button'); if (!b) return; $$('#cr-fpos button', s).forEach((x) => x.classList.toggle('on', x === b)); st.fpos = b.dataset.v; draw(); };
    $('#cr-school', s).onchange = (e) => (st.school = +e.target.value);
    $('#cr-roll', s).onclick = () => { st.talent = Game.rollTalent(); draw(); };
    $('#cr-back', s).onclick = intro;
    $('#cr-go', s).onclick = () => {
      const name = $('#cr-name', s).value.trim();
      if (!name) { toast('이름을 입력해 주세요'); $('#cr-name', s).focus(); return; }
      Game.newGame({ name, num: Math.max(0, Math.min(99, +$('#cr-num', s).value || 17)), pos: st.pos, fpos: st.pos === 'P' ? 'RF' : st.fpos, throws: st.hand[0], bats: st.hand[1], look: { skin: '#f0c8a8', hair: '#1e1612' }, school: st.school, talent: st.talent });
      view.tab = 'home'; render(); processPending();
    };
    draw();
  }

  // ---------- 엔딩 ----------
  function ending() {
    const S = G();
    clearSheets();
    applyTeam();
    const t = Game.careerTotals();
    const h = S.spouse ? HEROINES.find((x) => x.id === S.spouse) : null;
    const s = $('#screen');
    s.className = 'screen bare'; s.onclick = null;
    s.innerHTML = `<div class="hdr"><div><h1>${esc(S.name)}의 야구 인생</h1><div class="date">${S.age}세 은퇴 · ${Game.dateStr()}</div></div></div>
      ${S.hof ? '<div><span class="hof">명예의 전당 헌액</span></div>' : ''}
      <div class="card"><div class="card-t"><h3>프로 통산</h3><small>${t.seasons}시즌</small></div><p class="pre" style="margin:0">${Game.seasonSummary(t)}</p><div class="kv" style="margin-top:6px"><span>통산 WAR</span><b>${t.war}</b></div></div>
      <div class="card"><div class="card-t"><h3>영광의 순간</h3></div>${S.trophies.length || S.awards.length ? `<div class="list">${[...S.trophies, ...S.awards].map((x) => `<div class="li"><div class="tx"><b style="font-weight:500">${esc(x)}</b></div></div>`).join('')}</div>` : '<p class="muted">기록보다 기억에 남는 선수였어요.</p>'}</div>
      <div class="card"><div class="card-t"><h3>인생</h3></div>
        <div class="kv"><span>모은 돈</span><b>${Game.won(S.money)}</b></div><div class="kv"><span>집</span><b>${HOUSES.find((x) => x.id === S.house).name}</b></div>
        <div class="kv"><span>차</span><b>${S.car ? CARS.find((x) => x.id === S.car).name : '-'}</b></div><div class="kv"><span>배우자</span><b>${h ? h.name : '-'}</b></div></div>
      <button class="btn full" id="end-new">새로운 야구 인생</button>`;
    $('#end-new').onclick = () => { Game.wipe(); create(); };
  }

  return { render, processPending, sheet, toast, view };
})();

window.addEventListener('load', () => UI.render());
