import { defineConfig } from 'vitepress'
import { ORDER } from './theme/reading-order'

// 仓库名部署（https://<user>.github.io/start-a-business/）时构建用 BASE=/start-a-business/
// 绑定自定义域名时保持 BASE=/
const base = process.env.BASE ?? '/'

const siteTitle = '创业这件事'

const sidebar = ORDER.map((g) => ({
  text: g.group,
  collapsed: false,
  items: g.items.map((i) => ({ text: i.text, link: i.link }))
}))

const nav = [
  { text: '准备', link: '/ready/self', activeMatch: '/ready/' },
  { text: '行业', link: '/industry/how-to-choose', activeMatch: '/industry/' },
  { text: '算账', link: '/model/unit-economics', activeMatch: '/model/' },
  { text: '融资', link: '/money/need', activeMatch: '/money/' },
  { text: '公司', link: '/structure/entity', activeMatch: '/structure/' },
  { text: '用人', link: '/people/hire', activeMatch: '/people/' },
  { text: '飞轮', link: '/run/flywheel', activeMatch: '/run/' },
  {
    text: '更多',
    items: [
      { text: '创业自评', link: '/quiz' },
      { text: '数字速查表', link: '/evidence/numbers' },
      { text: '创业书单', link: '/books/shelf' },
      { text: '听书怎么用', link: '/listen' },
      { text: '关于本站', link: '/about' },
      {
        text: '姊妹站：养大一个人 ↗',
        link: 'https://yuxinrun.github.io/child-rearing/',
        target: '_blank',
        rel: 'noopener'
      },
      {
        text: '姊妹站：MCP Patterns ↗',
        link: 'https://yuxinrun.github.io/mcp-patterns/',
        target: '_blank',
        rel: 'noopener'
      }
    ]
  }
]

export default defineConfig({
  title: siteTitle,
  // 首页在 index.md 里单独给了 title，否则模板会念成"创业这件事 · 创业这件事"
  titleTemplate: `:title · ${siteTitle}`,
  description:
    '把开公司这件事讲成人话的手册：要不要辞职、启动资金怎么算、行业怎么选、一单的账怎么算平、融资的代价、股权与控制权、招人与社保的真实成本、以及增长飞轮怎么装起来。全站可以听完。',
  base,
  lang: 'zh-CN',
  appearance: true,
  lastUpdated: true,
  metaChunk: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#f6f4ee', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#06100e', media: '(prefers-color-scheme: dark)' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  markdown: {
    theme: { light: 'github-dark', dark: 'github-dark' },
    lineNumbers: false,
    image: { lazyLoading: true }
  },
  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo-dark.svg' },
    siteTitle,
    nav,
    sidebar,
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一节（也是连播的上一节）', next: '下一节' },
    lastUpdated: { text: '最后更新于', formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
    footer: {
      // 注意：这里的内容会被塞进 <p class="message">，只能放行内元素，放 div 会引发全站 hydration mismatch
      message: `<span class="mp-footer-brand"><img src="${base}founder-fish.svg" alt="戴着安全帽推着飞轮的青色小鱼" width="1024" height="1024" /><span>鱼心快跑，也要创业</span></span>`,
      copyright: '© 2026 鱼心快跑 · 创业这件事｜内容仅供商业信息参考，不构成投资、法律或税务建议'
    },
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: { buttonText: '搜索手册', buttonAriaLabel: '搜索手册' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询',
            backButtonTitle: '返回',
            noResultsText: '没有找到结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    langMenuLabel: '切换语言',
    notFound: {
      title: '这一页还没开张',
      quote: '这条链接指向的页面不存在。回首页从 3 分钟自评开始，或者直接把这本手册听完。',
      linkText: '返回首页'
    }
  },
  transformHead({ pageData }) {
    const fallback = '创业这件事｜把开公司这件事讲成人话的可听版手册'
    const t = pageData.frontmatter.title
    const title = t ? `${t} · ${siteTitle}` : fallback
    const fmDesc = pageData.frontmatter.description
    const description =
      typeof fmDesc === 'string' && fmDesc
        ? fmDesc
        : '启动资金与第一年现金流、行业选择的三步、一单怎么算平、融资轮次与条款、股权与控制权、招人与社保成本、增长飞轮与 14 条流行说法的辟谣。全站支持自动连播，通勤路上正好听完两页。'
    return [
      ['meta', { name: 'author', content: '鱼心快跑' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    ]
  }
})
