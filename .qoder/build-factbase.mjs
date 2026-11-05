// 生成 .qoder/factbase.md —— 全站唯一的「数字入口」文件。
// 它本身不装数字，只做三件事：定规矩、给路由（页面 → 行号）、指路（章节行号地图）。
// 数字住在 factbase-part-1.md（国际+本土）与 factbase-part-2.md（图书+路径）。
import { readFileSync, writeFileSync } from 'node:fs'

const PAGES = [
  'ready/self', 'ready/money', 'ready/first-year', 'ready/exit-plan',
  'industry/how-to-choose', 'industry/menus', 'industry/red-ocean', 'industry/entry',
  'model/unit-economics', 'model/pricing', 'model/cashflow', 'model/margin',
  'money/need', 'money/rounds', 'money/terms', 'money/cn',
  'structure/entity', 'structure/equity', 'structure/control', 'structure/org',
  'people/hire', 'people/pay', 'people/labor', 'people/leave',
  'run/metrics', 'run/acquisition', 'run/flywheel', 'run/system',
  'myths/list', 'myths/numbers',
  'evidence/numbers', 'evidence/sources', 'evidence/red-lines', 'books/shelf'
]

const PARTS = [
  { file: 'factbase-part-1.md', tag: '1', label: '国际 + 本土' },
  { file: 'factbase-part-2.md', tag: '2', label: '图书 + 路径' }
]

const text = (f) => readFileSync(new URL(f, import.meta.url), 'utf8').split(/\r?\n/)
const docs = PARTS.map((p) => ({ ...p, lines: text(p.file) }))

/* ---------- 路由表：页面 → 行号 ---------- */
const byPage = new Map()
for (const { lines, tag } of docs) {
  for (const l of lines) {
    const m = l.match(/^\|\s*([IP]-\d+)\s*\|/)
    if (!m) continue
    const cells = l.split('|').map((c) => c.trim())
    const grade = (cells[4] || '—').replace(/[（(].*$/, '').trim()
    const hits = PAGES.filter((p) =>
      new RegExp(`(?<![\\w./-])/${p.replace(/\//g, '\\/')}(?![\\w/-])`).test(l)
    )
    for (const p of hits) {
      if (!byPage.has(p)) byPage.set(p, [])
      byPage.get(p).push(`${m[1]}(第${tag}片·${grade})`)
    }
  }
}
const routing = PAGES.map((p) => {
  const list = byPage.get(p) || []
  return `| \`/${p}\` | ${list.length} | ${
    list.length ? list.join(' ') : '本页不引专属行号，只用第三节冲突对照、第四节拒印清单与第五节红线'
  } |`
}).join('\n')

/* ---------- 章节行号地图 ---------- */
const map = docs
  .map(({ file, label }) => {
    const ls = text(file)
    const heads = ls
      .map((l, i) => (l.startsWith('## ') ? { h: l.slice(3).trim(), n: i + 1 } : null))
      .filter(Boolean)
    const rows = ls.filter((l) => /^\|\s*[IP]-\d+\s*\|/.test(l)).length
    const body = heads
      .map((hd, i) => `| ${hd.h} | 第 ${hd.n}–${(heads[i + 1]?.n ?? ls.length) - 1} 行 |`)
      .join('\n')
    return `### ${file}（${label}，${rows} 条行号）\n\n| 章节 | 行号范围 |\n|---|---|\n${body}`
  })
  .join('\n\n')

/* ---------- 从 part-2 原样摘出「五条硬禁令」与「交付前自检」 ---------- */
const slice = (file, from, to) => {
  const ls = text(file)
  const a = ls.findIndex((l) => l.startsWith(from))
  const b = ls.findIndex((l, i) => i > a && (to ? l.startsWith(to) : /^#{2,3} /.test(l)))
  return ls.slice(a, b === -1 ? ls.length : b).join('\n').trimEnd()
}
const bans = slice('factbase-part-2.md', '### 四·〇', '### 四·一')
const checklist = slice('factbase-part-2.md', '### 四·三', null)

const out = `# 事实库 · 入口（factbase.md）

> 这个文件不装数字。数字住在两份分片里，本文件只规定**怎么取**、**取哪些**、**取完自查什么**。
> 全站规矩一句话：**分片里没有的数字，不许写进正文，也不许画进图表。**

## 〇、怎么取数（三步，别跳）

1. 在下面的「页面路由表」里找到自己那一页的行号（如 \`I-01\`、\`P-38\`）。
2. 去对应分片按行号 grep（\`grep -n "^| I-01 " factbase-part-1.md\`），**整行读完**：「事实」列可以直接进正文，「使用注意」列的限定语必须一起进正文——限定语不是客套，是那句话的重量。
3. 抄的时候照抄分级：A 可直说；B 必须带限定语；C 只能在辟谣语境出现，且第一句标明「这是流传说法／招商话术／自媒体整理」。

拿不到行号的数字，就别说它。改写成一个读者能自己查的动作（去哪看、看哪个字段），或写算法不给结果。

## 一、五条硬禁令

${bans}

## 二、分级与冲突处理（两份分片的共同规矩，摘录）

- **A 可核**：可直说，但仍要写出处。**B 需限定**：限定语写进正文，重量写到「样本 12 人」「问卷自报」「两套口径不一致」这一级。**C 流行说法**：只许出现在辟谣语境，第一句就标明它是流传说法。
- **两套口径分开摆，绝不合并成一个数。**想「取平均」的冲动一律改成并列两张图。
- **书里的观点不是事实**：作者主张、案例、轶事不进核心事实表，只进冲突对照与反鸡汤清单，并各带自己的证据等级。
- 费率、政策、法条一律写「截至 2026 年（抓取月份），以官方最新公示为准」；平台规则要留截图与抓取日期。
- 本库不做法律、税务、医疗意见，只判断「能不能写、要带什么限定语」。个案只能写成「某地法院曾这样判」「匿名个案」。

## 三、页面路由表（写哪页，先查哪几行）

| 页面 | 专属行号数 | 行号（括号＝第几片 + 分级） |
|---|---|---|
${routing}

路由表按各行的「来源」列自动生成（\`.qoder/route-facts.mjs\`），行号未标页面的条目不会消失，按分片第一节的主题小节查即可。

## 四、分片章节地图（哪节在哪几行）

${map}

## 五、交付前自检（每页过一遍）

${checklist}
`

writeFileSync(new URL('factbase.md', import.meta.url), out)
console.log(out.length + ' bytes written; routing refs=' + [...byPage.values()].reduce((n, v) => n + v.length, 0))
