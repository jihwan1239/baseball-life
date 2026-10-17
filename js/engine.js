// ===== 커리어 시뮬레이션 엔진 =====

const Game = (() => {
  const SAVE_KEY = 'baseballLife.save.v1';
  let S = null;

  // ---------- 유틸 ----------
  const rnd = (a, b) => a + Math.random() * (b - a);
  const ri = (a, b) => Math.floor(rnd(a, b + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const chance = (p) => Math.random() < p;
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function won(n) {
    const neg = n < 0; n = Math.abs(Math.round(n));
    const eok = Math.floor(n / 1e8), man = Math.floor((n % 1e8) / 1e4);
    let s = '';
    if (eok) s += eok.toLocaleString() + '억';
    if (man) s += (s ? ' ' : '') + man.toLocaleString() + '만';
    if (!s) s = n.toLocaleString();
    return (neg ? '-' : '') + s + '원';
  }
  function usd(n) {
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M';
    if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
    return '$' + Math.round(n);
  }
  function grade(v) {
    if (v >= 90) return 'S'; if (v >= 80) return 'A'; if (v >= 70) return 'B'; if (v >= 60) return 'C';
    if (v >= 50) return 'D'; if (v >= 40) return 'E'; if (v >= 30) return 'F'; return 'G';
  }
  const LEVEL_LABEL = { KBO1: '1군', KBO2: '퓨처스(2군)', RK: '루키리그', A: '싱글A', 'A+': '하이싱글A', AA: '더블A', AAA: '트리플A', MLB: '메이저리그' };
  const MILB_LADDER = ['RK', 'A', 'A+', 'AA', 'AAA', 'MLB'];
  const MILB_UP = { RK: 47, A: 51, 'A+': 55, AA: 59, AAA: 64 };
  const LEVEL_L = { KBO1: 60, KBO2: 48, RK: 41, A: 46, 'A+': 50, AA: 55, AAA: 60, MLB: 67 };
  const POS_LABEL = { B: '타자', P: '투수', TW: '이도류' };

  const SEASON = {
    KBO: { reg: [11, 34], camp: [4, 7], post: [35, 37], end: 38, awards: 39, fa: 41, retire: 42, nego: 1, keys: [11, 15, 19, 23, 27, 31, 34], allstar: 27 },
    MLB: { reg: [12, 38], camp: [6, 10], post: [39, 42], end: 43, awards: 44, fa: 45, retire: 46, nego: 2, keys: [12, 16, 20, 24, 29, 33, 38], allstar: 28 },
  };
  const HS_CAL = {
    9: { t: 'league' }, 10: { t: 'league' }, 12: { t: 'league' }, 13: { t: 'league' }, 14: { t: 'league' },
    16: { t: 'tourn', name: '황금사자기', start: true }, 17: { t: 'tourn' }, 18: { t: 'tourn' },
    21: { t: 'league' }, 22: { t: 'league' },
    25: { t: 'tourn', name: '청룡기', start: true }, 26: { t: 'tourn' }, 27: { t: 'tourn' },
    29: { t: 'tourn', name: '봉황대기', start: true }, 30: { t: 'tourn' }, 31: { t: 'tourn' },
    37: { t: 'tourn', name: '전국체전', start: true, short: true },
  };
  const ROUNDS = ['1회전', '2회전', '16강', '8강', '4강', '결승'];

  // ---------- 날짜 ----------
  function dateStr(y = S.year, w = S.week) { return `${y}년 ${Math.floor(w / 4) + 1}월 ${(w % 4) + 1}주`; }
  function monthOf(w) { return Math.floor(w / 4) + 1; }

  // ---------- 능력치 ----------
  function velScore(v) { return clamp((v - 118) / 42 * 100, 0, 100); }
  function repScore(p) {
    const lv = Object.entries(p).filter(([k]) => k !== 'FF').map(([, v]) => v).sort((a, b) => b - a);
    const s = (lv[0] || 0) + (lv[1] || 0) * 0.8 + (lv[2] || 0) * 0.5 + (p.FF || 0) * 0.4;
    return clamp(s / 16.5 * 100, 0, 100);
  }
  // 수비 포지션: 수비/송구 비중과 WAR 포지션 보정(600타석 기준)
  const FPOS = {
    C: { name: '포수', def: 0.16, arm: 0.08, spd: 0.04, adj: 1.2 },
    SS: { name: '유격수', def: 0.16, arm: 0.08, spd: 0.12, adj: 0.75 },
    '2B': { name: '2루수', def: 0.13, arm: 0.04, spd: 0.12, adj: 0.3 },
    CF: { name: '중견수', def: 0.13, arm: 0.05, spd: 0.14, adj: 0.25 },
    '3B': { name: '3루수', def: 0.13, arm: 0.08, spd: 0.08, adj: 0.2 },
    RF: { name: '우익수', def: 0.09, arm: 0.07, spd: 0.1, adj: -0.7 },
    LF: { name: '좌익수', def: 0.09, arm: 0.04, spd: 0.1, adj: -0.7 },
    '1B': { name: '1루수', def: 0.06, arm: 0.02, spd: 0.06, adj: -1.0 },
    DH: { name: '지명타자', def: 0, arm: 0, spd: 0.06, adj: -1.5 },
  };
  function fpos() { return FPOS[(S && S.fpos) || 'RF']; }
  function batOVR(b = S.bat) {
    const f = fpos();
    const rest = 1 - f.def - f.arm - f.spd;
    return Math.round(b.con * rest * 0.42 + b.pow * rest * 0.37 + b.eye * rest * 0.21 + b.spd * f.spd + b.def * f.def + b.arm * f.arm);
  }
  function pitOVR(p = S.pit) { return Math.round(velScore(p.vel) * 0.3 + p.ctl * 0.27 + p.stf * 0.25 + repScore(p.pitches) * 0.12 + p.sta * 0.06); }
  function ovr() {
    if (S.pos === 'B') return batOVR();
    if (S.pos === 'P') return pitOVR();
    return Math.max(batOVR(), pitOVR());
  }
  function perfMult() {
    let m = 1 - Math.max(0, S.fat - 55) / 220;
    m *= 0.96 + S.mental / 1250;
    return m;
  }
  function effBat() {
    const m = perfMult(), b = S.bat;
    return { con: b.con * m, pow: b.pow * m, eye: b.eye * m, spd: b.spd * m };
  }
  function effPit() {
    const m = perfMult(), p = S.pit;
    return { vel: p.vel - (1 - m) * 12, ctl: p.ctl * m, stf: p.stf * m, sta: p.sta, pitches: p.pitches };
  }
  const isBatter = () => S.pos !== 'P';
  const isPitcher = () => S.pos !== 'B';

  // ---------- 타석 모델 ----------
  function resolvePA(pBB, pK, pHR, pHit, pow, spd) {
    const r = Math.random();
    if (r < pBB) return 'BB';
    if (r < pBB + pK) return 'K';
    if (r < pBB + pK + pHR) return 'HR';
    if (Math.random() < pHit) {
      const t = Math.random();
      const p3 = clamp(0.02 + (spd - 50) * 0.0008, 0.005, 0.06);
      const p2 = clamp(0.2 + (pow - 50) * 0.002, 0.1, 0.32);
      if (t < p3) return '3B';
      if (t < p3 + p2) return '2B';
      return '1B';
    }
    return 'OUT';
  }
  function batPA(b, L) {
    const pBB = clamp(0.085 + (b.eye - L) * 0.0012, 0.025, 0.2);
    const pK = clamp(0.2 - (b.con - L) * 0.0025, 0.05, 0.42);
    const pHR = clamp(0.027 + (b.pow - L) * 0.0011, 0.002, 0.095);
    const pHit = clamp(0.3 + (b.con - L) * 0.0018 + (b.spd - 50) * 0.0006, 0.19, 0.43);
    return resolvePA(pBB, pK, pHR, pHit, b.pow, b.spd);
  }
  function pitPA(p, L) {
    const vs = velScore(p.vel), rep = repScore(p.pitches);
    const qK = vs * 0.45 + p.stf * 0.3 + rep * 0.25;
    const qHR = p.stf * 0.55 + p.ctl * 0.25 + vs * 0.2;
    const qH = p.stf * 0.4 + p.ctl * 0.3 + vs * 0.3;
    const pBB = clamp(0.085 + (L - p.ctl) * 0.0012, 0.025, 0.2);
    const pK = clamp(0.2 + (qK - L) * 0.0028, 0.05, 0.42);
    const pHR = clamp(0.027 + (L - qHR) * 0.00085, 0.005, 0.08);
    const pHit = clamp(0.3 + (L - qH) * 0.0012, 0.19, 0.42);
    return resolvePA(pBB, pK, pHR, pHit, L, 50);
  }
  const genericBat = (L) => ({ con: L, pow: L, eye: L, spd: 50 });

  // 주자 진루
  function advance(b, res, outs) {
    let r = 0, o = 0; const n = [0, 0, 0];
    if (res === 'BB') {
      if (b[0] && b[1] && b[2]) r++;
      n[0] = 1; n[1] = b[0] ? 1 : b[1]; n[2] = (b[0] && b[1]) ? 1 : b[2];
    } else if (res === '1B') {
      if (b[2]) r++;
      if (b[1]) { if (chance(0.6)) r++; else n[2] = 1; }
      if (b[0]) { if (!n[2] && chance(0.3)) n[2] = 1; else n[1] = 1; }
      n[0] = 1;
    } else if (res === '2B') {
      r += b[2] + b[1];
      if (b[0]) { if (chance(0.45)) r++; else n[2] = 1; }
      n[1] = 1;
    } else if (res === '3B') { r += b[0] + b[1] + b[2]; n[2] = 1; }
    else if (res === 'HR') { r += b[0] + b[1] + b[2] + 1; }
    else if (res === 'K') { o = 1; n[0] = b[0]; n[1] = b[1]; n[2] = b[2]; }
    else {
      o = 1;
      n[0] = b[0]; n[1] = b[1]; n[2] = b[2];
      if (outs < 2) {
        if (b[0] && chance(0.28)) { o = 2; n[0] = 0; }
        if (outs + o < 3) {
          if (b[2] && chance(0.38)) { r++; n[2] = 0; }
          if (b[1] && !n[2] && chance(0.4)) { n[2] = 1; n[1] = 0; }
        }
      }
    }
    return { b: n, r, o };
  }
  function simHalf(off, pit) {
    let o = 0, r = 0, b = [0, 0, 0], guard = 0;
    while (o < 3 && guard++ < 30) {
      const res = batPA(genericBat(off), pit);
      const a = advance(b, res, o); b = a.b; r += a.r; o += a.o;
    }
    return r;
  }
  // ---------- 시즌 차트 기록 ----------
  const PKEYS = Object.keys(PITCHES);
  function newChart() {
    if (S.chart && (S.chart.spray.length || S.chart.pitches.length)) S.chartPrev = Object.assign({ label: S.chart.label }, S.chart);
    S.chart = { label: `${S.year} ${S.phase === 'HS' ? '고교' : (LEVEL_LABEL[S.level] || '')}`, spray: [], pitches: [] };
  }
  function recOK() { return S && S.chart && !(S.wk && S.wk.postMode); }
  function gaussC() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function fenceDist(a) { return 99 + 23 * Math.cos(Math.abs(a) * Math.PI / 90); }
  // 타구: [각도(-45 좌측 ~ 45 우측), 거리(m), 결과(0아웃 1단타 2 2루타 3 3루타 4홈런), 타구질(0땅볼 1라이너 2뜬공 3팝업)]
  function recSpray(o) {
    if (!recOK() || !['1B', '2B', '3B', 'HR', 'OUT'].includes(o)) return;
    const side = S.bats === 'S' ? (chance(0.7) ? 'L' : 'R') : S.bats;
    const pull = side === 'R' ? -1 : 1;
    const bias = pull * (6 + (S.bat.pow - 45) * 0.25);
    const cl = (a) => clamp(a, -44, 44);
    let a, d, r, q;
    if (o === 'HR') { a = cl(bias * 1.4 + gaussC() * 15); d = fenceDist(a) + rnd(2, 24); r = 4; q = 2; }
    else if (o === '3B') { a = (chance(0.5) ? 1 : -1) * rnd(26, 44); d = rnd(95, 112); r = 3; q = 1; }
    else if (o === '2B') { a = (chance(0.6) ? Math.sign(pull) : -Math.sign(pull)) * rnd(12, 43); d = rnd(72, Math.min(102, fenceDist(a) - 4)); r = 2; q = chance(0.6) ? 1 : 2; }
    else if (o === '1B') {
      r = 1;
      if (chance(0.48)) { q = 0; a = cl(bias + gaussC() * 22); d = rnd(36, 52); }
      else { q = 1; a = cl(bias * 0.7 + gaussC() * 24); d = rnd(48, 74); }
    } else {
      r = 0; const t = Math.random();
      if (t < 0.44) { q = 0; a = cl(bias + gaussC() * 20); d = rnd(20, 37); }
      else if (t < 0.8) { q = 2; a = cl(bias * 0.6 + gaussC() * 24); d = rnd(62, Math.min(108, fenceDist(a) - 3)); }
      else if (t < 0.92) { q = 1; a = cl(bias + gaussC() * 22); d = rnd(28, 62); }
      else { q = 3; a = cl(gaussC() * 22); d = rnd(12, 34); }
    }
    S.chart.spray.push([Math.round(a), Math.round(d), r, q]);
    if (S.chart.spray.length > 900) S.chart.spray.shift();
  }
  // 투구: [u*100 (포수 시점 좌우), v*100 (위- 아래+), 구종번호, 결과(0볼 1스트라이크 2인플레이 3삼진 4볼넷)]
  function recPitches(p, res) {
    if (!recOK()) return;
    const n = Math.max(1, Math.round(PITCH_CNT[res] + rnd(-0.9, 0.9)));
    const types = Object.keys(p.pitches);
    const w = types.map((k) => (k === 'FF' ? 3.5 : 0.8 + p.pitches[k] * 0.55));
    const tot = w.reduce((x, y) => x + y, 0);
    const pickType = () => { let r = Math.random() * tot; for (let i = 0; i < types.length; i++) { r -= w[i]; if (r <= 0) return types[i]; } return types[0]; };
    const ctl = p.ctl;
    const pz = clamp(0.33 + ctl * 0.0018, 0.33, 0.52);
    const sig = 0.3 * (1.3 - ctl / 100);
    const hand = S.throws === 'L' ? -1 : 1;
    for (let i = 0; i < n; i++) {
      const last = i === n - 1;
      let t = pickType();
      if (last && res === 'K' && types.length > 1 && chance(0.5)) t = types.filter((k) => k !== 'FF').sort((a, b) => p.pitches[b] - p.pitches[a])[0];
      const brk = !PITCHES[t].fast;
      let code, inZone;
      if (last) {
        if (res === 'BB') { inZone = false; code = 4; }
        else if (res === 'K') { inZone = chance(brk ? 0.45 : 0.7); code = 3; }
        else if (res === 'OUT' || res === '1B' || res === '2B' || res === '3B' || res === 'HR') { inZone = chance(res === 'HR' ? 0.9 : 0.8); code = 2; }
        else { inZone = chance(pz); code = inZone ? 1 : 0; }
      } else { inZone = chance(pz); code = inZone ? 1 : (chance(0.28) ? 1 : 0); }
      let u, v;
      if (inZone) {
        u = (chance(0.5) ? 1 : -1) * Math.pow(Math.random(), 0.65) * 0.95;
        v = (chance(0.5) ? 1 : -1) * Math.pow(Math.random(), 0.65) * 0.95;
      } else {
        const side = Math.floor(Math.random() * 4);
        u = side < 2 ? (side ? 1 : -1) * rnd(1.06, 1.65) : rnd(-1.1, 1.1);
        v = side >= 2 ? (side === 2 ? 1 : -1) * rnd(1.06, 1.6) : rnd(-1.1, 1.1);
      }
      if (brk) v += 0.35 + (t === 'CU' || t === 'FS' ? 0.2 : 0);
      if (t === 'SL' || t === 'SW') u += 0.25 * hand;
      if (t === 'SI' || t === 'CH') u -= 0.2 * hand;
      if (t === 'FF') v -= 0.15;
      u += gaussC() * sig; v += gaussC() * sig;
      if (inZone && code >= 1) { u = clamp(u, -1, 1); v = clamp(v, -1, 1); }
      if (code === 4 || (code === 0)) { if (Math.abs(u) <= 1 && Math.abs(v) <= 1) { if (Math.abs(u) > Math.abs(v)) u = Math.sign(u || 1) * rnd(1.05, 1.4); else v = Math.sign(v || 1) * rnd(1.05, 1.4); } }
      S.chart.pitches.push([Math.round(clamp(u, -1.9, 1.9) * 100), Math.round(clamp(v, -1.9, 1.9) * 100), PKEYS.indexOf(t), code]);
    }
    if (S.chart.pitches.length > 4500) S.chart.pitches.splice(0, S.chart.pitches.length - 4500);
  }
  function simDerby() {
    const p = S.bat.pow;
    let hr = 0, outs = 0;
    while (outs < 10) { if (chance(clamp(0.18 + (p - 50) * 0.012, 0.08, 0.7))) hr++; else outs++; }
    return hr;
  }

  const PITCH_CNT = { K: 4.8, BB: 5.7, HR: 3.1, '1B': 3.4, '2B': 3.4, '3B': 3.4, OUT: 3.3 };
  function simOuting(p, L, limit, fromInning = 1, pitches = 0) {
    const t = { outs: 0, ER: 0, H: 0, BB: 0, SO: 0, HR: 0, pitches };
    let inning = fromInning;
    while (inning <= 9) {
      let o = 0, b = [0, 0, 0], r = 0, guard = 0;
      while (o < 3 && guard++ < 30) {
        const res = pitPA(p, L);
        recPitches(p, res);
        t.pitches += PITCH_CNT[res] + rnd(-0.8, 0.8);
        if (res === 'K') t.SO++; else if (res === 'BB') t.BB++; else if (res !== 'OUT') { t.H++; if (res === 'HR') t.HR++; }
        const a = advance(b, res, o); b = a.b; r += a.r; o += a.o;
        if (t.pitches > limit + 18) break;
      }
      t.outs += Math.min(o, 3); t.ER += r;
      if (o < 3) { t.ER += Math.round((b[0] + b[1] + b[2]) * 0.4); break; }
      inning++;
      if (t.pitches >= limit || (r >= 4 && t.ER >= 5)) break;
    }
    t.lastInning = inning - 1;
    return t;
  }

  // ---------- 상태 ----------
  function blankStats() {
    return { G: 0, PA: 0, AB: 0, H: 0, D: 0, T: 0, HR: 0, RBI: 0, R: 0, BB: 0, SO: 0, SB: 0, PG: 0, GS: 0, OUTS: 0, PH: 0, ER: 0, PBB: 0, PSO: 0, PHR: 0, W: 0, L: 0, SV: 0, HLD: 0 };
  }
  function rollTalent(pos) {
    const pot = Math.round(clamp(62 + gaussR() * 11, 52, 97));
    const base = () => Math.round(rnd(18, 30) + (pot - 60) * 0.15);
    const caps = {};
    ['con', 'pow', 'eye', 'spd', 'def', 'arm', 'ctl', 'stf', 'sta'].forEach((k) => (caps[k] = Math.round(clamp(pot + rnd(-7, 6), 45, 99))));
    caps.vel = Math.round(clamp(138 + (pot - 55) * 0.5 + rnd(-3, 4), 138, 163));
    const breaking = pick(['SL', 'CU', 'CH']);
    return {
      pot, caps,
      bat: { con: base(), pow: base(), eye: base(), spd: Math.round(rnd(30, 55)), def: base(), arm: base() },
      pit: { vel: Math.round(rnd(124, 133) + (pot - 60) * 0.12), ctl: base(), stf: base(), sta: Math.round(rnd(30, 42)), pitches: { FF: 2, [breaking]: 1 } },
    };
  }
  function gaussR() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  function newGame(o) {
    const t = o.talent;
    S = {
      v: 1, name: o.name, num: o.num || ri(1, 99), pos: o.pos, throws: o.throws, bats: o.bats, fpos: o.fpos || 'RF',
      look: o.look, school: o.school,
      year: 2027, week: 8, age: 16, phase: 'HS', grade: 1,
      team: null, level: null,
      pot: t.pot, caps: t.caps, bat: t.bat, pit: t.pit,
      fat: 10, mental: 60, fame: 0, money: 0,
      house: 'home', houses: ['home'], cars: [], car: null,
      contract: null, service: 0, mlbService: 0, levelWeeks: 0, topWeeks: 0,
      st: blankStats(), career: [], awards: [], trophies: [],
      rel: {}, partner: null, spouse: null, engaged: false, ring: false, weddingWeek: null,
      log: [], pending: [], flags: {}, injury: 0, injCount: 0,
      hs: { tourn: null, scoutK: 5, scoutM: 0, draftDone: false, path: null },
      teams: {}, teamRec: { w: 0, l: 0 }, rot: 0, recent: [],
      post: null, contactWeek: {}, lastDate: {}, hof: false,
      settings: { diff: 1, sound: true, askKey: true },
      stats: { weeks: 0 },
    };
    S.hs.tourn = null;
    newChart();
    addLog(`${SCHOOLS[S.school].name} 야구부에 입부했다! 꿈을 향한 첫걸음.`);
    S.pending.push({ type: 'msg', data: { title: '야구부 입부', icon: 'ball', text: `${S.name}, ${SCHOOLS[S.school].name} 1학년.\n\n매주 훈련과 휴식을 고르면서 실력을 키우세요. 대회 8강부터는 직접 타석과 마운드에 설 수 있습니다.\n\n3학년 가을, KBO 신인 드래프트에 나가거나 메이저리그 구단과 바로 계약할 수 있어요.` } });
    save();
    return S;
  }
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* 저장 실패 무시 */ } }
  function load() {
    try { const s = localStorage.getItem(SAVE_KEY); if (!s) return null; S = JSON.parse(s); if (!S.chart) newChart(); if (!S.fpos) S.fpos = 'RF'; return S; } catch (e) { return null; }
  }
  function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } }
  function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* */ } S = null; }
  function addLog(t) { S.log.unshift({ d: dateStr(), t }); if (S.log.length > 60) S.log.length = 60; }

  // ---------- 팀/구장 정보 ----------
  function teamInfo(id) { return KBO_TEAMS.find((t) => t.id === id) || MLB_TEAMS.find((t) => t.id === id); }
  function myColors() {
    if (S.phase === 'HS') { const s = SCHOOLS[S.school]; return { c1: s.c1, c2: s.c2, name: s.name, short: s.name, park: s.name + ' 운동장' }; }
    const t = teamInfo(S.team);
    return { c1: t.c1, c2: t.c2, name: t.name, short: t.short || t.id, park: t.park };
  }
  function affiliation() {
    if (S.phase === 'HS') return `${SCHOOLS[S.school].name} ${S.grade}학년`;
    if (S.phase === 'RETIRED') return '은퇴';
    return `${teamInfo(S.team).name} · ${LEVEL_LABEL[S.level]}`;
  }
  function league() { return S.phase === 'MLB' ? 'MLB' : 'KBO'; }
  function seasonCfg() { return SEASON[league()]; }
  function inRegular() {
    if (S.phase === 'HS' || S.phase === 'RETIRED') return false;
    const c = seasonCfg();
    return S.week >= c.reg[0] && S.week <= c.reg[1];
  }
  function isOffseason() {
    if (S.phase === 'HS') return S.week >= 40 || S.week < 8;
    const c = seasonCfg();
    return S.week > c.post[1] || S.week < c.reg[0] - 1;
  }

  // ---------- 역할 ----------
  function batRole() {
    if (!isBatter()) return null;
    if (S.phase === 'HS') return 'starter';
    const thr = S.level === 'KBO1' ? 56 : S.level === 'MLB' ? 63 : 0;
    return batOVR() >= thr ? 'starter' : 'bench';
  }
  function pitRole() {
    if (!isPitcher()) return null;
    if (S.phase === 'HS') return 'SP';
    const thr = S.level === 'KBO1' ? 57 : S.level === 'MLB' ? 63 : 0;
    const o = pitOVR();
    if (S.pit.sta >= (S.pos === 'TW' ? 45 : 50) && o >= thr) return 'SP';
    if (o >= thr + 8 && S.pit.stf >= 60) return 'CL';
    return 'RP';
  }
  function roleLabel() {
    const r = [];
    const br = batRole(), pr = pitRole();
    if (br) r.push((br === 'starter' ? '주전 ' : '백업 ') + fpos().name);
    if (pr) r.push({ SP: '선발 투수', RP: '불펜 투수', CL: '마무리 투수' }[pr]);
    return r.join(' / ');
  }

  // ---------- 행동 ----------
  const TRAININGS = [
    { id: 'con', name: '타격 훈련', attr: 'con', for: 'B', desc: '컨택 ↑' },
    { id: 'pow', name: '웨이트 트레이닝', attr: 'pow', for: 'B', desc: '파워 ↑', extra: 'sta' },
    { id: 'eye', name: '선구안 훈련', attr: 'eye', for: 'B', desc: '선구안 ↑' },
    { id: 'spd', name: '주루 훈련', attr: 'spd', for: 'B', desc: '주력 ↑' },
    { id: 'def', name: '수비 훈련', attr: 'def', for: 'B', desc: '수비 ↑, 송구 ↑', extra: 'arm' },
    { id: 'vel', name: '구속 훈련', attr: 'vel', for: 'P', desc: '구속 ↑' },
    { id: 'ctl', name: '제구 훈련', attr: 'ctl', for: 'P', desc: '제구 ↑' },
    { id: 'stf', name: '구위 훈련', attr: 'stf', for: 'P', desc: '구위 ↑' },
    { id: 'sta', name: '체력 훈련', attr: 'sta', for: 'P', desc: '스태미나 ↑' },
    { id: 'pitch', name: '변화구 연마', attr: 'pitch', for: 'P', desc: '구종 레벨 ↑ / 신구종' },
  ];
  function trainingList() {
    return TRAININGS.filter((t) => (t.for === 'B' ? isBatter() : isPitcher()));
  }
  function ageMult() {
    const a = S.age;
    if (a <= 20) return 1.15; if (a <= 24) return 1.0; if (a <= 28) return 0.72; if (a <= 31) return 0.42; return 0.22;
  }
  function growAttr(k, mult) {
    if (k === 'vel') {
      const cap = S.caps.vel, cur = S.pit.vel;
      const f = clamp((cap - cur) / 12, 0.05, 1.2);
      const g = rnd(0.35, 0.95) * f * mult;
      S.pit.vel = Math.min(cap + 1, +(cur + g).toFixed(1));
      return +(S.pit.vel - cur).toFixed(1);
    }
    const obj = ['ctl', 'stf', 'sta'].includes(k) ? S.pit : S.bat;
    const cap = S.caps[k], cur = obj[k];
    const f = clamp((cap - cur) / 28, 0.06, 1.2);
    const g = rnd(1.1, 2.5) * f * mult;
    obj[k] = Math.min(99, +(cur + g).toFixed(1));
    return +(obj[k] - cur).toFixed(1);
  }
  function trainMult() {
    let m = ageMult();
    if (S.fat > 70) m *= 0.55; else if (S.fat > 50) m *= 0.82;
    m *= 0.9 + S.mental / 500;
    const c = S.phase !== 'HS' && S.phase !== 'RETIRED' ? seasonCfg() : null;
    if (c && S.week >= c.camp[0] && S.week <= c.camp[1]) m *= 1.3;
    if (S.phase === 'HS' && (S.week >= 44 || S.week < 8)) m *= 1.15;
    return m;
  }
  const PITCH_ORDER = ['SL', 'CU', 'CH', 'FS', 'FC', 'SI', 'SW'];
  function doTraining(id, sub, lesson) {
    const out = [];
    const m = trainMult() * (lesson ? 1.8 : 1);
    if (id === 'pitch') {
      let k = sub;
      if (!k || !S.pit.pitches[k]) {
        if (k && !S.pit.pitches[k]) {
          const cnt = Object.keys(S.pit.pitches).length;
          const p = clamp(0.55 - cnt * 0.07 + (S.pot - 60) * 0.006, 0.12, 0.8) * (lesson ? 1.4 : 1);
          if (chance(p)) { S.pit.pitches[k] = 1; out.push(`새 구종 ${PITCHES[k].name} 습득!`); }
          else out.push(`${PITCHES[k].name} 연습... 아직 감이 오지 않는다.`);
        }
      } else {
        const lv = S.pit.pitches[k];
        const p = clamp((7 - lv) / 7 * 0.75 * m, 0.08, 0.95);
        if (lv < 7 && chance(p)) { S.pit.pitches[k] = lv + 1; out.push(`${PITCHES[k].name} 레벨 ${lv + 1}!`); }
        else out.push(`${PITCHES[k].name} 다듬는 중...`);
      }
      const g = growAttr('stf', m * 0.35);
      if (g > 0) out.push(`구위 +${g}`);
    } else {
      const t = TRAININGS.find((x) => x.id === id);
      const g = growAttr(t.attr, m);
      out.push(`${ATTR_NAME[t.attr]} +${g}${t.attr === 'vel' ? 'km/h' : ''}`);
      if (t.extra) { const g2 = growAttr(t.extra, m * 0.5); out.push(`${ATTR_NAME[t.extra]} +${g2}`); }
    }
    S.fat = clamp(S.fat + (lesson ? 18 : 13) + rnd(-2, 2), 0, 100);
    if (S.fat > 78 && chance(0.09)) out.push(injure(ri(1, 3)));
    return out;
  }
  const ATTR_NAME = { con: '컨택', pow: '파워', eye: '선구안', spd: '주력', def: '수비', arm: '송구', vel: '구속', ctl: '제구', stf: '구위', sta: '스태미나' };

  function injure(weeks) {
    S.injury = Math.max(S.injury, weeks);
    S.injCount++;
    S.mental = clamp(S.mental - 6, 0, 100);
    if (S.phase !== 'HS' && !S.rel.seoyun) S.flags.meetSeoyun = true;
    addLog(`부상! ${weeks}주 동안 경기와 훈련이 어렵다.`);
    return `부상 발생! (${weeks}주 결장)`;
  }

  function actions() {
    const pro = S.phase !== 'HS';
    const list = [
      { id: 'train', name: '훈련', icon: 'train', sub: '능력치를 키운다', disabled: S.injury > 0 ? '부상 중' : null },
      { id: 'rest', name: '휴식', icon: 'rest', sub: '피로 회복, 멘탈 회복' },
    ];
    if (pro) {
      list.push({ id: 'lesson', name: '개인 레슨', icon: 'star', sub: `효과 1.8배 · ${won(lessonCost())}`, disabled: S.injury > 0 ? '부상 중' : (S.money < lessonCost() ? '돈 부족' : null) });
      list.push({ id: 'ad', name: '광고 촬영', icon: 'coin', sub: S.fame >= 25 ? `수입 약 ${won(adIncome())}` : '인기 25 이상', disabled: S.fame < 25 ? '인기 부족' : null });
      list.push({ id: 'fan', name: '팬 서비스', icon: 'heart', sub: '인기 ↑ 멘탈 ↑' });
    } else {
      list.push({ id: 'video', name: '영상 분석', icon: 'chart', sub: '선구안/제구 소폭 ↑, 피로 적음' });
      list.push({ id: 'study', name: '공부', icon: 'cal', sub: '멘탈 ↑ (부모님이 좋아한다)' });
    }
    return list;
  }
  const lessonCost = () => (S.phase === 'MLB' ? 15000000 : 5000000);
  const adIncome = () => Math.round(Math.pow(S.fame, 1.6) * 200000 * (S.phase === 'MLB' ? 2 : 1) / 1e4) * 1e4;

  // ---------- 주간 진행 ----------
  // planWeek: 행동 적용 + 경기 일정 생성, 중요 경기가 있으면 key 반환
  function planWeek(act, sub) {
    const W = { act, lines: [], gains: [], games: [], key: null, money0: S.money, fame0: S.fame };
    S.wk = W;
    applyAction(act, sub, W);
    buildWeekGames(W);
    return W.key;
  }
  function applyAction(act, sub, W) {
    if (act === 'train') { W.gains = doTraining(sub.id, sub.pitch, false); W.lines.push(`${sub.name}`); }
    else if (act === 'lesson') {
      S.money -= lessonCost(); W.gains = doTraining(sub.id, sub.pitch, true); W.lines.push(`개인 레슨: ${sub.name}`);
    } else if (act === 'rest') {
      const h = HOUSES.find((x) => x.id === S.house);
      S.fat = clamp(S.fat - 34 - h.cond, 0, 100); S.mental = clamp(S.mental + 6, 0, 100);
      W.gains = ['피로 크게 회복', '멘탈 +6'];
      if (S.injury > 0) { S.injury = Math.max(0, S.injury - 1); W.gains.push('재활 진행'); }
      W.lines.push('휴식');
    } else if (act === 'video') {
      if (isBatter()) W.gains.push(`선구안 +${growAttr('eye', trainMult() * 0.55)}`);
      if (isPitcher()) W.gains.push(`제구 +${growAttr('ctl', trainMult() * 0.55)}`);
      S.fat = clamp(S.fat + 3, 0, 100); W.lines.push('영상 분석');
    } else if (act === 'study') {
      S.mental = clamp(S.mental + 10, 0, 100); S.fat = clamp(S.fat - 12, 0, 100);
      W.gains = ['멘탈 +10', '피로 소폭 회복']; W.lines.push('공부');
    } else if (act === 'ad') {
      const inc = adIncome(); S.money += inc; S.fame = clamp(S.fame + 1, 0, 100); S.fat = clamp(S.fat + 5, 0, 100);
      W.gains = [`광고 수입 +${won(inc)}`, '인기 +1']; W.lines.push('광고 촬영');
    } else if (act === 'fan') {
      S.fame = clamp(S.fame + 3, 0, 100); S.mental = clamp(S.mental + 5, 0, 100); S.fat = clamp(S.fat + 2, 0, 100);
      W.gains = ['인기 +3', '멘탈 +5']; W.lines.push('팬 사인회');
    } else if (act === 'date') {
      const r = doDate(sub.hid, sub.place);
      W.gains = r.gains; W.lines.push(`데이트: ${r.place}`); W.dateLine = r.line; W.dateHid = sub.hid;
    }
  }

  // 주간 경기 생성
  function buildWeekGames(W) {
    W.ctx = null;
    if (S.injury > 0) S.injury = Math.max(0, S.injury - 1);
    if (S.phase === 'HS') return buildHSWeek(W);
    if (S.phase === 'RETIRED') return;
    const c = seasonCfg();
    if (S.week >= c.reg[0] && S.week <= c.reg[1]) return buildRegWeek(W, c);
    if (S.week >= c.post[0] && S.week <= c.post[1]) return buildPostWeek(W, c);
  }

  function hsTeamLevels(oppStr) {
    const sc = SCHOOLS[S.school];
    const myImpact = (ovr() - 45) * 0.25;
    const our = 36 + (sc.str - 60) * 0.35 + myImpact * 0.2;
    const their = 36 + (oppStr - 60) * 0.35;
    return { teamOff: our, teamPit: our, oppOff: their, oppPit: their };
  }
  function buildHSWeek(W) {
    const cal = HS_CAL[S.week];
    if (!cal) return;
    if (S.grade === 3 && S.hs.path === 'MLB' && S.week >= 32) return;
    const games = [];
    if (cal.t === 'league') {
      for (let i = 0; i < 2; i++) {
        const oppSc = pick(SCHOOLS.filter((s, j) => j !== S.school));
        games.push({ kind: 'hs', label: `주말리그 vs ${oppSc.name}`, opp: { name: oppSc.name, c1: oppSc.c1, c2: oppSc.c2 }, L: 40 + rnd(-2, 3), lv: hsTeamLevels(oppSc.str + rnd(-5, 5)) });
      }
    } else {
      if (cal.start) S.hs.tourn = { name: cal.name, round: cal.short ? 3 : 0, alive: true };
      const T = S.hs.tourn;
      if (!T || !T.alive) return;
      const n = cal.short ? 3 : 2;
      for (let i = 0; i < n && T.round + i < ROUNDS.length; i++) {
        const rd = T.round + i;
        const oppSc = pick(SCHOOLS.filter((s, j) => j !== S.school));
        const oppStr = 62 + rd * 2.8 + rnd(-5, 5);
        games.push({ kind: 'tourn', round: rd, label: `${T.name} ${ROUNDS[rd]} vs ${oppSc.name}`, opp: { name: oppSc.name, c1: oppSc.c1, c2: oppSc.c2 }, L: 41 + rd * 1.6, lv: hsTeamLevels(oppStr), key: rd >= 3 });
      }
    }
    W.games = games;
    const ki = games.findIndex((g) => g.key);
    if (ki >= 0 && S.injury === 0) {
      // 중요 경기 전에 열리는 경기는 미리 결과를 낸다 (지면 중요 경기 없음)
      let alive = true;
      for (let i = 0; i < ki; i++) { games[i].pre = simGame(games[i]); if (cal.t === 'tourn' && !games[i].pre.win) alive = false; }
      if (alive) W.key = keyInfo(games[ki], ki); else games[ki].key = false;
    } else games.forEach((g) => (g.key = false));
  }

  function ensureTeams() {
    if (S.phase === 'KBO' && (!S.teams || !S.teams.LG)) {
      S.teams = {};
      KBO_TEAMS.forEach((t) => (S.teams[t.id] = { str: rnd(54, 66), w: 0, l: 0, d: 0 }));
    }
  }
  function myTeamLevels(oppStr) {
    if (S.phase === 'KBO') {
      const my = S.level === 'KBO1' ? S.teams[S.team].str : 48;
      const op = S.level === 'KBO1' ? oppStr : 48 + rnd(-3, 3);
      return { teamOff: my, teamPit: my, oppOff: op, oppPit: op };
    }
    const L = LEVEL_L[S.level];
    const my = S.level === 'MLB' ? S.teamStr : L;
    const op = S.level === 'MLB' ? oppStr : L + rnd(-3, 3);
    return { teamOff: my, teamPit: my, oppOff: op, oppPit: op };
  }
  function buildRegWeek(W, c) {
    ensureTeams();
    const games = [];
    const gpw = 6;
    const top = S.level === 'KBO1' || S.level === 'MLB';
    for (let i = 0; i < gpw; i++) {
      let opp, oppStr;
      if (S.phase === 'KBO') {
        const ot = pick(KBO_TEAMS.filter((t) => t.id !== S.team));
        opp = { id: ot.id, name: ot.name, c1: ot.c1, c2: ot.c2, park: ot.park };
        oppStr = S.teams[ot.id].str;
      } else {
        const ot = pick(MLB_TEAMS.filter((t) => t.id !== S.team));
        opp = S.level === 'MLB' ? { id: ot.id, name: ot.name, c1: ot.c1, c2: ot.c2, park: ot.park } : { name: ot.name.split(' ').pop() + ' 산하 ' + LEVEL_LABEL[S.level], c1: ot.c1, c2: ot.c2 };
        oppStr = S.level === 'MLB' ? rnd(62, 72) : LEVEL_L[S.level];
      }
      const L = S.level === 'KBO1' ? oppStr : S.level === 'MLB' ? 67 + (oppStr - 67) * 0.5 : LEVEL_L[S.level] + rnd(-2, 2);
      games.push({ kind: 'reg', label: `vs ${opp.name}`, opp, L, lv: myTeamLevels(oppStr) });
    }
    W.games = games;
    if (top && S.injury === 0 && c.keys.includes(S.week)) {
      const isOpen = S.week === c.reg[0];
      const g = games[0];
      g.key = true;
      g.title = isOpen ? '개막전' : (S.week === c.reg[1] ? '정규시즌 최종전' : pick(['라이벌전', '주말 빅매치', '순위 싸움 맞대결', '매진된 홈경기']));
      W.key = keyInfo(g, 0);
    }
    if (S.level === 'MLB' && !S.flags.mlbDebut && S.injury === 0) {
      S.flags.mlbDebut = true;
      games[0].key = true; games[0].title = '메이저리그 데뷔전';
      W.key = keyInfo(games[0], 0);
    }
  }

  // ---------- 포스트시즌 ----------
  function buildPostWeek(W, c) {
    const P = S.post;
    if (!P || !P.alive) return;
    const idx = S.week - c.post[0];
    const rounds = P.rounds.filter((r) => r.week === idx);
    if (!rounds.length) return;
    W.post = [];
    const games = [];
    rounds.forEach((r) => {
      const opp = teamInfo(r.opp) || { name: r.oppName, c1: '#444', c2: '#999' };
      for (let i = 0; i < r.maxGames; i++) {
        const oppStr = S.phase === 'KBO' ? S.teams[r.opp].str : rnd(66, 72);
        games.push({ kind: 'post', round: r, label: `${r.name} vs ${opp.name}`, opp: { id: r.opp, name: opp.name, c1: opp.c1, c2: opp.c2, park: opp.park }, L: S.phase === 'KBO' ? oppStr : 69, lv: myTeamLevels(oppStr), title: r.name });
      }
    });
    W.games = games;
    W.postMode = true;
    // 결승 시리즈: 한 팀이 우승까지 1승 남았을 때 다음 경기를 직접 플레이
    const finalR = rounds.find((r) => r.final);
    if (finalR && S.injury === 0) {
      W.preSim = true;
      preSimFinal();
    }
  }

  function keyInfo(g, idx) {
    const pr = pitRole(), br = batRole();
    let mode;
    const pitchDay = pr === 'SP' ? true : pr ? chance(0.7) : false;
    if (br === 'starter' && pitchDay && S.pos === 'TW') mode = 'both';
    else if (pr && (pitchDay || !br)) mode = 'pitch';
    else mode = 'bat';
    if (mode === 'bat' && br === 'bench') mode = 'bat';
    return { idx, mode, title: g.title || g.label, label: g.label, opp: g.opp, g };
  }

  // 일반 경기 시뮬
  function simGame(g, forcePitch) {
    const lv = g.lv;
    const res = { bat: blankStats(), pit: null, ours: 0, theirs: 0 };
    let ours = 0;
    for (let i = 0; i < 9; i++) ours += simHalf(lv.teamOff, lv.oppPit);
    ours = Math.round(ours * (isBatter() ? 0.88 : 1));
    const br = batRole(), pr = pitRole();
    // 이도류: 6경기마다 선발, 등판 다음날은 타석 휴식
    let start = false, relief = false;
    if (pr) {
      S.rot = (S.rot || 0) + 1;
      if (pr === 'SP') start = forcePitch || S.rot % (S.phase === 'HS' ? 2 : S.pos === 'TW' ? 6 : 5) === 0;
      else relief = forcePitch || chance(pr === 'CL' ? 0.42 : 0.45);
    }
    let bats = br && !(S.pos === 'TW' && S.phase !== 'HS' && S.rot % 6 === 1);
    if (br === 'bench') bats = chance(0.45);
    if (bats) {
      const n = br === 'starter' ? (chance(0.25) ? 5 : chance(0.75) ? 4 : 3) : 1;
      const b = effBat();
      const t = res.bat; t.G = 1;
      let base = [0, 0, 0];
      for (let i = 0; i < n; i++) {
        const o = batPA(b, g.L);
        recSpray(o);
        tallyBat(t, o);
        base = [chance(0.32) ? 1 : 0, chance(0.2) ? 1 : 0, chance(0.12) ? 1 : 0];
        const a = advance(base, o, ri(0, 2));
        t.RBI += o === 'K' ? 0 : a.r;
        ours += a.r;
        if (['1B', '2B', '3B', 'BB'].includes(o)) {
          if (o === '1B' || o === 'BB') { if (b.spd > 55 && chance((b.spd - 50) * 0.004)) t.SB++; }
          if (chance(o === '3B' ? 0.7 : o === '2B' ? 0.5 : 0.32)) { t.R++; ours++; }
        }
        if (o === 'HR') t.R++;
      }
    }
    let theirs = 0;
    if (start) {
      const limit = S.phase === 'HS' ? 100 : 72 + S.pit.sta * 0.45;
      const ot = simOuting(effPit(), g.L, limit);
      res.pit = Object.assign(blankStats(), { PG: 1, GS: 1, OUTS: ot.outs, PH: ot.H, ER: ot.ER, PBB: ot.BB, PSO: ot.SO, PHR: ot.HR });
      theirs = ot.ER;
      const rem = 9 - Math.ceil(ot.outs / 3);
      for (let i = 0; i < rem; i++) theirs += simHalf(lv.oppOff, lv.teamPit);
      if (ours === theirs) ours += chance(0.5) ? 1 : 0, theirs += ours === theirs ? 1 : 0;
      if (ours > theirs && ot.outs >= 15 && ot.ER < ours) res.pit.W = 1;
      else if (ours < theirs && ot.ER > ours - 0) res.pit.L = 1;
      res.pit.pitches = ot.pitches;
    } else {
      for (let i = 0; i < 9; i++) theirs += simHalf(lv.oppOff, lv.teamPit);
      if (relief) {
        const lead = ours - theirs;
        const ot = simOuting(effPit(), g.L, 25, 9);
        const outs = Math.min(3, ot.outs);
        res.pit = Object.assign(blankStats(), { PG: 1, OUTS: outs, PH: ot.H, ER: ot.ER, PBB: ot.BB, PSO: ot.SO, PHR: ot.HR });
        theirs += ot.ER;
        if (pr === 'CL' && lead >= 1 && lead <= 3) {
          if (ot.ER < lead) res.pit.SV = 1; else if (ot.ER > lead) res.pit.L = 1;
        } else if (pr === 'RP' && lead >= 1 && lead <= 3 && ot.ER < lead && chance(0.5)) res.pit.HLD = 1;
      }
    }
    if (ours === theirs) { if (chance(0.5)) ours++; else theirs++; }
    res.ours = ours; res.theirs = theirs; res.win = ours > theirs;
    return res;
  }
  function simTeamOnly(g) {
    let ours = 0, theirs = 0;
    for (let i = 0; i < 9; i++) { ours += simHalf(g.lv.teamOff, g.lv.oppPit); theirs += simHalf(g.lv.oppOff, g.lv.teamPit); }
    if (ours === theirs) { if (chance(0.5)) ours++; else theirs++; }
    return { bat: null, pit: null, ours, theirs, win: ours > theirs };
  }
  function tallyBat(t, o) {
    t.PA++;
    if (o === 'BB') { t.BB++; return; }
    t.AB++;
    if (o === 'K') t.SO++;
    else if (o !== 'OUT') { t.H++; if (o === '2B') t.D++; if (o === '3B') t.T++; if (o === 'HR') { t.HR++; } }
  }
  function addStats(dst, src) { if (!src) return; Object.keys(src).forEach((k) => { if (typeof src[k] === 'number' && k in dst) dst[k] += src[k]; }); }

  // ---------- 직접 플레이 설정 ----------
  function makeOppPitcher(L, name) {
    const ph = shuffle(PITCH_ORDER.slice(0, 6)).slice(0, ri(2, 4));
    const pitches = { FF: 4 };
    ph.forEach((k) => (pitches[k] = ri(2, 6)));
    const baseVel = S.phase === 'HS' ? 128 + (L - 38) * 0.9 : 138 + (L - 55) * 0.8;
    return { name: name || (S.phase === 'MLB' ? enName() : krName()), throws: chance(0.72) ? 'R' : 'L', vel: Math.round(clamp(baseVel + rnd(-3, 6), 120, 163)), ctl: L + rnd(-6, 6), stf: L + rnd(-6, 6), pitches };
  }
  function makeOppBatter(L) {
    return { name: S.phase === 'MLB' ? enName() : krName(), bats: chance(0.65) ? 'R' : 'L', con: L + rnd(-8, 8), pow: L + rnd(-10, 10), eye: L + rnd(-8, 8) };
  }
  function keyScript(K) {
    const g = K.g, lv = g.lv;
    const home = g.kind === 'post' ? chance(0.5) : chance(0.55);
    const ours = [], theirs = [];
    for (let i = 0; i < 9; i++) { ours.push(simHalf(lv.teamOff, lv.oppPit)); theirs.push(simHalf(lv.oppOff, lv.teamPit)); }
    const segs = [];
    const pr = pitRole();
    const pitchInn = K.mode === 'bat' ? [] : (pr === 'SP' ? [1, 2] : pr === 'CL' ? [9] : [ri(6, 8)]);
    const batInn = K.mode === 'pitch' ? [] : [1, 3, 6, 8];
    pitchInn.forEach((inn) => (theirs[inn - 1] = 0));
    const clutch = K.mode !== 'pitch' && home && chance(0.4);
    const freeInn = [3, 4, 5, 6, 7].filter((i) => !pitchInn.includes(i + 1));
    if (clutch) {
      batInn[3] = 9;
      const before = (arr, n) => arr.slice(0, n).reduce((a, b) => a + b, 0);
      const t9 = before(theirs, 9), o8 = before(ours, 8);
      const diff = t9 - o8;
      if (diff !== 1) {
        // 9회말 1점 차로 뒤진 상황을 만든다
        const need = o8 + 1 - t9;
        if (need > 0) theirs[pick(freeInn)] += need; else ours[ri(1, 7)] += (-need);
      }
      ours[8] = 0;
    }
    pitchInn.forEach((inn) => {
      segs.push({ type: 'pitch', inning: inn, top: home, outs: 0, bases: [0, 0, 0], batters: Array.from({ length: 6 }, () => makeOppBatter(g.L)) });
      theirs[inn - 1] = 0;
    });
    batInn.forEach((inn, i) => {
      const lastClutch = clutch && i === 3;
      const outs = lastClutch ? 2 : ri(0, 2);
      const bases = lastClutch ? [1, 1, 0] : [chance(0.35) ? 1 : 0, chance(0.22) ? 1 : 0, chance(0.12) ? 1 : 0];
      segs.push({ type: 'bat', inning: inn, top: !home, outs, bases, pitcher: makeOppPitcher(g.L), clutch: lastClutch });
    });
    // 시간 순서 정렬 + 진행 중 점수 계산 (플레이어 결과는 Play에서 반영)
    segs.sort((a, b) => a.inning - b.inning || ((a.top ? 0 : 1) - (b.top ? 0 : 1)));
    segs.forEach((s) => {
      // 이 하프이닝 시작 전까지의 점수
      let o = 0, t = 0;
      for (let i = 0; i < s.inning - 1; i++) { o += ours[i]; t += theirs[i]; }
      if (s.top !== home) {
        // 우리 공격: 상대가 먼저 공격한 경우(우리가 홈) 이번 이닝 상대 점수 포함
        if (home) t += theirs[s.inning - 1];
      } else if (!home) o += ours[s.inning - 1];
      s.ours = o; s.theirs = t;
    });
    return { home, ours, theirs, segs, pitchInn };
  }
  function keyPlayOptions(K) {
    const sc = keyScript(K);
    K.script = sc;
    const me = myColors();
    const opp = K.opp;
    const night = S.phase !== 'HS';
    return {
      mode: K.mode, title: K.title, segs: sc.segs, home: sc.home,
      my: { name: me.short || me.name, c1: me.c1, c2: me.c2 },
      opp: { name: opp.name, c1: opp.c1, c2: opp.c2 },
      park: S.phase === 'HS' ? '목동야구장' : (sc.home ? me.park : opp.park || me.park),
      kind: S.phase === 'MLB' ? 'mlb' : 'pro',
      night,
      player: playerForPlay(),
      diff: S.settings.diff,
    };
  }
  function playerForPlay() {
    return {
      name: S.name, num: S.num, bats: S.bats, throws: S.throws, skin: S.look.skin,
      bat: effBat(), pit: Object.assign(effPit(), { pitches: S.pit.pitches }), fat: S.fat,
    };
  }
  // 직접 플레이 결과 반영 → 경기 결과 반환
  function applyKeyResult(K, R) {
    const sc = K.script;
    const res = { bat: blankStats(), pit: null };
    let ourAdd = 0;
    let pitLine = null;
    R.segs.forEach((s) => {
      if (s.type === 'bat') {
        s.pas.forEach((pa) => { tallyBat(res.bat, pa.outcome); res.bat.RBI += pa.rbi || 0; if (pa.outcome === 'HR') res.bat.R++; });
        ourAdd += s.runs;
      } else {
        pitLine = pitLine || Object.assign(blankStats(), { PG: 1 });
        pitLine.OUTS += s.outs; pitLine.PH += s.H; pitLine.ER += s.R; pitLine.PBB += s.BB; pitLine.PSO += s.K; pitLine.PHR += s.HR;
        sc.theirs[s.inning - 1] = s.R;
        pitLine.pitches = (pitLine.pitches || 0) + s.pitches;
      }
    });
    if (res.bat.PA) res.bat.G = 1;
    const pr = pitRole();
    if (pitLine && pr === 'SP') {
      pitLine.GS = 1;
      const limit = (S.phase === 'HS' ? 100 : 72 + S.pit.sta * 0.45);
      const rest = simOuting(effPit(), K.g.L, limit, 3, pitLine.pitches || 30);
      pitLine.OUTS += rest.outs; pitLine.PH += rest.H; pitLine.ER += rest.ER; pitLine.PBB += rest.BB; pitLine.PSO += rest.SO; pitLine.PHR += rest.HR;
      const innDone = Math.ceil(rest.outs / 3);
      for (let i = 0; i < innDone; i++) sc.theirs[2 + i] = 0;
      sc.theirs[2] += rest.ER;
    }
    let ours = sc.ours.reduce((a, b) => a + b, 0) + ourAdd;
    let theirs = sc.theirs.reduce((a, b) => a + b, 0);
    let extra = false;
    if (R.walkoff) { /* 끝내기: Play에서 이미 처리 */ }
    if (ours === theirs) { extra = true; if (chance(0.5 + (R.clutchBonus || 0))) ours++; else theirs++; }
    if (pitLine) {
      if (pr === 'SP') { if (ours > theirs && pitLine.OUTS >= 15 && pitLine.ER < ours) pitLine.W = 1; else if (ours < theirs && pitLine.ER > 0) pitLine.L = 1; }
      else if (pr === 'CL' && ours > theirs) pitLine.SV = 1;
      res.pit = pitLine;
    }
    res.ours = ours; res.theirs = theirs; res.win = ours > theirs; res.extra = extra; res.key = true;
    res.direct = R;
    S.wk.keyRes = res;
    return res;
  }

  // ---------- 주간 마무리 ----------
  function finishWeek() {
    const W = S.wk;
    const rep = { title: dateStr(), lines: [], gains: W.gains || [], games: [], dateLine: W.dateLine, dateHid: W.dateHid, events: [] };
    const weekStats = blankStats();
    // 경기 처리
    if (W.games && W.games.length) {
      if (W.postMode) processPost(W, rep, weekStats);
      else {
        W.games.forEach((g, i) => {
          if (S.phase === 'HS' && g.kind === 'tourn' && !S.hs.tourn.alive) return;
          let r;
          if (g.key && W.keyRes) r = W.keyRes;
          else if (g.pre) r = g.pre;
          else if (S.injury > 0) r = simTeamOnly(g);
          else r = simGame(g);
          addStats(weekStats, r.bat); addStats(weekStats, r.pit);
          g.res = r;
          rep.games.push({ label: g.label, win: r.win, ours: r.ours, theirs: r.theirs, key: !!g.key, title: g.key ? g.title : null });
          if (S.phase === 'HS') afterHSGame(g, r, rep);
          else {
            if (r.win) S.teamRec.w++; else S.teamRec.l++;
            if (S.phase === 'KBO') { const tr = S.teams[S.team]; if (S.level === 'KBO1') { if (r.win) tr.w++; else tr.l++; } }
          }
        });
        if (S.phase === 'KBO') simLeagueWeek(W);
      }
      if (!W.postMode) addStats(S.st, weekStats);
      const pg = weekStats.G || weekStats.PG;
      if (S.phase !== 'HS') { S.levelWeeks++; if (S.level === 'KBO1' || S.level === 'MLB') S.topWeeks++; }
      // 피로 & 인기
      const games = W.games.length;
      S.fat = clamp(S.fat + (isBatter() ? games * (S.fpos === 'C' ? 1.5 : 1.1) : 0) + (weekStats.GS ? 6 : 0) + weekStats.PG * 1.5, 0, 100);
      const top = S.level === 'KBO1' ? 0.25 : S.level === 'MLB' ? 0.45 : S.phase === 'HS' ? 0.1 : 0.05;
      S.fame = clamp(S.fame + top + weekStats.HR * 0.25 + weekStats.W * 0.4 + weekStats.SV * 0.15, 0, 100);
      rep.week = weekStats; rep.played = pg;
      S.recent.push(perfScore(weekStats)); if (S.recent.length > 6) S.recent.shift();
      // 경기 중 성장 (실전 경험)
      if (pg) {
        if (isBatter() && weekStats.PA) { growAttr(pick(['con', 'eye', 'pow']), 0.12 * ageMult()); }
        if (isPitcher() && weekStats.PG) { growAttr(pick(['ctl', 'stf']), 0.12 * ageMult()); }
      }
      if (S.fat > 82 && chance(0.06)) rep.events.push(injure(ri(1, 4)));
    }
    // 자연 회복
    const h = HOUSES.find((x) => x.id === S.house);
    S.fat = clamp(S.fat - 7 - h.cond * 0.5, 0, 100);
    S.mental = clamp(S.mental + (S.spouse ? 1 : 0) + h.mental * 0.2 + (S.mental < 50 ? 0.6 : -0.3), 0, 100);
    if (S.car) { const c = CARS.find((x) => x.id === S.car); S.fame = clamp(S.fame + c.fame * 0.01, 0, 100); }
    // 급여, 생활비
    payroll(rep);
    // 다음 주로
    W.done = true;
    S.stats.weeks++;
    advanceWeek(rep);
    if (chance(0.2)) randomEvent();
    S.wk = null;
    save();
    return rep;
  }

  function perfScore(t) {
    let s = 0;
    if (t.PA) s += ((t.H + t.BB) / t.PA - 0.33) * 6 + (t.HR * 1.2) + ((t.H + t.D + t.T * 2 + t.HR * 3) / Math.max(1, t.AB) - 0.4) * 3;
    if (t.OUTS) s += (4.5 - t.ER * 27 / t.OUTS) * 0.5 + t.W;
    return s;
  }

  function afterHSGame(g, r, rep) {
    const st = r.bat || {};
    const comb = blankStats(); addStats(comb, r.bat); addStats(comb, r.pit);
    S.hs.scoutK = clamp(S.hs.scoutK + perfScore(comb) * 0.6 + (g.kind === 'tourn' ? g.round * 0.4 : 0), 0, 100);
    if (S.pit.vel >= 145 || ovr() >= 58) S.hs.scoutM = clamp(S.hs.scoutM + 0.6 + (g.kind === 'tourn' ? 0.6 : 0), 0, 100);
    if (g.kind === 'tourn') {
      const T = S.hs.tourn;
      if (r.win) {
        T.round = g.round + 1;
        if (g.round === ROUNDS.length - 1) {
          T.alive = false;
          const t = `${S.year} ${T.name} 우승`;
          S.trophies.push(t);
          S.fame = clamp(S.fame + 6, 0, 100); S.hs.scoutK += 8; S.hs.scoutM += 5;
          addLog(`${T.name} 우승!!`);
          S.pending.push({ type: 'msg', data: { title: `${T.name} 우승!`, icon: 'trophy', text: `${SCHOOLS[S.school].name}이(가) ${T.name} 정상에 올랐다!\n전국의 스카우트들이 ${S.name}의 이름을 수첩에 적었다.` } });
        }
      } else {
        T.alive = false;
        addLog(`${T.name} ${ROUNDS[g.round]} 탈락`);
      }
    }
  }

  // KBO 리그 순위 (다른 팀 경기는 확률로)
  function simLeagueWeek() {
    const ids = KBO_TEAMS.map((t) => t.id).filter((id) => id !== S.team);
    const playedMine = S.level === 'KBO1';
    for (let d = 0; d < 6; d++) {
      let pool = shuffle(ids);
      if (!playedMine) pool = shuffle(KBO_TEAMS.map((t) => t.id));
      else pool = pool.slice(0, pool.length - 1);
      for (let i = 0; i + 1 < pool.length; i += 2) {
        const a = S.teams[pool[i]], b = S.teams[pool[i + 1]];
        const p = 1 / (1 + Math.exp(-(a.str - b.str) / 8));
        if (chance(p)) { a.w++; b.l++; } else { a.l++; b.w++; }
      }
    }
    if (!playedMine) {
      // 2군에 있을 땐 팀 경기 결과를 확률로 처리
    }
  }
  function standings() {
    ensureTeams();
    if (!S.teams || !S.teams.LG) { S.teams = {}; KBO_TEAMS.forEach((t) => (S.teams[t.id] = { str: rnd(54, 66), w: 0, l: 0, d: 0 })); }
    return KBO_TEAMS.map((t) => ({ id: t.id, name: t.name, short: t.short, c1: t.c1, ...S.teams[t.id] }))
      .sort((a, b) => (b.w / Math.max(1, b.w + b.l)) - (a.w / Math.max(1, a.w + a.l)));
  }

  function payroll(rep) {
    if (S.phase === 'HS' || S.phase === 'RETIRED') return;
    let pay = 0;
    const c = S.contract;
    if (c) {
      if (c.kind === 'milb' && !c.arb) pay = (S.level === 'MLB' ? 780000 : (S.level === 'AAA' ? 45000 : 35000)) * USD / 48;
      else pay = c.salary / 48;
    }
    S.money += pay;
    if (S.week % 4 === 3) {
      const h = HOUSES.find((x) => x.id === S.house);
      const upkeep = 1500000 + [0, 300000, 800000, 2000000, 5000000, 8000000][h.tier] + S.cars.reduce((a, id) => a + CARS.find((x) => x.id === id).price * 0.003, 0);
      S.money -= upkeep;
      rep.lines.push(`월급 및 생활비 정산 (생활비 -${won(upkeep)})`);
    }
  }

  // ---------- 포스트시즌 처리 ----------
  function setupPost() {
    if (S.phase === 'KBO') {
      if (S.level !== 'KBO1' && S.topWeeks < 6) return;
      const st = standings();
      const rank = st.findIndex((t) => t.id === S.team) + 1;
      if (rank > 5) { addLog(`정규시즌 ${rank}위. 가을야구 진출 실패.`); return; }
      const rounds = [];
      const opp = (r) => st[r - 1].id;
      if (rank >= 4) rounds.push({ name: '와일드카드 결정전', week: 0, need: rank === 4 ? 1 : 2, maxGames: 2, opp: opp(rank === 4 ? 5 : 4), oppRank: rank === 4 ? 5 : 4 });
      if (rank >= 3) rounds.push({ name: '준플레이오프', week: 0, need: 3, maxGames: 5, opp: opp(rank === 3 ? 4 : 3) });
      if (rank >= 2) rounds.push({ name: '플레이오프', week: 1, need: 3, maxGames: 5, opp: opp(rank === 2 ? 3 : 2) });
      rounds.push({ name: '한국시리즈', week: 2, need: 4, maxGames: 7, opp: opp(rank === 1 ? 2 : 1), final: true });
      S.post = { alive: true, rounds, rank };
      S.pending.push({ type: 'msg', data: { title: '가을야구 진출!', icon: 'trophy', text: `${teamInfo(S.team).name} 정규시즌 ${rank}위로 포스트시즌 진출!\n${rounds[0].name}부터 시작합니다.` } });
    } else {
      if (S.level !== 'MLB') return;
      const pct = S.teamRec.w / Math.max(1, S.teamRec.w + S.teamRec.l);
      if (pct < 0.535) { addLog('팀이 포스트시즌 진출에 실패했다.'); return; }
      const opps = shuffle(MLB_TEAMS.filter((t) => t.id !== S.team && t.lg === teamInfo(S.team).lg));
      const ws = pick(MLB_TEAMS.filter((t) => t.lg !== teamInfo(S.team).lg));
      const rounds = [];
      if (pct < 0.6) rounds.push({ name: '와일드카드 시리즈', week: 0, need: 2, maxGames: 3, opp: opps[0].id });
      rounds.push({ name: '디비전 시리즈', week: 1, need: 3, maxGames: 5, opp: opps[1].id });
      rounds.push({ name: '챔피언십 시리즈', week: 2, need: 4, maxGames: 7, opp: opps[2].id });
      rounds.push({ name: '월드시리즈', week: 3, need: 4, maxGames: 7, opp: ws.id, final: true });
      S.post = { alive: true, rounds };
      S.pending.push({ type: 'msg', data: { title: '포스트시즌 진출!', icon: 'trophy', text: `${teamInfo(S.team).name} ${S.teamRec.w}승 ${S.teamRec.l}패로 포스트시즌 진출!` } });
    }
  }
  function processPost(W, rep, weekStats) {
    const P = S.post;
    const c = seasonCfg();
    const idx = S.week - c.post[0];
    const rounds = P.rounds.filter((r) => r.week === idx);
    let gi = 0;
    for (const r of rounds) {
      if (!P.alive) break;
      let w = 0, l = 0;
      const myGames = W.games.filter((g) => g.round === r);
      for (const g of myGames) {
        if (w >= r.need || l >= r.need) break;
        let res;
        if (g.key && W.keyRes) res = W.keyRes; else if (g.pre) res = g.pre; else if (S.injury > 0) res = simTeamOnly(g); else res = simGame(g);
        addStats(weekStats, res.bat); addStats(weekStats, res.pit);
        if (res.win) w++; else l++;
        rep.games.push({ label: `${r.name} ${w + l}차전`, win: res.win, ours: res.ours, theirs: res.theirs, key: !!g.key, title: g.key ? g.title : null });
        gi++;
      }
      if (w >= r.need) {
        addLog(`${r.name} 승리! (${w}승 ${l}패)`);
        rep.lines.push(`${r.name} 통과 (${w}승 ${l}패)`);
        if (r.final) {
          P.alive = false;
          const nm = S.phase === 'KBO' ? '한국시리즈 우승' : '월드시리즈 우승';
          S.trophies.push(`${S.year} ${nm}`);
          S.fame = clamp(S.fame + 12, 0, 100); S.mental = clamp(S.mental + 20, 0, 100);
          const mvp = perfScore(weekStats) > 2.5;
          if (mvp) S.awards.push(`${S.year} ${S.phase === 'KBO' ? '한국시리즈' : '월드시리즈'} MVP`);
          S.pending.push({ type: 'msg', data: { title: nm + '!!', icon: 'trophy', text: `${teamInfo(S.team).name}이(가) 정상에 올랐다!\n샴페인 세례 속에서 ${S.name}은(는) 우승 반지를 손에 넣었다.${mvp ? '\n\n시리즈 MVP까지 수상!' : ''}` } });
        }
      } else {
        P.alive = false;
        addLog(`${r.name} 탈락 (${w}승 ${l}패)`);
        rep.lines.push(`${r.name} 탈락 (${w}승 ${l}패)`);
      }
    }
  }
  // 결승 시리즈 직접 플레이: 미리 시뮬해서 매치포인트 경기를 키게임으로
  function preSimFinal() {
    const W = S.wk;
    if (!W || !W.preSim) return null;
    const P = S.post;
    const c = seasonCfg();
    const idx = S.week - c.post[0];
    const r = P.rounds.find((x) => x.week === idx && x.final);
    if (!r) return null;
    const games = W.games.filter((g) => g.round === r);
    let w = 0, l = 0;
    for (let i = 0; i < games.length; i++) {
      if (w === r.need - 1 || l === r.need - 1) {
        const g = games[i];
        g.key = true;
        g.title = `${r.name} ${i + 1}차전 (${w}승 ${l}패)`;
        // 이전 경기들은 미리 결과 확정
        for (let j = 0; j < i; j++) games[j].pre = games[j].pre || simGame(games[j]);
        W.key = keyInfo(g, W.games.indexOf(g));
        W.key.title = `${r.name} ${i + 1}차전 · ${w === r.need - 1 ? '우승까지 1승!' : '벼랑 끝 승부'}`;
        return W.key;
      }
      const res = simGame(games[i]);
      games[i].pre = res;
      if (res.win) w++; else l++;
    }
    return null;
  }

  // ---------- 날짜 진행 ----------
  function advanceWeek(rep) {
    S.week++;
    if (S.week >= 48) { S.week = 0; newYear(); }
    weeklyChecks(rep);
  }
  function newYear() {
    S.year++; S.age++;
    if (S.phase === 'HS') {
      if (S.grade < 3) {
        S.grade++;
        addLog(`${S.grade}학년 진급!`);
      } else graduate();
    }
    // 노화
    if (S.age >= 31) {
      const d = (S.age - 30) * 0.45;
      ['con', 'pow', 'eye', 'spd', 'def', 'arm'].forEach((k) => (S.bat[k] = Math.max(15, +(S.bat[k] - rnd(0, 1.6) * d - (k === 'spd' ? d : 0)).toFixed(1))));
      ['ctl', 'stf', 'sta'].forEach((k) => (S.pit[k] = Math.max(15, +(S.pit[k] - rnd(0, 1.4) * d).toFixed(1))));
      S.pit.vel = +(S.pit.vel - rnd(0, 0.9) * d).toFixed(1);
    }
    S.contactWeek = {};
  }
  function graduate() {
    if (S.hs.path === 'MLB') {
      S.phase = 'MLB'; S.level = 'RK'; S.teamStr = rnd(62, 70);
      addLog(`${teamInfo(S.team).name} 마이너리그 생활 시작!`);
      S.pending.push({ type: 'msg', data: { title: '미국 진출', icon: 'star', text: `졸업과 함께 미국으로 떠난다.\n${teamInfo(S.team).name} 산하 루키리그부터 차근차근 올라가 메이저리그를 노리자!` } });
    } else {
      S.phase = 'KBO'; S.level = 'KBO2';
      S.teams = {}; ensureTeams();
      addLog(`${teamInfo(S.team).name} 입단!`);
      S.pending.push({ type: 'msg', data: { title: '프로 입단', icon: 'star', text: `${teamInfo(S.team).name}의 신인 ${S.name}.\n2월 스프링캠프에서 실력을 보여주면 개막 엔트리에 들 수 있다!\n\n이제 성인이 되어 연애와 자산 메뉴가 열렸습니다.` } });
    }
    S.st = blankStats(); newChart(); S.teamRec = { w: 0, l: 0 };
    S.flags.proYear = S.year;
  }

  function weeklyChecks(rep) {
    const w = S.week;
    if (S.phase === 'HS') return hsChecks(w);
    if (S.phase === 'RETIRED') return;
    const c = seasonCfg();
    // 시즌 시작
    if (w === c.reg[0]) startSeason();
    // 승격/강등
    if (w > c.reg[0] && w <= c.reg[1] && w % 2 === 0) levelMoves();
    if (S.phase === 'MLB' && w === c.reg[1] - 4 && S.level === 'AAA' && ovr() >= 60) promote('MLB', '9월 확장 로스터 콜업!');
    // 올스타
    if (w === c.allstar && (S.level === 'KBO1' || S.level === 'MLB') && (perfAvg() > 0.8 || S.fame > 45)) {
      S.pending.push({ type: 'allstar', data: {} });
    }
    if (w === c.post[0] && !S.flags['post' + S.year]) { S.flags['post' + S.year] = true; setupPost(); }
    if (w === c.end && !S.flags['end' + S.year]) { S.flags['end' + S.year] = true; endSeason(); }
    if (w === c.awards && !S.flags['aw' + S.year]) { S.flags['aw' + S.year] = true; awards(); }
    if (w === c.fa && !S.flags['fa' + S.year]) { S.flags['fa' + S.year] = true; contractCheck(); }
    if (w === c.nego && S.contract && S.contract.kind === 'annual' && !S.flags['nego' + S.year] && S.year !== S.flags.proYear) negotiation();
    if (w === c.nego && S.contract && S.contract.kind === 'milb' && S.mlbService >= 1 && !S.flags['nego' + S.year]) mlbSalary();
    if (w === c.retire && S.age >= 35) S.pending.push({ type: 'retireAsk', data: {} });
    if (w === c.camp[0]) S.pending.push({ type: 'msg', data: { title: '스프링캠프', icon: 'train', text: '스프링캠프 시작! 이번 달은 훈련 효과가 1.3배입니다.' } });
    // 계약 만료 후 강제 은퇴 조건
    if (w === c.retire && (S.age >= 42 || (S.age >= 34 && ovr() < 44))) S.pending.push({ type: 'forcedRetire', data: {} });
    heroineChecks();
    if (S.weddingWeek !== null && S.stats.weeks >= S.weddingWeek) { S.pending.push({ type: 'wedding', data: {} }); S.weddingWeek = null; }
    // 호감도 감소
    if (w % 4 === 0) Object.entries(S.rel).forEach(([id, r]) => { if (S.stats.weeks - (S.lastDate[id] || 0) > 8 && r.aff > 5) r.aff = Math.max(0, r.aff - 2); });
    if (S.partner && S.rel[S.partner].aff < 35 && !S.spouse) {
      S.pending.push({ type: 'breakup', data: { hid: S.partner } });
    }
  }
  function perfAvg() { return S.recent.length ? S.recent.reduce((a, b) => a + b, 0) / S.recent.length : 0; }

  function hsChecks(w) {
    if (w === 8 && S.grade > 1) { S.st = blankStats(); newChart(); }
    if (S.grade === 3 && w === 32 && !S.hs.path) {
      // 진로 결정
      const offers = [];
      if (ovr() >= 52 && (S.pot >= 72 || S.hs.scoutM >= 35)) {
        const n = ovr() >= 62 ? 3 : ovr() >= 57 ? 2 : 1;
        shuffle(MLB_TEAMS).slice(0, n).forEach((t) => {
          const b = clamp(Math.pow(Math.max(0, ovr() - 48), 2) * 11000 + 150000, 150000, 5500000) * rnd(0.85, 1.15);
          offers.push({ team: t.id, bonus: Math.round(b / 1e4) * 1e4 });
        });
      }
      S.pending.push({ type: 'path', data: { offers } });
    }
    if (S.grade === 3 && w === 34 && S.hs.path === 'KBO' && !S.hs.draftDone) S.pending.push({ type: 'draft', data: draftPick() });
    if (w === 44) hsAwards();
    if (w === 40) {
      S.career.push({ year: S.year, team: SCHOOLS[S.school].name, level: `고교 ${S.grade}학년`, st: Object.assign({}, S.st) });
    }
    heroineChecks();
  }

  function hsAwards() {
    const t = S.st; const got = [];
    const avg = t.AB ? t.H / t.AB : 0;
    if (t.PA >= 50 && avg >= 0.42) got.push('이영민 타격상');
    const ip = t.OUTS / 3; const era = ip ? t.ER * 9 / ip : 99;
    if (ip >= 35 && era <= 1.6) got.push('고교 최동원상');
    if (got.length) {
      got.forEach((a) => S.awards.push(`${S.year} ${a}`));
      S.fame = clamp(S.fame + 4 * got.length, 0, 100); S.hs.scoutK += 6;
      S.pending.push({ type: 'msg', data: { title: '고교 야구 시상식', icon: 'trophy', text: `${got.join(', ')} 수상!` } });
    }
  }

  function draftPick() {
    const score = ovr() + S.hs.scoutK * 0.08 + rnd(-2.5, 2.5);
    let better = 0;
    for (let i = 0; i < 110; i++) { const s = 71 - i * 0.2 + rnd(-2, 2); if (s > score) better++; }
    const pick_ = better + 1;
    let order = KBO_TEAMS.map((t) => t.id);
    order = shuffle(order);
    if (pick_ > 110) return { undrafted: true, team: pick(order) };
    const round = Math.ceil(pick_ / 10);
    const team = order[(pick_ - 1) % 10];
    const bonusTable = [0, 0, 150000000, 100000000, 80000000, 70000000, 60000000, 50000000, 40000000, 35000000, 30000000, 30000000];
    const bonus = round === 1 ? 500000000 - (pick_ - 1) * 25000000 : bonusTable[round];
    return { pick: pick_, round, team, bonus, inRound: ((pick_ - 1) % 10) + 1 };
  }

  function startSeason() {
    S.st = blankStats(); newChart(); S.teamRec = { w: 0, l: 0 }; S.levelWeeks = 0; S.topWeeks = 0; S.post = null; S.rot = 0; S.recent = [];
    if (S.phase === 'KBO') {
      ensureTeams();
      KBO_TEAMS.forEach((t) => { const x = S.teams[t.id]; x.w = 0; x.l = 0; x.str = clamp(x.str + rnd(-4, 4), 50, 70); });
      const o = ovr();
      const was = S.level;
      S.level = o >= 55 ? 'KBO1' : 'KBO2';
      const msg = S.level === 'KBO1' ? `개막 엔트리 합류! ${roleLabel()}로 시즌을 시작한다.` : '퓨처스리그(2군)에서 시즌을 시작한다. 실력을 키워 1군에 올라가자!';
      addLog(msg);
      if (was !== S.level || S.year === S.flags.proYear) S.pending.push({ type: 'msg', data: { title: `${S.year} 시즌 개막`, icon: 'ball', text: msg } });
    } else {
      const o = ovr();
      let lv = S.level === 'MLB' ? 'MLB' : 'RK';
      for (const k of ['RK', 'A', 'A+', 'AA', 'AAA']) if (o >= MILB_UP[k] + 2) lv = MILB_LADDER[MILB_LADDER.indexOf(k) + 1];
      if (S.contract && S.contract.kind === 'mlb') lv = 'MLB';
      if (S.level === 'MLB' && o >= 61) lv = 'MLB';
      const prev = MILB_LADDER.indexOf(S.level);
      if (MILB_LADDER.indexOf(lv) < prev && !(S.level === 'MLB' && o < 58)) lv = S.level;
      if (lv !== S.level && !(S.contract && S.contract.kind === 'mlb')) lv = MILB_LADDER[Math.min(MILB_LADDER.indexOf(lv), prev + 2)];
      if (lv !== S.level) S.lvlSince = S.stats.weeks;
      S.level = lv;
      S.teamStr = clamp((S.teamStr || 66) + rnd(-4, 4), 60, 73);
      const msg = `${LEVEL_LABEL[S.level]}에서 시즌을 시작한다. (${roleLabel()})`;
      addLog(msg);
      S.pending.push({ type: 'msg', data: { title: `${S.year} 시즌 개막`, icon: 'ball', text: msg } });
    }
  }

  function promote(lv, why) {
    const from = S.level;
    S.lvlSince = S.stats.weeks;
    S.level = lv;
    addLog(`${LEVEL_LABEL[lv]} 승격! ${why || ''}`);
    S.pending.push({ type: 'msg', data: { title: `${LEVEL_LABEL[lv]} 승격!`, icon: 'star', text: `${LEVEL_LABEL[from]} → ${LEVEL_LABEL[lv]}\n${why || '좋은 활약을 인정받았다!'}` } });
    S.mental = clamp(S.mental + 8, 0, 100);
    S.recent = [];
  }
  function demote(lv, why) {
    const from = S.level;
    S.lvlSince = S.stats.weeks;
    S.level = lv;
    addLog(`${LEVEL_LABEL[lv]} 강등...`);
    S.pending.push({ type: 'msg', data: { title: '강등 통보', icon: 'rest', text: `${LEVEL_LABEL[from]} → ${LEVEL_LABEL[lv]}\n${why || '컨디션을 끌어올려 다시 올라가자.'}` } });
    S.mental = clamp(S.mental - 8, 0, 100);
    S.recent = [];
  }
  function levelMoves() {
    const o = ovr(), p = perfAvg();
    if (S.injury > 0) return;
    if (S.phase === 'KBO') {
      if (S.level === 'KBO2' && (o >= 57 || (o >= 52 && p > 1.2 && S.recent.length >= 3))) promote('KBO1', '퓨처스에서의 활약으로 1군 콜업!');
      else if (S.level === 'KBO1' && o < 53 && p < -1 && S.recent.length >= 3) demote('KBO2', '부진으로 1군 엔트리에서 말소됐다.');
    } else {
      const i = MILB_LADDER.indexOf(S.level);
      if (S.level !== 'MLB') {
        if (S.stats.weeks - (S.lvlSince || 0) < 8) return;
        const thr = MILB_UP[S.level];
        if ((o >= thr && p > -0.5) || (o >= thr - 3 && p > 1.5 && S.recent.length >= 3)) promote(MILB_LADDER[i + 1], S.level === 'AAA' ? '메이저리그 콜업! 꿈의 무대로!' : '');
      } else if (o < 59 && p < -1 && S.recent.length >= 3 && !(S.contract && S.contract.kind === 'mlb')) demote('AAA', '트리플A로 옵션 이동됐다.');
    }
  }

  function war(t, lg) {
    let w = 0;
    if (t.PA) {
      const obp = (t.H + t.BB) / t.PA, slg = (t.H + t.D + t.T * 2 + t.HR * 3) / Math.max(1, t.AB);
      const base = lg === 'MLB' ? [0.315, 0.405] : [0.34, 0.42];
      w += ((obp - base[0]) * t.PA * 0.9 + (slg - base[1]) * t.PA * 0.45) / 14 + t.PA / 600 * 2 + t.SB * 0.02 + ((S.bat.def - 50) * 0.025 * (fpos().def ? 1 : 0) + fpos().adj) * (t.PA / 600);
    }
    if (t.OUTS) {
      const ip = t.OUTS / 3, era = t.ER * 9 / ip;
      w += ((lg === 'MLB' ? 4.2 : 4.6) - era) * ip / 9 / 9.5 + ip / 180 * 1.4 + t.SV * 0.03;
    }
    return +w.toFixed(1);
  }

  function endSeason() {
    const lg = league();
    const t = S.st;
    const w = war(t, lg);
    S.career.push({ year: S.year, team: teamInfo(S.team).name, level: LEVEL_LABEL[S.level], st: Object.assign({}, t), war: w, lg });
    S.lastWar = w;
    if (S.phase === 'KBO' && S.topWeeks >= 14) { S.service++; addLog(`KBO 1군 등록 ${S.service}시즌 채움`); }
    if (S.phase === 'MLB' && S.topWeeks >= 15) { S.mlbService++; addLog(`메이저리그 서비스 타임 ${S.mlbService}년`); }
    if (S.contract && S.contract.years) S.contract.years--;
  }

  function awards() {
    const t = S.st, lg = league();
    const got = [];
    const w = S.lastWar || 0;
    const ip = t.OUTS / 3, era = ip ? t.ER * 9 / ip : 99, avg = t.AB ? t.H / t.AB : 0;
    const top = S.topWeeks >= 14;
    if (!top) { S.pending.push({ type: 'msg', data: { title: `${S.year} 시즌 결산`, icon: 'chart', text: `${LEVEL_LABEL[S.level]}에서 시즌을 마쳤다.\n` + seasonSummary(t) } }); return; }
    const p = (x) => chance(clamp(x, 0, 0.97));
    const rookie = S.career.filter((c) => c.lg === lg && c.st && (c.level === '1군' || c.level === '메이저리그')).length <= 1 && !S.flags['roy' + lg];
    if (lg === 'KBO') {
      if (t.PA >= 400 && p((avg - 0.325) / 0.035)) got.push('타격왕');
      if (p((t.HR - 28) / 10)) got.push('홈런왕');
      if (ip >= 100 && p((t.W - 13) / 4)) got.push('다승왕');
      if (ip >= 140 && p((3.0 - era) / 0.6)) got.push('평균자책점왕');
      if (p((t.PSO - 165) / 40)) got.push('탈삼진왕');
      if (p((t.SV - 28) / 8)) got.push('세이브왕');
      if (rookie && p((w - 1.5) / 2)) { got.push('신인왕'); S.flags.royKBO = true; }
      if (p((w - 3.5) / 2)) got.push(t.PA >= 300 ? `골든글러브(${fpos().name})` : '골든글러브(투수)');
      if (p((w - 6.5) / 2)) got.push('정규시즌 MVP');
    } else {
      if (rookie && p((w - 2) / 2.5)) { got.push('올해의 신인'); S.flags.royMLB = true; }
      if (t.PA >= 400 && p((w - 3.5) / 2)) got.push(`실버슬러거(${fpos().name})`);
      if (S.bat.def >= 80 && t.PA >= 400 && S.fpos !== 'DH' && chance(0.5)) got.push(`골드글러브(${fpos().name})`);
      if (ip >= 150 && p((w - 5.5) / 2)) got.push('사이영상');
      if (t.PA >= 450 && p((w - 7.5) / 2)) got.push('MVP');
      if (S.pos === 'TW' && t.PA >= 300 && ip >= 80 && p((w - 6) / 3) && !got.includes('MVP')) got.push('MVP');
    }
    if (got.length) {
      got.forEach((a) => S.awards.push(`${S.year} ${lg === 'KBO' ? 'KBO' : 'MLB'} ${a}`));
      S.fame = clamp(S.fame + got.length * 5, 0, 100);
      S.mental = clamp(S.mental + 10, 0, 100);
      S.pending.push({ type: 'msg', data: { title: `${S.year} 시상식`, icon: 'trophy', text: `수상: ${got.join(', ')}!\n\n시즌 WAR ${w}` } });
      addLog(`시상식: ${got.join(', ')}`);
    } else {
      S.pending.push({ type: 'msg', data: { title: `${S.year} 시즌 결산`, icon: 'chart', text: seasonSummary(t) + `\nWAR ${w}` } });
    }
  }
  function seasonSummary(t) {
    const parts = [];
    if (t.PA) parts.push(`타율 ${fmtAvg(t.H, t.AB)} ${t.HR}홈런 ${t.RBI}타점 OPS ${fmtOps(t)}`);
    if (t.OUTS) parts.push(`${t.PG}경기 ${t.W}승 ${t.L}패${t.SV ? ' ' + t.SV + '세이브' : ''} 평균자책점 ${fmtEra(t)} ${t.PSO}탈삼진`);
    return parts.join('\n') || '경기 기록 없음';
  }
  function fmtAvg(h, ab) { if (!ab) return '.000'; const v = h / ab; return v >= 1 ? '1.000' : '.' + String(Math.round(v * 1000)).padStart(3, '0'); }
  function fmtOps(t) { if (!t.PA) return '.000'; const obp = (t.H + t.BB) / t.PA, slg = (t.H + t.D + t.T * 2 + t.HR * 3) / Math.max(1, t.AB); const v = obp + slg; return v >= 1 ? v.toFixed(3) : '.' + String(Math.round(v * 1000)).padStart(3, '0'); }
  function fmtEra(t) { if (!t.OUTS) return t.ER ? '∞' : '0.00'; return (t.ER * 27 / t.OUTS).toFixed(2); }
  function fmtIp(outs) { return Math.floor(outs / 3) + (outs % 3 ? '.' + (outs % 3) : ''); }

  // ---------- 계약 ----------
  function contractCheck() {
    const c = S.contract;
    if (!c) return;
    if (S.phase === 'KBO') {
      if ((c.kind === 'annual' && S.service >= 7) || (c.kind === 'multi' && c.years <= 0)) S.pending.push({ type: 'fa', data: { offers: faOffers() } });
    } else {
      if ((c.kind === 'milb' && S.mlbService >= 6) || (c.kind === 'mlb' && c.years <= 0)) S.pending.push({ type: 'fa', data: { offers: faOffers() } });
    }
  }
  function faOffers() {
    const o = ovr(), out = [];
    const ageF = S.age >= 34 ? 0.55 : S.age >= 31 ? 0.8 : 1;
    const kboTeams = shuffle(KBO_TEAMS);
    if (S.phase === 'KBO') kboTeams.sort((a, b) => (a.id === S.team ? -1 : b.id === S.team ? 1 : 0));
    kboTeams.slice(0, 3).forEach((t, i) => {
      const total = Math.max(5, 8 + (o - 55) * 4.2) * 1e8 * ageF * rnd(0.9, 1.15) * (i === 0 && S.phase === 'KBO' ? 0.95 : 1);
      const years = S.age >= 33 ? 2 : S.age >= 30 ? 3 : 4;
      out.push({ lg: 'KBO', team: t.id, years, total: Math.round(total / 1e7) * 1e7, bonus: Math.round(total * 0.35 / 1e7) * 1e7 });
    });
    if (o >= 66) {
      const n = o >= 82 ? 3 : o >= 74 ? 2 : 1;
      shuffle(MLB_TEAMS).slice(0, n).forEach((t) => {
        const aav = Math.max(1.5, (o - 64) * 2.3) * 1e6 * ageF * rnd(0.85, 1.2);
        const years = S.age >= 33 ? 1 : o >= 85 ? ri(5, 8) : o >= 78 ? ri(3, 5) : ri(1, 2);
        out.push({ lg: 'MLB', team: t.id, years, aav: Math.round(aav / 1e5) * 1e5 });
      });
    }
    return out;
  }
  function signFA(off) {
    if (off.lg === 'KBO') {
      const salary = (off.total - off.bonus) / off.years;
      S.money += off.bonus;
      if (S.phase !== 'KBO') { S.phase = 'KBO'; S.teams = {}; ensureTeams(); }
      S.team = off.team; S.level = 'KBO1';
      S.contract = { kind: 'multi', lg: 'KBO', salary, years: off.years, total: off.total };
      addLog(`${teamInfo(off.team).name}와 ${off.years}년 총액 ${won(off.total)} FA 계약!`);
    } else {
      const firstMLB = S.phase !== 'MLB';
      S.phase = 'MLB'; S.team = off.team; S.level = 'MLB'; S.teamStr = rnd(63, 71);
      S.contract = { kind: 'mlb', lg: 'MLB', salary: off.aav * USD, years: off.years, total: off.aav * off.years };
      addLog(`${teamInfo(off.team).name}와 ${off.years}년 ${usd(off.aav * off.years)} 계약!`);
      if (firstMLB) S.flags.mlbDebut = false;
    }
    S.fame = clamp(S.fame + 6, 0, 100);
  }
  function negotiation() {
    S.flags['nego' + S.year] = true;
    const w = S.lastWar || 0;
    const prev = S.contract.salary;
    const target = 30000000 + Math.max(0, w) * 40000000 * (1 + S.service * 0.4);
    let offer = Math.max(prev * 0.75, prev + (target - prev) * 0.7, 30000000);
    offer = Math.round(offer / 1e6) * 1e6;
    S.pending.push({ type: 'nego', data: { prev, offer, war: w } });
  }
  function mlbSalary() {
    S.flags['nego' + S.year] = true;
    const w = S.lastWar || 0;
    if (S.mlbService >= 3) {
      const prevUsd = Math.max(780000, (S.flags.arbSal || 780000));
      const sal = Math.round((prevUsd * 1.25 + Math.max(0, w) * 1300000) / 1e4) * 1e4;
      S.flags.arbSal = sal;
      S.contract = { kind: 'milb', lg: 'MLB', salary: sal * USD, arb: sal };
      S.pending.push({ type: 'msg', data: { title: '연봉 조정', icon: 'coin', text: `연봉 조정 결과 ${usd(sal)} (약 ${won(sal * USD)})에 합의!` } });
    }
  }

  // ---------- 연애 ----------
  function heroineChecks() {
    if (S.phase === 'HS' || S.phase === 'RETIRED') return;
    const meet = (id) => { if (!S.rel[id]) { S.rel[id] = { aff: 8, met: S.year }; const h = HEROINES.find((x) => x.id === id); S.pending.push({ type: 'meet', data: { hid: id } }); addLog(`${h.name}(${h.job})와 처음 만났다.`); } };
    if (S.week <= 3 || S.phase === 'KBO') meet('minji');
    if (S.phase === 'KBO' && inRegular()) meet('chaerin');
    if (S.fame >= 18 && inRegular() && chance(0.25)) meet('jisu');
    if (S.flags.meetSeoyun) { meet('seoyun'); S.flags.meetSeoyun = false; }
    if (S.phase === 'MLB' && (S.level === 'MLB' || S.level === 'AAA')) meet('ella');
  }
  function relStage(aff, id) {
    if (S.spouse === id) return 6;
    if (S.partner === id) return S.engaged ? 5 : 4;
    if (aff >= 50) return 3; if (aff >= 20) return 2; return 1;
  }
  const STAGE_NAME = ['', '아는 사이', '친구', '썸', '연인', '약혼', '부부'];
  function heroLine(h) {
    const st = relStage(S.rel[h.id].aff, h.id);
    const tier = st >= 4 ? 3 : st >= 3 ? 2 : st >= 2 ? 1 : 0;
    return pick(h.talk[tier]);
  }
  function canContact(id) { return S.contactWeek[id] !== S.year * 100 + S.week; }
  function contact(id) {
    const h = HEROINES.find((x) => x.id === id);
    S.contactWeek[id] = S.year * 100 + S.week;
    const g = ri(1, 3) + (S.partner === id ? 1 : 0);
    S.rel[id].aff = clamp(S.rel[id].aff + g, 0, 100);
    S.lastDate[id] = S.stats.weeks;
    S.mental = clamp(S.mental + 1, 0, 100);
    save();
    return { line: heroLine(h), gain: g };
  }
  function dateBlocked(id) {
    if ((S.spouse && S.spouse !== id) || (S.partner && S.partner !== id)) return '연인이 있어요';
    return null;
  }
  function doDate(id, placeId) {
    const h = HEROINES.find((x) => x.id === id);
    const pl = DATE_PLACES.find((x) => x.id === placeId);
    S.money -= pl.cost;
    const car = S.car ? CARS.find((x) => x.id === S.car).date : 0;
    let g = pl.aff * (h.fav === pl.id ? 1.5 : 1) * (1 + car * 0.04) * rnd(0.85, 1.2) + S.fame * 0.02;
    g = Math.round(g);
    S.rel[id].aff = clamp(S.rel[id].aff + g, 0, 100);
    S.lastDate[id] = S.stats.weeks;
    S.fat = clamp(S.fat - pl.cond, 0, 100);
    S.mental = clamp(S.mental + 5, 0, 100);
    const gains = [`${h.name} 호감도 +${g}`, `피로 -${pl.cond}`, '멘탈 +5'];
    if (h.fav === pl.id) gains.unshift('좋아하는 장소! 반응이 아주 좋다');
    return { gains, place: pl.name, line: heroLine(h) };
  }
  function gift(id, giftId) {
    const g = GIFTS.find((x) => x.id === giftId);
    if (S.money < g.cost) return { ok: false, msg: '돈이 부족합니다.' };
    S.money -= g.cost;
    if (g.ring) { S.ring = true; save(); return { ok: true, msg: '프러포즈 반지를 준비했다. 결정적인 순간을 위해 아껴두자.' }; }
    S.rel[id].aff = clamp(S.rel[id].aff + g.aff, 0, 100);
    save();
    return { ok: true, msg: `${g.name}을(를) 선물했다! 호감도 +${g.aff}` };
  }
  function confess(id) {
    const r = S.rel[id];
    const car = S.car ? CARS.find((x) => x.id === S.car).date : 0;
    const p = clamp((r.aff - 60) / 40 + S.fame * 0.002 + car * 0.01, 0.1, 0.95);
    if (chance(p)) {
      S.partner = id; r.aff = clamp(r.aff + 5, 0, 100);
      S.mental = clamp(S.mental + 15, 0, 100);
      addLog(`${HEROINES.find((x) => x.id === id).name}와 연인이 되었다!`);
      save();
      return true;
    }
    r.aff = clamp(r.aff - 10, 0, 100); S.mental = clamp(S.mental - 8, 0, 100);
    save();
    return false;
  }
  function proposeCheck(id) {
    if (S.spouse) return '이미 결혼했어요';
    if (S.partner !== id || S.engaged) return '연인에게만 할 수 있어요';
    if (!S.ring) return '프러포즈 반지가 필요해요 (선물 메뉴)';
    const h = HOUSES.find((x) => x.id === S.house);
    if (h.tier < 2) return '신혼집이 필요해요 (아파트 이상)';
    if (S.rel[id].aff < 92) return '호감도 92 이상 필요';
    return null;
  }
  function propose(id) {
    S.ring = false;
    if (chance(0.92)) {
      S.engaged = true; S.weddingWeek = S.stats.weeks + 6;
      addLog(`${HEROINES.find((x) => x.id === id).name}에게 프러포즈 성공!`);
      save(); return true;
    }
    S.rel[id].aff -= 8; save(); return false;
  }

  // ---------- 자산 ----------
  function buyHouse(id) {
    const h = HOUSES.find((x) => x.id === id);
    if (S.houses.includes(id)) { S.house = id; save(); return { ok: true, msg: `${h.name}(으)로 이사했다.` }; }
    if (h.mlbOnly && S.phase !== 'MLB') return { ok: false, msg: '메이저리그 선수만 구매할 수 있어요.' };
    if (S.money < h.price) return { ok: false, msg: '돈이 부족합니다.' };
    S.money -= h.price; S.houses.push(id); S.house = id;
    S.mental = clamp(S.mental + 10, 0, 100);
    addLog(`${h.name} 구매!`);
    save();
    return { ok: true, msg: `${h.name} 구매 완료! 새 집으로 이사했다.` };
  }
  function sellHouse(id) {
    const h = HOUSES.find((x) => x.id === id);
    if (id === 'home' || !S.houses.includes(id)) return { ok: false };
    S.houses = S.houses.filter((x) => x !== id);
    S.money += h.price * 0.9;
    if (S.house === id) S.house = S.houses[S.houses.length - 1] || 'home';
    save();
    return { ok: true, msg: `${h.name} 매각 (+${won(h.price * 0.9)})` };
  }
  function buyCar(id) {
    const c = CARS.find((x) => x.id === id);
    if (S.cars.includes(id)) { S.car = id; save(); return { ok: true, msg: `오늘은 ${c.name}를 탄다.` }; }
    if (S.money < c.price) return { ok: false, msg: '돈이 부족합니다.' };
    S.money -= c.price; S.cars.push(id); S.car = id;
    S.mental = clamp(S.mental + 6, 0, 100);
    addLog(`${c.name} 구매!`);
    save();
    return { ok: true, msg: `${c.name} 구매 완료!` };
  }
  function sellCar(id) {
    const c = CARS.find((x) => x.id === id);
    if (!S.cars.includes(id)) return { ok: false };
    S.cars = S.cars.filter((x) => x !== id);
    S.money += c.price * 0.6;
    if (S.car === id) S.car = S.cars[S.cars.length - 1] || null;
    save();
    return { ok: true, msg: `${c.name} 중고 판매 (+${won(c.price * 0.6)})` };
  }

  // ---------- 랜덤 이벤트 ----------
  function randomEvent() {
    const pro = S.phase !== 'HS';
    const pool = [
      () => { const k = isBatter() ? pick(['con', 'pow', 'eye']) : pick(['ctl', 'stf']); const g = growAttr(k, 0.8); S.pending.push({ type: 'msg', data: { title: '코치의 조언', icon: 'star', text: `코치님이 따로 불러 원포인트 레슨을 해주셨다.\n${ATTR_NAME[k]} +${g}` } }); },
      () => { S.mental = clamp(S.mental - 10, 0, 100); S.pending.push({ type: 'msg', data: { title: '슬럼프 기미', icon: 'rest', text: '요즘 뭘 해도 잘 안 풀린다...\n멘탈 -10' } }); },
      () => { S.mental = clamp(S.mental + 8, 0, 100); S.fame = clamp(S.fame + 1, 0, 100); S.pending.push({ type: 'msg', data: { title: '팬레터', icon: 'heart', text: pro ? '어린 팬에게서 삐뚤빼뚤한 글씨의 편지가 왔다.\n"저도 커서 형처럼 될래요!"\n멘탈 +8' : '같은 반 친구들이 응원 현수막을 만들어 왔다.\n멘탈 +8' } }); },
      () => { const g = growAttr(isPitcher() && chance(0.5) ? 'sta' : 'spd', 0.6); S.pending.push({ type: 'msg', data: { title: '동기와 특훈', icon: 'train', text: `동기와 밤늦게까지 함께 땀을 흘렸다.\n${isPitcher() ? '스태미나/주력' : '주력'} +${g}` } }); },
      () => { if (pro && S.money > 30000000) S.pending.push({ type: 'invest', data: { amt: Math.min(Math.round(S.money * 0.2 / 1e6) * 1e6, 500000000) } }); },
      () => { if (pro && S.money > 20000000) S.pending.push({ type: 'parents', data: { amt: Math.max(10000000, Math.round(S.money * 0.05 / 1e6) * 1e6) } }); },
      () => { if (pro) { S.fame = clamp(S.fame + 2, 0, 100); S.pending.push({ type: 'msg', data: { title: '인터뷰 요청', icon: 'star', text: '스포츠 매체에서 단독 인터뷰를 요청했다.\n인기 +2' } }); } },
      () => { if (S.phase === 'HS' && S.grade >= 2 && ovr() >= 45) { S.hs.scoutK += 4; S.hs.scoutM += S.pit.vel >= 142 ? 6 : 2; S.pending.push({ type: 'msg', data: { title: '스카우트 방문', icon: 'star', text: '훈련장에 프로 스카우트들이 찾아왔다. 스피드건과 수첩을 든 사람들이 내 쪽을 보고 있다.' } }); } },
    ];
    pick(pool)();
  }

  // ---------- 대기 이벤트 해결 ----------
  function resolve(ev, choice) {
    const d = ev.data;
    switch (ev.type) {
      case 'path':
        if (choice === 'KBO') { S.hs.path = 'KBO'; addLog('KBO 신인 드래프트 참가를 선택했다.'); }
        else {
          const off = d.offers[choice];
          S.hs.path = 'MLB'; S.team = off.team; S.money += off.bonus * USD;
          S.contract = { kind: 'milb', lg: 'MLB', salary: 35000 * USD };
          S.hs.draftDone = true;
          addLog(`${teamInfo(off.team).name}와 계약금 ${usd(off.bonus)}에 계약!`);
          S.fame = clamp(S.fame + 10, 0, 100);
          return { title: '메이저리그 구단과 계약!', text: `${teamInfo(off.team).name}와 계약금 ${usd(off.bonus)} (약 ${won(off.bonus * USD)})에 사인했다!\n졸업 후 미국으로 건너갑니다.` };
        }
        return null;
      case 'draft':
        S.hs.draftDone = true;
        if (d.undrafted) {
          S.team = d.team; S.contract = { kind: 'annual', lg: 'KBO', salary: 30000000 };
          S.mental = clamp(S.mental - 15, 0, 100);
          addLog(`드래프트 미지명... ${teamInfo(d.team).name} 육성선수로 입단.`);
        } else {
          S.team = d.team; S.money += d.bonus; S.contract = { kind: 'annual', lg: 'KBO', salary: 30000000 };
          S.fame = clamp(S.fame + (d.round === 1 ? 10 : 4), 0, 100);
          addLog(`${teamInfo(d.team).name} ${d.round}라운드 ${d.inRound}순위 지명! 계약금 ${won(d.bonus)}`);
        }
        return null;
      case 'nego': {
        let sal = d.offer, msg;
        if (choice === 'ask') {
          const p = clamp(0.45 + d.war * 0.06, 0.2, 0.85);
          if (chance(p)) { sal = Math.round(d.offer * 1.15 / 1e6) * 1e6; msg = `구단이 요구를 받아들였다! 연봉 ${won(sal)}`; }
          else { S.mental = clamp(S.mental - 5, 0, 100); msg = `협상 결렬... 구단 제시액 ${won(sal)}에 도장을 찍었다.`; }
        } else msg = `${won(sal)}에 계약했다.`;
        S.contract.salary = sal;
        addLog(`${S.year} 연봉 ${won(sal)}`);
        return { title: '연봉 계약 완료', text: msg };
      }
      case 'fa':
        if (choice === 'stay' || choice === undefined || choice === null) return null;
        signFA(d.offers[choice]);
        return { title: 'FA 계약 체결!', text: S.log[0].t };
      case 'invest':
        if (choice === 'yes') {
          if (chance(0.45)) { S.money += d.amt; return { title: '투자 성공!', text: `투자금이 두 배가 되었다! +${won(d.amt)}` }; }
          if (chance(0.5)) { S.money -= d.amt * 0.5; return { title: '투자 손실', text: `절반을 잃었다... -${won(d.amt * 0.5)}` }; }
          S.money -= d.amt; S.mental = clamp(S.mental - 10, 0, 100); return { title: '투자 실패', text: `전액을 날렸다... -${won(d.amt)}` };
        }
        return null;
      case 'parents':
        if (choice === 'yes') { S.money -= d.amt; S.mental = clamp(S.mental + 15, 0, 100); return { title: '효도 완료', text: `부모님께 ${won(d.amt)}을 드렸다.\n어머니가 우셨다. 멘탈 +15` }; }
        return null;
      case 'retireAsk':
        if (choice === 'retire') { retire(); return null; }
        return null;
      case 'forcedRetire': retire(); return null;
      case 'wedding': {
        const h = HEROINES.find((x) => x.id === S.partner);
        const cost = Math.min(100000000, Math.max(20000000, S.money * 0.1));
        S.money -= cost; S.spouse = S.partner; S.engaged = false; S.mental = clamp(S.mental + 25, 0, 100); S.fame = clamp(S.fame + 5, 0, 100);
        addLog(`${h.name}와 결혼했다!`);
        return null;
      }
      case 'breakup': {
        const h = HEROINES.find((x) => x.id === d.hid);
        S.partner = null; S.engaged = false; S.mental = clamp(S.mental - 20, 0, 100);
        addLog(`${h.name}와 헤어졌다...`);
        return null;
      }
      case 'allstar':
        S.fame = clamp(S.fame + 4, 0, 100);
        S.awards.push(`${S.year} ${league()} 올스타`);
        return null;
      default: return null;
    }
  }
  function retire() {
    S.phase = 'RETIRED';
    addLog('현역 은퇴를 선언했다.');
    const tot = careerTotals();
    S.hof = (tot.war >= 55) || S.awards.filter((a) => /MVP|사이영/.test(a)).length >= 2;
  }
  function careerTotals() {
    const pro = S.career.filter((c) => c.lg);
    const t = blankStats(); let w = 0;
    pro.forEach((c) => { addStats(t, c.st); w += c.war || 0; });
    t.war = +w.toFixed(1);
    t.seasons = pro.length;
    return t;
  }
  function derbyResult(hr) {
    const ai = [ri(4, 13), ri(4, 13), ri(3, 11)];
    const win = hr > Math.max(...ai);
    S.fame = clamp(S.fame + 2 + (win ? 5 : 0), 0, 100);
    if (win) S.awards.push(`${S.year} 홈런더비 우승`);
    S.awards.push(`${S.year} ${league()} 올스타`);
    save();
    return { ai, win };
  }

  return {
    get S() { return S; }, newGame, save, load, hasSave, wipe, rollTalent,
    won, usd, grade, dateStr, ovr, batOVR, pitOVR, velScore, repScore, affiliation, myColors, teamInfo, roleLabel, batRole, pitRole,
    actions, trainingList, planWeek, finishWeek, keyPlayOptions, applyKeyResult, preSimFinal, playerForPlay, makeOppPitcher, makeOppBatter,
    resolve, standings, inRegular, isOffseason, league, seasonCfg, fmtAvg, fmtOps, fmtEra, fmtIp, war, seasonSummary, careerTotals,
    contact, canContact, doDate, gift, confess, proposeCheck, propose, dateBlocked, relStage, STAGE_NAME, heroLine,
    FPOS, fpos, setFpos(k) { if (FPOS[k]) { S.fpos = k; addLog(`포지션을 ${FPOS[k].name}로 바꿨다.`); save(); } },
    buyHouse, sellHouse, buyCar, sellCar, lessonCost, derbyResult, simDerby, addLog, advance, PKEYS, fenceDist,
    LEVEL_LABEL, POS_LABEL, ATTR_NAME, PITCH_ORDER, HS_CAL, ROUNDS, isBatter, isPitcher, clamp, rnd, ri, pick, chance,
    // 테스트용
    _sim: { batPA, pitPA, simHalf, simOuting, simGame, blankStats },
  };
})();
