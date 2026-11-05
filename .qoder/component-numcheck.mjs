// 组件数字校对：脚本里出现的"数据型数字"，凡 factbase 分片里查不到的，
// 必须在该组件里被标成示意/假设/举例，否则列出来人工处理。
// 用法：node .qoder/component-numcheck.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'D:/yuxinrun/start-a-business'
const COMP = join(ROOT, 'docs/.vitepress/theme/components')
const fact = ['factbase-part-1.md', 'factbase-part-2.md']
  .map((f) => readFileSync(join(ROOT, '.qoder', f), 'utf8'))
  .join('\n')
  .replace(/,/g, '')

// 几何常量（viewBox、半径、字号、月份序号）不回查
const GEOM_OK = (v) => Number.isInteger(v) && (v <= 40 || [100, 180, 360, 1024, 12, 24, 48, 52, 60, 90].includes(v))
// 会被写进图里的年份与法条号
const YEARISH = (v) => v >= 1980 && v <= 2035

const rows = []
for (const name of readdirSync(COMP).filter((f) => f.endsWith('.vue'))) {
  const src = readFileSync(join(COMP, name), 'utf8')
  const script = src.match(/<script setup[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? ''
  const labeled = /示意|假设|举例|待核|以当地当年|以官方最新|不是统计|经验线|口径为准/.test(src)

  const unverified = new Set()
  for (const m of script.matchAll(/(?<![\w.])(\d+(?:\.\d+)?)(?![\w.])/g)) {
    const raw = m[1]
    const v = parseFloat(raw)
    if (GEOM_OK(v) || YEARISH(v)) continue
    // 小数位数 ≤2 且能在 factbase 找到才算命中（允许 79.6 写成 79.60）
    const trimmed = raw.replace(/\.0+$/, '')
    if (fact.includes(trimmed) || fact.includes(trimmed + '%')) continue
    unverified.add(raw)
  }
  if (unverified.size) {
    rows.push(`${labeled ? '已标注' : '★未标注'}  ${name.padEnd(24)} ${unverified.size} 个  ${[...unverified].slice(0, 14).join(' ')}`)
  }
}
console.log(rows.join('\n') || '所有组件的数字都能在 factbase 里查到')
