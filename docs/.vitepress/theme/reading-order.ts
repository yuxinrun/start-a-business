export type ListenItem = { text: string; link: string }
export type ListenGroup = { group: string; items: ListenItem[] }

// 全站唯一的阅读顺序。config.mts 用它生成侧边栏，听书引擎用它生成连播队列。
// 新增页面必须同时出现在这里，否则连播会静默停在上一页。
export const ORDER: ListenGroup[] = [
  {
    group: '开始',
    items: [
      { text: '这本手册怎么用（先做 3 分钟自评）', link: '/start' },
      { text: '把这本手册当成有声书', link: '/listen' },
      { text: '创业自评：你现在卡在哪一格', link: '/quiz' }
    ]
  },
  {
    group: '先想清楚',
    items: [
      { text: '你适不适合创业：先把性格问题问完', link: '/ready/self' },
      { text: '启动资金：亏多少会伤到你', link: '/ready/money' },
      { text: '第一年真实的账：钱从哪来、往哪去', link: '/ready/first-year' },
      { text: '开张前先谈好怎么散伙', link: '/ready/exit-plan' }
    ]
  },
  {
    group: '行业与赛道',
    items: [
      { text: '选行业的三步：能算的、能扛的、能活的', link: '/industry/how-to-choose' },
      { text: '行业菜单：不同赛道各自的账本', link: '/industry/menus' },
      { text: '红海、蓝海与「看起来很赚钱」', link: '/industry/red-ocean' },
      { text: '切入方式：从副业、加盟到自创品牌', link: '/industry/entry' }
    ]
  },
  {
    group: '商业模式的算术',
    items: [
      { text: '一单的账：毛利、贡献与回本', link: '/model/unit-economics' },
      { text: '定价：贵不是问题，说不清为什么贵才是', link: '/model/pricing' },
      { text: '现金流：利润是观点，现金是事实', link: '/model/cashflow' },
      { text: '毛利、净利与「多少算好」', link: '/model/margin' }
    ]
  },
  {
    group: '融资',
    items: [
      { text: '要不要融资、要多少、什么时候要', link: '/money/need' },
      { text: '轮次地图：天使、A、B 与它们各自的代价', link: '/money/rounds' },
      { text: '条款清单：估值之外真正要紧的东西', link: '/money/terms' },
      { text: '人民币基金、对赌与实缴：本土规则', link: '/money/cn' }
    ]
  },
  {
    group: '公司与架构',
    items: [
      { text: '主体形式：个体户、个独、合伙、有限公司', link: '/structure/entity' },
      { text: '股权分配：分多少、怎么兑现', link: '/structure/equity' },
      { text: '控制权：股份少了还能不能说话算数', link: '/structure/control' },
      { text: '组织架构：人多了以后怎么分组', link: '/structure/org' }
    ]
  },
  {
    group: '用人与待遇',
    items: [
      { text: '招人：第一个该招的是谁', link: '/people/hire' },
      { text: '待遇：薪酬、期权与社保的真实成本', link: '/people/pay' },
      { text: '劳动法红线：试用期、加班与辞退', link: '/people/labor' },
      { text: '离职与裁员：怎么把散伙做得体面', link: '/people/leave' }
    ]
  },
  {
    group: '运营与飞轮',
    items: [
      { text: '看哪几个数：北极星、留存与单位经济', link: '/run/metrics' },
      { text: '获客：渠道会饱和，先算 CAC 和回收期', link: '/run/acquisition' },
      { text: '飞轮：让增长自己转起来', link: '/run/flywheel' },
      { text: '把公司变成机器：流程、SOP 与授权', link: '/run/system' }
    ]
  },
  {
    group: '误区与真相',
    items: [
      { text: '14 条最常听到的创业说法', link: '/myths/list' },
      { text: '那些听起来很科学的创业数字', link: '/myths/numbers' }
    ]
  },
  {
    group: '证据与出处',
    items: [
      { text: '数字速查表', link: '/evidence/numbers' },
      { text: '来源与分级', link: '/evidence/sources' },
      { text: '我们不写的说法（红线清单）', link: '/evidence/red-lines' }
    ]
  },
  {
    group: '书单',
    items: [{ text: '创业书单：哪些值得读完', link: '/books/shelf' }]
  },
  {
    group: '关于',
    items: [{ text: '关于本站', link: '/about' }]
  }
]

export const FLAT: ListenItem[] = ORDER.flatMap((g) => g.items)

export const groupOf = (link: string): string | undefined =>
  ORDER.find((g) => g.items.some((i) => normalize(i.link) === normalize(link)))?.group

export const indexOfLink = (link: string): number =>
  FLAT.findIndex((i) => normalize(link) === normalize(i.link))

export function normalize(link: string): string {
  if (!link) return ''
  let l = link.split('#')[0].split('?')[0]
  l = l.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\.md$/, '')
  if (!l.startsWith('/')) l = `/${l}`
  l = l.replace(/\/$/, '')
  return l === '' ? '/' : l
}
