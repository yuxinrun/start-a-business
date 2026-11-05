// 把两份事实库分片按「页面 slug」反查成路由表，供 factbase.md 使用。
// 两种写法都要认：part-1 在末列写「｜/slug」，part-2 在主题列写「（/slug /slug）」与「（slug：/x/y）」。
// 只读 .qoder/factbase-part-*.md，输出 markdown 到 stdout。
import { readFileSync } from 'node:fs'

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
  { file: 'factbase-part-1.md', tag: '1' },
  { file: 'factbase-part-2.md', tag: '2' }
]

const byPage = new Map()
let matchedRows = 0

for (const { file, tag } of PARTS) {
  const lines = readFileSync(new URL(file, import.meta.url), 'utf8').split(/\r?\n/)
  for (const l of lines) {
    const idMatch = l.match(/^\|\s*([IPCMS]-\d+)\s*\|/)
    if (!idMatch) continue
    matchedRows++
    const id = idMatch[1]
    const cells = l.split('|').map((c) => c.trim())
    const grade = (cells[4] || '—').replace(/[（(].*$/, '').trim()
    const topic = (cells[2] || '').slice(0, 26)
    // 只认页面 slug：必须整段命中白名单，避免把 URL 里的路径当成页面
    const hits = PAGES.filter((p) =>
      new RegExp(`(?<![\\w./-])/${p.replace(/[/]/g, '\\/')}(?![\\w/-])`).test(l)
    )
    for (const p of hits) {
      if (!byPage.has(p)) byPage.set(p, [])
      byPage.get(p).push({ id, tag, grade, topic })
    }
  }
}

const rows = []
for (const p of PAGES) {
  const list = byPage.get(p)
  if (!list || !list.length) {
    rows.push(`| \`/${p}\` | 0 | 本页不引专属行号，只用第二节的冲突对照、第三节的拒印清单与第四节的红线 |`)
    continue
  }
  const cell = list.map((r) => `${r.id}(${r.tag}·${r.grade})`).join(' ')
  rows.push(`| \`/${p}\` | ${list.length} | ${cell} |`)
}
console.log(rows.join('\n'))
console.log('\n<!-- 诊断：命中行 ' + matchedRows + '，引用总数 ' +
  [...byPage.values()].reduce((n, v) => n + v.length, 0) +
  '，零引用页面 ' + PAGES.filter((p) => !byPage.has(p)).length + ' -->')
