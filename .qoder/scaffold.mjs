import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const DOCS = join(process.cwd(), 'docs')

// link -> [component tags]
const COMPONENTS = {
  '/start': ['RoadmapStrip'],
  '/quiz': ['BusinessQuiz'],
  '/ready/self': ['FounderFitRadar'],
  '/ready/money': ['RunwayBucket'],
  '/ready/first-year': ['FirstYearCurve'],
  '/ready/exit-plan': ['ExitClauseCards'],
  '/industry/how-to-choose': ['IndustryFunnel'],
  '/industry/menus': ['SectorLedger'],
  '/industry/red-ocean': ['RedOceanMatrix'],
  '/industry/entry': ['EntryLadder'],
  '/model/unit-economics': ['UnitEconomicsStack'],
  '/model/pricing': ['PricingLadder'],
  '/model/cashflow': ['CashFlowGap'],
  '/model/margin': ['MarginWaterfall'],
  '/money/need': ['FundDecisionTree'],
  '/money/rounds': ['RoundDilution'],
  '/money/terms': ['TermSheetAnatomy'],
  '/money/cn': ['FundSourcesCn'],
  '/structure/entity': ['EntityCompare'],
  '/structure/equity': ['VestingCurve'],
  '/structure/control': ['ControlThreshold'],
  '/structure/org': ['OrgStages'],
  '/people/hire': ['HireOrder'],
  '/people/pay': ['PayCostBreakdown'],
  '/people/labor': ['LaborRedLines'],
  '/run/acquisition': ['CacPayback'],
  '/run/flywheel': ['FlywheelDiagram'],
  '/myths/list': ['MythFlip'],
  '/books/shelf': ['BookShelf']
}

const PAGES = [
  '/start', '/listen', '/quiz',
  '/ready/self', '/ready/money', '/ready/first-year', '/ready/exit-plan',
  '/industry/how-to-choose', '/industry/menus', '/industry/red-ocean', '/industry/entry',
  '/model/unit-economics', '/model/pricing', '/model/cashflow', '/model/margin',
  '/money/need', '/money/rounds', '/money/terms', '/money/cn',
  '/structure/entity', '/structure/equity', '/structure/control', '/structure/org',
  '/people/hire', '/people/pay', '/people/labor', '/people/leave',
  '/run/metrics', '/run/acquisition', '/run/flywheel', '/run/system',
  '/myths/list', '/myths/numbers',
  '/evidence/numbers', '/evidence/sources', '/evidence/red-lines',
  '/books/shelf', '/about'
]

let created = 0
for (const link of PAGES) {
  const file = join(DOCS, `${link}.md`)
  mkdirSync(dirname(file), { recursive: true })
  if (existsSync(file)) continue
  const tags = (COMPONENTS[link] ?? []).map((c) => `<${c} />\n`).join('')
  writeFileSync(
    file,
    `---\ntitle: 占位页\ndescription: 内容待写\ndraft: true\n---\n\n# 占位\n\n这一页还在写。\n\n${tags}`,
    'utf8'
  )
  created += 1
}

mkdirSync(DOCS, { recursive: true })
if (!existsSync(join(DOCS, 'index.md'))) {
  writeFileSync(
    join(DOCS, 'index.md'),
    `---\nlayout: home\ntitle: 创业这件事\n---\n\n# 占位首页\n`,
    'utf8'
  )
  created += 1
}

console.log(`created ${created} stub pages under docs/`)
