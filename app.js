/* 帮助大山点亮一颗颗星 · 降低山区贫困负担 —— 逻辑层
 * 围绕联合国 SDG 4 优质教育 / SDG 10 减少不平等
 * 四大模块：① 我的梦想 ② 进城考试 ③ 错题练习·物资 ④ 数据整理
 */
'use strict';

const KEY = 'pep_state_v1';

/* 排行榜演示种子数据（非本人）
 * 保留 5 条具名示例，再程序化生成 600 条同龄小朋友，使排行榜更充实。
 * 示例姓名均为正经的真实姓名；生成器使用固定随机种子，姓名/城市/分数稳定不变。 */
const SEED_BASE = [
  { name: '阿依古丽', city: '乌鲁木齐', province: '新疆', score: 180, passed: true, cityPassed: true, provincePassed: false, nationalPassed: false, supplies: 38 },
  { name: '马俊杰',   city: '成都',     province: '四川', score: 140, passed: true, cityPassed: false, provincePassed: false, nationalPassed: false, supplies: 22 },
  { name: '卓玛',     city: '拉萨',     province: '西藏', score: 90,  passed: false, cityPassed: false, provincePassed: false, nationalPassed: false, supplies: 15 },
  { name: '陈福安',   city: '昆明',     province: '云南', score: 60,  passed: false, cityPassed: false, provincePassed: false, nationalPassed: false, supplies: 9 },
  { name: '石磊',     city: '湘西',     province: '湖南', score: 30,  passed: false, cityPassed: false, provincePassed: false, nationalPassed: false, supplies: 6 },
];

/* 中国城市清单（用于梦想城市选择 & 排行榜演示） */
const CHINA_CITIES = ['北京','上海','广州','深圳','成都','杭州','重庆','武汉','西安','南京','苏州','长沙','郑州','青岛','昆明','贵阳','南宁','兰州','西宁','银川','乌鲁木齐','拉萨','呼和浩特','哈尔滨','沈阳','大连','厦门','福州','南昌','合肥','太原','济南','天津','石家庄','海口','三亚','桂林','丽江','大理','喀什','和田','日喀则','林芝','延边','黔东南','湘西','恩施','阿坝','甘孜'];

/* 城市 → 省份 映射（用于省榜 / 市榜 按地域筛选人物） */
const CITY_TO_PROVINCE = {
  '北京':'北京','上海':'上海','广州':'广东','深圳':'广东','成都':'四川','杭州':'浙江','重庆':'重庆','武汉':'湖北','西安':'陕西','南京':'江苏','苏州':'江苏','长沙':'湖南','郑州':'河南','青岛':'山东','昆明':'云南','贵阳':'贵州','南宁':'广西','兰州':'甘肃','西宁':'青海','银川':'宁夏','乌鲁木齐':'新疆','拉萨':'西藏','呼和浩特':'内蒙古','哈尔滨':'黑龙江','沈阳':'辽宁','大连':'辽宁','厦门':'福建','福州':'福建','南昌':'江西','合肥':'安徽','太原':'山西','济南':'山东','天津':'天津','石家庄':'河北','海口':'海南','三亚':'海南','桂林':'广西','丽江':'云南','大理':'云南','喀什':'新疆','和田':'新疆','日喀则':'西藏','林芝':'西藏','延边':'吉林','黔东南':'贵州','湘西':'湖南','恩施':'湖北','阿坝':'四川','甘孜':'四川'
};

/* 固定种子的伪随机数（mulberry32），确保演示姓名/城市/分数每次加载都一致、不再变化 */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSeedRank() {
  const rnd = mulberry32(20260730);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const SURNAMES = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳'.split('');
  // 正经的真实姓名用字（单字 / 双字均有），避免使用昵称式写法
  const GIVEN = ['伟','芳','娜','敏','静','丽','强','磊','军','洋','勇','艳','杰','娟','涛','明','超','霞','平','刚','文','辉','丹','鹏','宇','浩','婷','雪','倩','璐','晨','阳','轩','涵','悦','嘉','宁','欣','子涵','雨欣','梦琪','佳怡','思远','志远','浩然','雨萱','梓萱','一诺','欣怡','梓涵','若曦','子轩','宇航','沐辰','思琪','婉清','佳琪','雅婷','梦瑶','晓彤','佳琳','子墨','雨桐','诗涵','可欣','亦凡','俊杰','海燕','桂英','建国','志强','春梅','玉兰','永强','金宝'];
  const used = new Set();
  const out = [];
  let guard = 0;
  while (out.length < 600 && guard < 40000) {
    guard++;
    const name = pick(SURNAMES) + pick(GIVEN);
    if (used.has(name)) continue;
    used.add(name);
    const city = pick(CHINA_CITIES);
    const province = CITY_TO_PROVINCE[city] || '—';
    const score = 5 + Math.floor(rnd() * 316);
    const passed = score >= 80 && rnd() < 0.5;
    const cityPassed = score >= 120 && rnd() < 0.45;
    const provincePassed = score >= 180 && rnd() < 0.4;
    const nationalPassed = score >= 240 && rnd() < 0.35;
    const supplies = 1 + Math.floor(rnd() * 45);   // 演示同学也持有爱心物资（1–45 份）
    out.push({ name, city, province, score, passed, cityPassed, provincePassed, nationalPassed, supplies });
  }
  return SEED_BASE.concat(out);
}

const SEED_RANK = buildSeedRank();

function defaultState() {
  return {
    profile: { name: '', dream: '', city: '' },
    exam: null,          // 当前考试状态
    wrong: [],           // 错题池（供练习）
    supplies: 0,         // 物资数量
    lastSupplyReset: Date.now(),  // 上次物资归零时间戳（每 10 天归零）
    score: 0,            // 分数
    passed: false,       // 是否进城上学
    cityPassed: false,       // 冲刺市赛
    provincePassed: false,   // 冲刺省赛
    nationalPassed: false,   // 冲刺国赛
    answers: [],         // 全部答题记录（用于数据整理）
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

let state = load();

/* ---------- 工具 ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------- 数学题生成（难度：一年级 ~ 六年级，逐级递增） ---------- */
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function red(a, b) { const g = gcd(a, b); a = a / g; b = b / g; return b === 1 ? String(a) : a + '/' + b; }
function fmt(n) { return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(4))); }

/* 根据正确答案与若干干扰项，拼出 4 个去重选项（答案必在其中） */
function pickOptions(answer, candidates) {
  const set = new Set([answer]);
  for (const c of candidates) { if (c !== answer) set.add(c); if (set.size >= 4) break; }
  let i = 1;
  while (set.size < 4) {
    let cand;
    if (answer.indexOf('/') >= 0) {
      const parts = answer.split('/');
      cand = (Number(parts[0]) + i) + '/' + parts[1];
    } else {
      cand = String(Number(answer) + i);
    }
    if (cand !== answer) set.add(cand);
    i++;
  }
  return shuffle([...set]);
}

/* 各年级题型构造器；grade 字段用于按考试等级筛选难度。
   一年级（最易）→ 六年级（最难），覆盖小学全学段。 */
const QUIZ_BUILDERS = [
  /* —— 一年级：10/20 以内加减、比大小、数数 —— */
  { g: 1, build: () => { const a = rand(1, 9), b = rand(1, 9), s = a + b; return { type: '加法', text: `${a} + ${b} = ?`, answer: String(s), options: pickOptions(String(s), [String(s + 1), String(s - 1), String(s + 2)]) }; } },
  { g: 1, build: () => { const a = rand(2, 10), b = rand(1, a), s = a - b; return { type: '减法', text: `${a} − ${b} = ?`, answer: String(s), options: pickOptions(String(s), [String(s + 1), String(s - 1), String(a + b)]) }; } },
  { g: 1, build: () => { const a = rand(1, 20), b = rand(1, 20), big = a >= b ? a : b, small = a >= b ? b : a; return { type: '比大小', text: `${a} 和 ${b}，哪个数更大？`, answer: String(big), options: pickOptions(String(big), [String(small), String(a + b), String(Math.abs(a - b))]) }; } },
  { g: 1, build: () => { const n = rand(3, 9); return { type: '数数', text: `从 1 数到 ${n}，一共有几个数？`, answer: String(n), options: pickOptions(String(n), [String(n + 1), String(n - 1), String(n + 2)]) }; } },

  /* —— 二年级：表内乘除、100 以内加减、简单应用 —— */
  { g: 2, build: () => { const a = rand(2, 9), b = rand(2, 9), s = a * b; return { type: '表内乘法', text: `${a} × ${b} = ?`, answer: String(s), options: pickOptions(String(s), [String(s + b), String(s - b), String(a * (b + 1))]) }; } },
  { g: 2, build: () => { const b = rand(2, 9), q = rand(2, 9), a = b * q; return { type: '表内除法', text: `${a} ÷ ${b} = ?`, answer: String(q), options: pickOptions(String(q), [String(q + 1), String(q - 1), String(b)]) }; } },
  { g: 2, build: () => { const a = rand(10, 99), b = rand(10, 99), s = a + b; return { type: '加法', text: `${a} + ${b} = ?`, answer: String(s), options: pickOptions(String(s), [String(s + 1), String(s - 1), String(s + 10)]) }; } },
  { g: 2, build: () => { const a = rand(50, 99), b = rand(10, a), s = a - b; return { type: '减法', text: `${a} − ${b} = ?`, answer: String(s), options: pickOptions(String(s), [String(s + 1), String(s - 1), String(a + b)]) }; } },
  { g: 2, build: () => { const a = rand(2, 9), b = rand(2, 9), s = a + b; return { type: '应用题', text: `小明有 ${a} 支铅笔，妈妈又买来 ${b} 支，现在一共有几支？`, answer: String(s), options: pickOptions(String(s), [String(a - b), String(a * b), String(s + 1)]) }; } },

  /* —— 三年级：多位数加减、一位数乘多位数、带余除法、周长 —— */
  { g: 3, build: () => { const a = rand(100, 999), b = rand(100, 999), s = a + b; return { type: '加法', text: `${a} + ${b} = ?`, answer: String(s), options: pickOptions(String(s), [String(s + 1), String(s - 1), String(s + 10)]) }; } },
  { g: 3, build: () => { const a = rand(300, 999), b = rand(100, a), s = a - b; return { type: '减法', text: `${a} − ${b} = ?`, answer: String(s), options: pickOptions(String(s), [String(s + 1), String(s - 1), String(a + b)]) }; } },
  { g: 3, build: () => { const a = rand(10, 99), b = rand(2, 9), s = a * b; return { type: '乘法', text: `${a} × ${b} = ?`, answer: String(s), options: pickOptions(String(s), [String(s + b), String(s - b), String((a + 1) * b)]) }; } },
  { g: 3, build: () => { const b = rand(2, 9), q = rand(10, 40), a = b * q; return { type: '除法', text: `${a} ÷ ${b} = ?`, answer: String(q), options: pickOptions(String(q), [String(q + 1), String(q - 1), String(b)]) }; } },
  { g: 3, build: () => { const l = rand(4, 20), w = rand(3, 15), s = 2 * (l + w); return { type: '周长', text: `长方形长 ${l}，宽 ${w}，周长是多少？`, answer: String(s), options: pickOptions(String(s), [String(l + w), String(l * w), String(2 * (l + w) + 1)]) }; } },

  /* —— 四年级：多位数乘除、小数加减、面积、简易分数 —— */
  { g: 4, build: () => { const a = rand(11, 99), b = rand(11, 99), s = a * b; return { type: '乘法', text: `${a} × ${b} = ?`, answer: String(s), options: pickOptions(String(s), [String(s + b), String(s - b), String((a + 1) * b)]) }; } },
  { g: 4, build: () => { const b = rand(2, 12), q = rand(3, 20), a = b * q; return { type: '除法', text: `${a} ÷ ${b} = ?`, answer: String(q), options: pickOptions(String(q), [String(q + 1), String(q - 1), String(b)]) }; } },
  { g: 4, build: () => { const a = rand(1, 99) / 10, b = rand(1, 99) / 10, s = fmt(a + b); return { type: '小数加法', text: `${fmt(a)} + ${fmt(b)} = ?`, answer: s, options: pickOptions(s, [fmt(a + b + 0.1), fmt(a + b - 0.1), fmt(Math.abs(a - b))]) }; } },
  { g: 4, build: () => { const l = rand(4, 20), w = rand(3, 15), s = l * w; return { type: '面积', text: `长方形长 ${l}，宽 ${w}，面积是多少？`, answer: String(s), options: pickOptions(String(s), [String(l + w), String(2 * (l + w)), String(l * w + 1)]) }; } },
  { g: 4, build: () => { const b = rand(3, 9), a1 = rand(1, b - 1), a2 = rand(1, b - 1); const s = red(a1 + a2, b); return { type: '分数加法', text: `${a1}/${b} + ${a2}/${b} = ?`, answer: s, options: pickOptions(s, [red(a1 + a2 + 1, b), red(Math.abs(a1 - a2), b), red(a1 + a2, b + 1)]) }; } },

  /* —— 五年级：小数乘除、分数运算、三角形面积 —— */
  { g: 5, build: () => { const a = rand(11, 99) / 10, b = rand(2, 9), s = fmt(a * b); return { type: '小数乘法', text: `${fmt(a)} × ${b} = ?`, answer: s, options: pickOptions(s, [fmt(a * b + 0.1), fmt(a * (b + 1)), fmt(a * b - 0.1)]) }; } },
  { g: 5, build: () => { const b = rand(2, 9), a1 = rand(1, b - 1), a2 = rand(1, b - 1); const s = red(a1 + a2, b); return { type: '分数加法', text: `${a1}/${b} + ${a2}/${b} = ?`, answer: s, options: pickOptions(s, [red(a1 + a2 + 1, b), red(Math.abs(a1 - a2), b), red(a1 + a2, b + 1)]) }; } },
  { g: 5, build: () => { const b = rand(2, 9), a1 = rand(2, 9), a2 = rand(2, 9), b2 = b; const s = red(a1 * a2, b * b2); return { type: '分数乘法', text: `${a1}/${b} × ${a2}/${b2} = ?`, answer: s, options: pickOptions(s, [red(a1 * a2 + 1, b * b2), red(a1 + a2, b + b2), red(a1 * a2, b * b2 + 1)]) }; } },
  { g: 5, build: () => { const d = rand(4, 18), h = rand(3, 14), s = red(d * h, 2); return { type: '面积', text: `三角形底 ${d}，高 ${h}，面积是多少？`, answer: s, options: pickOptions(s, [String(d * h), String((d + h) / 2), String(d * h / 2 + 1)]) }; } },

  /* —— 六年级：百分数、圆面积、简易方程、圆柱体积、按比例分配 —— */
  { g: 6, build: () => { const p = [10, 20, 25, 50][rand(0, 3)]; const base = rand(20, 80); const s = fmt(base * p / 100); return { type: '百分数', text: `求 ${base} 的 ${p}% 是多少？`, answer: s, options: pickOptions(s, [fmt(base + p), fmt(base - p), fmt(base * p / 100 * 2)]) }; } },
  { g: 6, build: () => { const r = rand(2, 10); const s = fmt(3.14 * r * r); return { type: '圆面积', text: `圆的半径 ${r}，面积是多少？（π取3.14）`, answer: s, options: pickOptions(s, [fmt(2 * 3.14 * r), fmt(3.14 * r), fmt(3.14 * r * r + 1)]) }; } },
  { g: 6, build: () => { const a = rand(2, 9), x = rand(1, 9), b = rand(1, 20), c = a * x + b; return { type: '简易方程', text: `${a}x + ${b} = ${c}，x = ?`, answer: String(x), options: pickOptions(String(x), [String(x + 1), String(x - 1), String(c - b)]) }; } },
  { g: 6, build: () => { const r = rand(2, 8), h = rand(3, 12); const s = fmt(3.14 * r * r * h); return { type: '圆柱体积', text: `圆柱底面半径 ${r}，高 ${h}，体积是多少？（π取3.14）`, answer: s, options: pickOptions(s, [fmt(3.14 * r * h), fmt(3.14 * r * r), fmt(3.14 * r * r * h + 1)]) }; } },
  { g: 6, build: () => { const m = rand(2, 5), n = rand(2, 5), total = rand(20, 60); const big = Math.max(m, n); const s = Math.round(total * big / (m + n)); return { type: '按比例分配', text: `把 ${total} 按 ${m}:${n} 分成两份，较大的一份是多少？`, answer: String(s), options: pickOptions(String(s), [String(total - s), String(Math.round(total / (m + n))), String(s + 1)]) }; } },
];

/* 按考试等级筛选对应年级段的题库，再随机抽 n 道题 */
function genExam(level, n) {
  const [gmin, gmax] = EXAM_LEVELS[level].grades;
  const pool = QUIZ_BUILDERS.filter(b => b.g >= gmin && b.g <= gmax);
  const qs = [];
  for (let i = 0; i < n; i++) {
    const q = pool[Math.floor(Math.random() * pool.length)].build();
    q.id = i + 1;
    qs.push(q);
  }
  return qs;
}

function logAnswer(module, q, your, correct, ok) {
  state.answers.push({
    module, q, your: String(your), correct: String(correct), ok, t: new Date().toISOString()
  });
}

/* ---------- 路由 ---------- */
function showView(name) {
  $$('.view').forEach(v => v.classList.remove('active'));
  $('#view-' + name).classList.add('active');
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === name));
  if (name === 'home') renderHome();
  if (name === 'practice') renderPractice();
  if (name === 'data') renderData();
  if (name === 'rank') renderRank();
  if (name === 'exam') renderExamIntro();
  window.scrollTo(0, 0);
}

function bindRouter() {
  $$('.tab').forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));
  $$('[data-goto]').forEach(el => el.addEventListener('click', () => showView(el.dataset.goto)));
}

/* ---------- 首页状态 ---------- */
function renderHome() {
  const total = state.answers.length;
  const ok = state.answers.filter(a => a.ok).length;
  const strip = $('#home-status');
  if (!state.profile.name && total === 0 && state.supplies === 0) {
    strip.innerHTML = '👋 欢迎！从「① 我的梦想」开始，写下你的第一个愿望吧。';
    return;
  }
  const dreamTxt = state.profile.dream ? `梦想已写下：${state.profile.dream.slice(0, 16)}…` : '还没写梦想';
  const passTxt = state.passed ? '已进城上学 🎓' : '尚未进城';
  strip.innerHTML = `📌 <b>${state.profile.name || '匿名小朋友'}</b> ｜ ${dreamTxt} ｜ 累计答题 <b>${total}</b> 道（对 ${ok}） ｜ 物资 <b>${state.supplies}</b> ｜ 分数 <b>${state.score}</b> ｜ ${passTxt}`;
}

/* ---------- 模块① 我的梦想 ---------- */
function bindDream() {
  // 填充「想去的城市」为中国城市下拉
  const sel = $('#inp-city');
  CHINA_CITIES.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    sel.appendChild(o);
  });
  sel.value = state.profile.city || '';

  $('#inp-name').value = state.profile.name || '';
  $('#inp-dream').value = state.profile.dream || '';
  $('#btn-save-dream').addEventListener('click', () => {
    state.profile.name = $('#inp-name').value.trim();
    state.profile.dream = $('#inp-dream').value.trim();
    state.profile.city = $('#inp-city').value; // 下拉保证为中国城市
    save();
    $('#dream-saved').hidden = false;
    setTimeout(() => { $('#dream-saved').hidden = true; }, 2500);
  });
}

/* ---------- 模块② 进城考试 + 市/省/国赛冲刺 ---------- */
let exam = null; // { qs, index, correct, finished, level }
const PASS_SCORE = 80;          // 80 分及以上过关（按百分制，80% 正确率）
function examScore() { return Math.round(exam.correct / exam.qs.length * 100); }

/* 四级考试：进城基础考 + 市赛 / 省赛 / 国赛 冲刺。
   grades 为该等级对应的年级段，逐级递增难度（覆盖 1-6 年级）。 */
const EXAM_LEVELS = {
  base:     { label: '进城考试', total: 15, passBonus: 0,   flag: 'passed',          earlyFinish: true,  grades: [1, 2], gradeText: '1-2 年级' },
  city:     { label: '冲刺市赛', total: 15, passBonus: 30,  flag: 'cityPassed',      earlyFinish: false, grades: [2, 3], gradeText: '2-3 年级' },
  province: { label: '冲刺省赛', total: 20, passBonus: 60,  flag: 'provincePassed',  earlyFinish: false, grades: [3, 4], gradeText: '3-4 年级' },
  national: { label: '冲刺国赛', total: 25, passBonus: 100, flag: 'nationalPassed',  earlyFinish: false, grades: [5, 6], gradeText: '5-6 年级' },
};

function bindExam() {
  $('#btn-start-exam').addEventListener('click', () => startExam('base'));
  $('#btn-sprint-city').addEventListener('click', () => startExam('city'));
  $('#btn-sprint-province').addEventListener('click', () => startExam('province'));
  $('#btn-sprint-national').addEventListener('click', () => startExam('national'));
  $('#btn-quit-exam').addEventListener('click', () => {
    $('#exam-intro').hidden = false;
    $('#exam-run').hidden = true;
    $('#exam-result').hidden = true;
    exam = null;
  });
  $('#btn-go-city').addEventListener('click', () => finishExam(true));
  renderExamIntro();
}

/* 解锁链：市赛需先过进城考，省赛需先过市赛，国赛需先过省赛 */
function examLocked(level) {
  if (level === 'city' && !state.passed) return '🔒 需先通过「进城考试」（基础考）';
  if (level === 'province' && !state.cityPassed) return '🔒 需先通过「市赛」';
  if (level === 'national' && !state.provincePassed) return '🔒 需先通过「省赛」';
  return null;
}

/* 刷新考试首页：按解锁状态禁用冲刺按钮并标注 🔒 与年级段 */
function renderExamIntro() {
  $('#btn-start-exam').textContent = `开始考试（进城 · ${EXAM_LEVELS.base.gradeText}）`;
  const setSprint = (id, level) => {
    const cfg = EXAM_LEVELS[level];
    const btn = $('#' + id);
    const lock = examLocked(level);
    btn.disabled = !!lock;
    const txt = `${cfg.label}（${cfg.gradeText}）`;
    btn.textContent = lock ? txt + ' 🔒' : txt;
    btn.title = lock || txt;
  };
  setSprint('btn-sprint-city', 'city');
  setSprint('btn-sprint-province', 'province');
  setSprint('btn-sprint-national', 'national');
}

/* 从考试结果返回考试首页，并刷新解锁状态 */
function backToExamIntro() {
  exam = null;
  $('#exam-result').hidden = true;
  $('#exam-run').hidden = true;
  $('#exam-intro').hidden = false;
  renderExamIntro();
}

function startExam(level) {
  const lock = examLocked(level);
  if (lock) { alert(lock); return; }
  const cfg = EXAM_LEVELS[level];
  exam = { qs: genExam(level, cfg.total), index: 0, correct: 0, finished: false, level };
  $('#exam-intro').hidden = true;
  $('#exam-result').hidden = true;
  $('#exam-run').hidden = false;
  $('#btn-go-city').hidden = true;
  renderExamQuestion();
}

function renderExamQuestion() {
  const cfg = EXAM_LEVELS[exam.level];
  const q = exam.qs[exam.index];
  $('#exam-counter').textContent = `第 ${exam.index + 1} / ${cfg.total} 题`;
  $('#exam-correct').textContent = `得分 ${examScore()} / ${PASS_SCORE} 分（满分 100）`;
  $('#exam-fill').style.width = (Math.min(examScore() / PASS_SCORE, 1) * 100) + '%';
  $('#q-text').textContent = q.text;

  const box = $('#q-options');
  box.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'q-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => onExamAnswer(q, opt, btn, box));
    box.appendChild(btn);
  });
  $('#q-feedback').hidden = true;
}

function onExamAnswer(q, chosen, btn, box) {
  if (exam.finished) return;
  const ok = chosen === q.answer;
  if (ok) { exam.correct++; state.supplies += 1; }   // 每对一题 +1 份物资
  logAnswer('进城考试', q.text, chosen, q.answer, ok);
  if (!ok) state.wrong.push({ type: q.type, text: q.text, answer: q.answer, options: q.options });

  // 标记选项
  $$('.q-option', ).forEach(b => b.disabled = true);
  box.querySelectorAll('.q-option').forEach(b => {
    if (b.textContent === q.answer) b.classList.add('correct');
    else if (b === btn) b.classList.add('wrong');
  });

  const fb = $('#q-feedback');
  fb.hidden = false;
  fb.className = 'q-feedback ' + (ok ? 'ok' : 'no');
  fb.textContent = ok ? '✅ 答对啦！获得 1 份物资 🎒' : `❌ 正确答案：${q.answer}`;

  save();

  // 基础进城考达到 80 分（百分制，80% 正确率）可提前解锁进城
  if (examScore() >= PASS_SCORE && EXAM_LEVELS[exam.level].earlyFinish) {
    $('#btn-go-city').hidden = false;
  }

  exam.index++;
  setTimeout(() => {
    if (exam.index >= exam.qs.length) {
      finishExam(examScore() >= PASS_SCORE);
    } else {
      renderExamQuestion();
    }
  }, ok ? 700 : 1300);
}

function finishExam(passed) {
  exam.finished = true;
  $('#exam-run').hidden = true;
  const res = $('#exam-result');
  res.hidden = false;

  const cfg = EXAM_LEVELS[exam.level];
  const sc = examScore();
  const maxSc = 100;
  const reward = sc + cfg.passBonus;

  if (passed) {
    state[cfg.flag] = true;
    state.score += reward;
    save();
    let emoji = '🎓', title = '恭喜！你考上了城里的免费学校！';
    if (exam.level === 'city') { emoji = '🏙️'; title = '冲刺市赛成功！你在全市小伙伴里更进一步！'; }
    else if (exam.level === 'province') { emoji = '🏞️'; title = '冲刺省赛成功！你在全省崭露头角！'; }
    else if (exam.level === 'national') { emoji = '🌟'; title = '冲刺国赛成功！你站上了全国舞台！'; }
    const bonusTxt = cfg.passBonus ? `（含 ${cfg.passBonus} 分${exam.level === 'city' ? '市赛' : exam.level === 'province' ? '省赛' : '国赛'}奖励）` : '';
    res.className = 'exam-result pass';
    res.innerHTML = `
      <div class="big-emoji">${emoji}</div>
      <h3>${title}</h3>
      <p>答对 ${exam.correct} / ${cfg.total} 题，考试得分 <b>${sc}</b> 分（满分约${maxSc}）。</p>
      <p>本次获得 <b>+${reward} 分</b>${bonusTxt}，去排行榜看看你的新名次吧！</p>
      <div class="exam-actions" style="justify-content:center">
        <button class="btn btn-primary" id="to-rank">查看排行榜 🏆</button>
        <button class="btn btn-secondary" id="to-practice">去练错题 🎒</button>
        <button class="btn btn-secondary" id="to-data">查看我的数据 📊</button>
        <button class="btn btn-secondary" id="to-exam-intro">返回考试首页</button>
      </div>`;
    $('#to-rank').addEventListener('click', () => showView('rank'));
    $('#to-practice').addEventListener('click', () => showView('practice'));
    $('#to-data').addEventListener('click', () => showView('data'));
    $('#to-exam-intro').addEventListener('click', backToExamIntro);
  } else {
    res.className = 'exam-result fail';
    res.innerHTML = `
      <div class="big-emoji">🌱</div>
      <h3>这次差一点点，别灰心！</h3>
      <p>答对 ${exam.correct} / ${cfg.total} 题，考试得分 ${sc} 分，还差 ${PASS_SCORE - sc} 分就能过关。</p>
      <p>去「③ 错题练习·物资」把错题练会，赚爱心物资兑换分数吧。</p>
      <div class="exam-actions" style="justify-content:center">
        <button class="btn btn-primary" id="to-practice">去练错题 🎒</button>
        <button class="btn btn-secondary" id="to-exam-intro">返回考试首页</button>
      </div>`;
    $('#to-practice').addEventListener('click', () => showView('practice'));
    $('#to-exam-intro').addEventListener('click', backToExamIntro);
  }
  save();
}

/* ---------- 模块③ 错题练习 · 物资 ---------- */
function renderPractice() {
  $('#supply-count').textContent = state.supplies;
  $('#score-count').textContent = state.score;
  const area = $('#practice-area');

  if (!state.wrong.length) {
    area.innerHTML = `<div class="pq-empty">🎉 暂时没有错题啦！<br>去「② 进城考试」挑战一下，或检查一下自己是否已经进城上学。</div>`;
    return;
  }

  area.innerHTML = '';
  state.wrong.forEach((wq, idx) => {
    const card = document.createElement('div');
    card.className = 'practice-q';
    const opts = wq.options;
    card.innerHTML = `<div class="pq-text">${wq.text}</div><div class="pq-options"></div>`;
    const optBox = card.querySelector('.pq-options');
    opts.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'q-option';
      b.textContent = opt;
      b.addEventListener('click', () => onPracticeAnswer(b, optBox, wq, idx, opt));
      optBox.appendChild(b);
    });
    area.appendChild(card);
  });
}

function onPracticeAnswer(btn, box, wq, idx, chosen) {
  if (btn.disabled) return;
  const ok = chosen === wq.answer;
  logAnswer('错题练习', wq.text, chosen, wq.answer, ok);
    box.querySelectorAll('.q-option').forEach(b => {
      b.disabled = true;
      if (b.textContent === wq.answer) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });
  if (ok) {
    state.supplies += 1;             // 练对一题发一份物资
    state.wrong.splice(idx, 1);       // 掌握后移出错题池
    save();
    renderPractice();
    $('#supply-count').textContent = state.supplies;
  }
}

function bindPractice() {
  $('#btn-exchange').addEventListener('click', () => {
    if (state.supplies <= 0) {
      alert('还没有物资可以兑换哦，先去练几道错题吧！');
      return;
    }
    const gain = state.supplies * 1;
    state.score += gain;
    state.supplies = 0;
    save();
    $('#supply-count').textContent = 0;
    $('#score-count').textContent = state.score;
    alert(`🎒 兑换成功！${state.supplies} 份物资已换成 ${gain} 分。\n（提示：分数已更新，去排行榜看看名次吧）`);
  });
}

/* ---------- 模块④ 数据整理 ---------- */
function renderData() {
  const total = state.answers.length;
  const ok = state.answers.filter(a => a.ok).length;
  const no = total - ok;
  $('#data-summary').innerHTML = `
    <div class="data-stat"><div class="num">${total}</div><div class="lbl">累计答题</div></div>
    <div class="data-stat"><div class="num">${ok}</div><div class="lbl">答对</div></div>
    <div class="data-stat"><div class="num">${no}</div><div class="lbl">答错</div></div>
    <div class="data-stat"><div class="num">${state.score}</div><div class="lbl">当前分数</div></div>`;

  // 爱心物资汇总：你的 + 其他同学（演示数据）+ 总计
  const othersSupplies = SEED_RANK.reduce((s, e) => s + (e.supplies || 0), 0);
  const totalSupplies = state.supplies + othersSupplies;
  $('#supply-summary').innerHTML = `
    <div class="data-stat"><div class="num">${state.supplies}</div><div class="lbl">你的物资</div></div>
    <div class="data-stat"><div class="num">${othersSupplies}</div><div class="lbl">其他同学物资</div></div>
    <div class="data-stat"><div class="num">${totalSupplies}</div><div class="lbl">全平台物资总计</div></div>`;
  $('#supply-reset-hint').textContent = `🕒 物资每 10 天归零一次（你的物资清零、其他同学重新发放）。${nextSupplyResetText()}。`;

  const tbody = $('#log-table tbody');
  tbody.innerHTML = '';
  if (!total) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#6b7894">还没有答题记录，去考试或练错题吧。</td></tr>';
    return;
  }
  state.answers.forEach((a, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${a.module}</td>
      <td>${escapeHtml(a.q)}</td>
      <td>${escapeHtml(a.your)}</td>
      <td>${escapeHtml(a.correct)}</td>
      <td class="${a.ok ? 'tag-ok' : 'tag-no'}">${a.ok ? '正确' : '错误'}</td>`;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function bindData() {
  $('#btn-export-json').addEventListener('click', () => {
    const othersSupplies = SEED_RANK.reduce((s, e) => s + (e.supplies || 0), 0);
    const payload = {
      profile: state.profile, score: state.score, supplies: state.supplies,
      othersSupplies, totalSupplies: state.supplies + othersSupplies,
      lastSupplyReset: state.lastSupplyReset,
      passed: state.passed, answers: state.answers, exportedAt: new Date().toISOString()
    };
    download('成长档案.json', JSON.stringify(payload, null, 2), 'application/json');
  });

  $('#btn-export-csv').addEventListener('click', () => {
    const head = ['环节', '题目', '你的答案', '正确答案', '结果', '时间'];
    const rows = state.answers.map(a => [a.module, a.q, a.your, a.correct, a.ok ? '正确' : '错误', a.t]);
    const csv = [head, ...rows].map(r => r.map(csvCell).join(',')).join('\r\n');
    download('答题明细.csv', '﻿' + csv, 'text/csv;charset=utf-8');
  });

  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('确定要清空全部数据并重新开始吗？此操作不可撤销。')) return;
    state = defaultState();
    save();
    $('#inp-name').value = '';
    $('#inp-dream').value = '';
    $('#inp-city').value = '';
    renderHome();
    alert('已重置，欢迎重新开始！');
  });
}

function csvCell(v) {
  const s = String(v).replace(/"/g, '""');
  return /[",\r\n]/.test(s) ? `"${s}"` : s;
}

function download(name, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------- 排行榜（国榜 / 省榜 / 市榜，可滑动） ---------- */
function personaEmoji(name) {
  let h = 0;
  for (const ch of String(name)) h = (h + ch.charCodeAt(0)) % 997;
  return h % 2 === 0 ? '👦' : '👧';
}

function myProvince() { return CITY_TO_PROVINCE[state.profile.city] || ''; }

let rankScope = 'national';

function setRankScope(scope) {
  rankScope = scope;
  $$('#rank-tabs .rank-tab').forEach(t => t.classList.toggle('active', t.dataset.scope === scope));
  const active = $('#rank-tabs .rank-tab.active');
  const ind = $('#rank-tab-ind');
  if (active && ind) {
    ind.style.left = active.offsetLeft + 'px';
    ind.style.width = active.offsetWidth + 'px';
  }
  renderRank();
}

function renderRank() {
  const province = myProvince();
  const me = {
    name: state.profile.name || '匿名小朋友',
    city: state.profile.city || '—',
    province: province || '—',
    score: state.score, passed: state.passed,
    cityPassed: state.cityPassed, provincePassed: state.provincePassed,
    nationalPassed: state.nationalPassed, isMe: true
  };

  let pool;
  if (rankScope === 'city') {
    pool = state.profile.city ? SEED_RANK.filter(s => s.city === state.profile.city) : [];
  } else if (rankScope === 'province') {
    pool = province ? SEED_RANK.filter(s => (s.province || CITY_TO_PROVINCE[s.city] || '—') === province) : [];
  } else {
    pool = SEED_RANK;
  }

  const norm = (e) => ({
    name: e.name, city: e.city,
    province: e.province || CITY_TO_PROVINCE[e.city] || '—',
    score: e.score, passed: !!e.passed, cityPassed: !!e.cityPassed,
    provincePassed: !!e.provincePassed, nationalPassed: !!e.nationalPassed, isMe: !!e.isMe
  });

  const list = [...pool.map(norm), norm(me)].sort((a, b) => b.score - a.score);

  // 竞争排名：同分同名次（并列），后续名次跳过并列人数，如 1, 1, 3, 4…
  let dispRank = 0, prevScore = null;

  const board = $('#rank-board');
  board.innerHTML = '';
  list.forEach((entry, i) => {
    if (prevScore === null || entry.score !== prevScore) {
      dispRank = i + 1;
      prevScore = entry.score;
    }
    let badges = '';
    if (entry.passed) badges += '<span class="rank-badge b-pass">已进城</span>';
    if (entry.cityPassed) badges += '<span class="rank-badge b-city">市赛</span>';
    if (entry.provincePassed) badges += '<span class="rank-badge b-prov">省赛</span>';
    if (entry.nationalPassed) badges += '<span class="rank-badge b-nat">国赛</span>';
    const row = document.createElement('div');
    row.className = 'rank-row' + (entry.isMe ? ' me' : '');
    row.innerHTML = `
      <div class="rank-no">${dispRank}</div>
      <div class="rank-info">
        <div class="rank-name">${personaEmoji(entry.name)} ${escapeHtml(entry.name)}${entry.isMe ? '（我）' : ''} ${badges}</div>
        <div class="rank-meta">${escapeHtml(entry.city)} · ${escapeHtml(entry.province)}</div>
      </div>
      <div class="rank-score">${entry.score}</div>`;
    board.appendChild(row);
  });

  // 上下文提示（注意人物：不同榜单展示对应地域的同学）
  const note = $('#rank-note');
  if (rankScope === 'city') {
    note.textContent = state.profile.city
      ? `当前：市榜 — 仅显示和你一样想去「${state.profile.city}」的小伙伴，共 ${list.length} 人`
      : '你还没在「① 我的梦想」里选择想去的城市，市榜暂时只显示你自己。';
  } else if (rankScope === 'province') {
    note.textContent = province
      ? `当前：省榜 — 仅显示和你同属「${province}」的小伙伴，共 ${list.length} 人`
      : '你还没选择想去的城市，省榜暂时只显示你自己。';
  } else {
    note.textContent = `当前：国榜 — 全国小朋友同台竞技，共 ${list.length} 人`;
  }
}

function bindRank() {
  $$('#rank-tabs .rank-tab').forEach(t => t.addEventListener('click', () => setRankScope(t.dataset.scope)));
  setRankScope('national');
}

/* ---------- 启动 ---------- */
/* 物资每 10 天归零（你的物资清零；演示同学的物资重新发放一批，代表新一轮援助） */
const SUPPLY_CYCLE = 10 * 24 * 3600 * 1000;
function applySupplyReset() {
  const now = Date.now();
  if (!state.lastSupplyReset || now - state.lastSupplyReset >= SUPPLY_CYCLE) {
    state.supplies = 0;
    SEED_RANK.forEach(s => { s.supplies = 1 + Math.floor(Math.random() * 45); });
    state.lastSupplyReset = now;
    save();
  }
}
/* 距下次物资归零的剩余时间（用于数据整理展示） */
function nextSupplyResetText() {
  const msLeft = state.lastSupplyReset + SUPPLY_CYCLE - Date.now();
  if (msLeft <= 0) return '即将归零';
  const d = Math.floor(msLeft / 86400000);
  const h = Math.floor((msLeft % 86400000) / 3600000);
  return `约 ${d} 天 ${h} 小时后归零`;
}

function init() {
  bindRouter();
  bindDream();
  bindExam();
  bindPractice();
  bindData();
  bindRank();
  applySupplyReset();
  renderHome();
}
document.addEventListener('DOMContentLoaded', init);
