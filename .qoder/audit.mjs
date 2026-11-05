// 全站正文审计：结构 / 红线 / 数字来源。只读，不改文件。
// 用法：node .qoder/audit.mjs
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'D:/yuxinrun/start-a-business'
const DOCS = join(ROOT, 'docs')
const FACTS = ['factbase-part-1.md', 'factbase-part-2.md']
  .map((f) => readFileSync(join(ROOT, '.qoder', f), 'utf8'))
  .join('\n')

// 38 个路由：从 reading-order.ts 里抓，不写死
const ro = readFileSync(join(DOCS, '.vitepress/theme/reading-order.ts'), 'utf8')
const ROUTES = new Set([...ro.matchAll(/link:\s*'([^']+)'/g)].map((m) => m[1]))

const mdFiles = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (name === '.vitepress' || name === 'public' || name === 'node_modules') continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (name.endsWith('.md')) mdFiles.push(p)
  }
}
walk(DOCS)

// 禁的是"空洞搭配"，不是词本身：股息红利是税法固定用语、红海蓝海边是页面标题，都不该被误伤
const FORBIDDEN_PATTERNS = [
  [/流量红利|人口红利|时代红利|政策红利期|红利期/, '红利黑话'],
  [/风口上的猪|站在风口|追逐风口|下一个风口/, '风口黑话'],
  [/蓝海市场|一片蓝海|空白市场/, '蓝海黑话'],
  [/家人们|宝子|打工人/, '网络口癖'],
  [/值得注意的是|总而言之|在当今时代/, '空转句'],
  [/如下图|如上图|如图所示/, '图指引（听的人看不见）']
]
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u

const report = []
let problems = 0

for (const file of mdFiles) {
  const rel = file.slice(DOCS.length + 1).replace(/\\/g, '/')
  const src = readFileSync(file, 'utf8')
  const issues = []

  if (src.length < 1500 && rel !== 'index.md') issues.push(`疑似占位（${src.length} 字节）`)

  // frontmatter
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/)
  if (!fm) issues.push('缺 frontmatter')
  else {
    const title = fm[1].match(/^title:\s*"?([^"\n]+)"?/m)?.[1]
    const desc = fm[1].match(/^description:\s*"?([^"\n]+)"?/m)?.[1]
    if (!title) issues.push('frontmatter 无 title')
    if (!desc) issues.push('frontmatter 无 description')
    else {
      const n = (desc.match(/[\u4e00-\u9fff]/g) || []).length
      if (n < 25 || n > 90) issues.push(`description 汉字数 ${n}（目标 40–70）`)
      if (title && desc.includes(title)) issues.push('description 照抄 title')
    }
    const h1 = src.slice(fm[0].length).match(/^#\s+(.+)$/m)?.[1]
    if (title && h1 && title.trim() !== h1.trim()) issues.push(`title 与首个 # 不一致：「${title}」vs「${h1}」`)
    if (/draft:/.test(fm[1])) issues.push('frontmatter 里还留着 draft')
  }

  const body = src.replace(/^---[\s\S]*?---\n/, '')

  // 内链
  const links = [...body.matchAll(/\]\((\/[^)\s]*|\.\/[^)\s]*)/g)].map((m) => m[1])
  for (const l of links) {
    const clean = l.replace(/\.html$/, '').replace(/\.md$/, '').replace(/#.*$/, '')
    if (/\.md$/.test(l)) issues.push(`内链带 .md 后缀：${l}`)
    if (/\.html$/.test(l)) issues.push(`内链带 .html 后缀：${l}`)
    if (clean.startsWith('./')) continue
    if (!ROUTES.has(clean) && clean !== '/' && clean !== '') issues.push(`死链风险：${l}`)
  }

  for (const [re, label] of FORBIDDEN_PATTERNS) {
    const hit = body.match(re)
    if (hit) issues.push(`${label}：「${hit[0]}」`)
  }
  if (EMOJI.test(body)) issues.push('出现表情符号')
  if (!/:::\s*warning/.test(body) && !/layout:\s*home/.test(src) && !['listen.md', 'books/shelf.md', 'myths/list.md'].includes(rel))
    issues.push('无 ::: warning')

  // 承诺句式
  const promises = [...body.matchAll(/(一定能|肯定会|保证.{0,6}(回本|赚钱|拿到|通过)|照这么做.{0,10}(回本|见效)|\d+\s*(天|周)就能|稳赚)/g)].map((m) => m[1])
  if (promises.length) issues.push(`承诺句式：${promises.join(' / ')}`)

  // 字数
  const cjk = (body.match(/[\u4e00-\u9fff]/g) || []).length
  const limit = rel.startsWith('evidence/') ? 2200 : rel === 'about.md' ? 1200 : 2000
  if (cjk > limit + 250) issues.push(`正文 ${cjk} 汉字，超上限 ${limit}`)
  if (cjk < 700 && rel !== 'index.md') issues.push(`正文仅 ${cjk} 汉字，偏薄`)

  // 组件标签是否存在
  for (const c of [...body.matchAll(/<([A-Z][A-Za-z]+)([^>]*)>/g)]) {
    const name = c[1]
    if (['BrandMark', 'HeroFlywheel'].includes(name)) continue
    if (!existsSync(join(DOCS, '.vitepress/theme/components', `${name}.vue`))) issues.push(`组件不存在：<${name} />`)
  }

  if (issues.length) { report.push(`\n### ${rel}\n` + issues.map((i) => `- ${i}`).join('\n')); problems += issues.length }
}

console.log(`扫描 ${mdFiles.length} 个页面，路由白名单 ${ROUTES.size} 条，问题 ${problems} 项\n`)
console.log(report.join('\n') || '（无问题）')
