# 创业这件事

一个讲「从 0 开始做一门生意」的中文手册站：要不要辞职、拿多少钱进去、行业怎么选、一单怎么算平、融资的代价、股权与控制权、招人与社保的真实成本、增长飞轮怎么装。

设计语言继承母品牌 [BRAND.md](./BRAND.md)（暖白纸面 + 深海墨绿 + 青色主强调 + 珊瑚红警示），站点图形按本站主题重画：导航标记是一枚火箭，吉祥物是一条戴安全帽推飞轮的小青鱼。

## 本地跑起来

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build    # 产物在 docs/.vitepress/dist
npm run preview
```

部署到 GitHub Pages 仓库名子路径时，构建要带前缀：

```bash
BASE=/start-a-business/ npm run build
```

## 目录

```
docs/                     首页 + 38 个正文页（reading-order.ts 是顺序与连播队列的唯一真相源）
docs/.vitepress/theme/
  index.ts                自动注册 components/ 下所有 .vue
  reading-order.ts        侧边栏 + 连播队列，同一份数据
  useSpeech.ts            SpeechSynthesis + MediaSession 引擎
  extract.ts              按 DOM 顺序抓正文，跳过图表
  style.css               品牌 token 与全站版式
  components/             29 个图表 / 交互组件（sb- 前缀）+ ListenBar / BrandMark / HeroFlywheel
docs/public/              logo.svg / logo-dark.svg / favicon.svg / founder-fish.svg
.qoder/                   调研产物、事实库、组件契约、正文契约
```

## 听书引擎的几个坑（改这里之前先读）

- **9 秒 resume 心跳**：Chrome 在约 15 秒静音后强行掐断长句朗读，引擎靠周期性 `speechSynthesis.resume()` 续命。别把它当冗余代码删掉。
- **图表必须 `data-listen="skip"`**：`extract.ts` 靠它跳过 SVG。代价是听的人读不到图里的数字，所以每张图的结论必须写进 `.sb-cap`，正文里还要以完整句子再出现一次。
- **依赖 DOM / localStorage 的组件要等挂载**：播放条用 `mounted` ref + `nextTick` 只在客户端渲染。SSR 阶段扫不到正文，首帧必然与客户端不一致，全站每页报 hydration mismatch。
- **`themeConfig.footer.message` 会被塞进 `<p>`**：里面只能放行内元素。放 `<div>` 会被浏览器自动断段，同样炸全站 hydration。品牌块用 `span` + `display:flex`。
- **连播队列 = `reading-order.ts`**：新增页面必须同时出现在这份表里，否则连播会静默停在上一页。

## 内容纪律

正文里的每个数字都要能在 `.qoder/factbase.md` 里找到出处，分级是 **A 可核 / B 需限定 / C 流行但证据弱**；C 级只能作为"流传说法"被辟谣，标了「拒绝给数」的条目一律不印具体数字。红线见 `.qoder/content-brief.md` 第六节：不承诺收益、不荐项目不带货、不给避税与规避劳动法的操作、不构成投资/法律/税务建议。

### 交稿前自查（三个脚本，只读，不改文件）

```bash
node .qoder/audit.mjs               # 结构、frontmatter、死链、黑话、承诺句式、字数
node .qoder/numcheck.mjs            # 正文每个数字能否回溯到事实库两分片
node .qoder/component-numcheck.mjs  # 组件里事实库没有的数字，必须自带「示意/假设/待核」标注
```

内容仅供商业信息参考，不构成投资、法律或税务建议。
