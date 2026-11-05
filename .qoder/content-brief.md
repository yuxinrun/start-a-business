# start-a-business 正文契约（八个人同时写，靠这份对齐）

写之前必读顺序：**`.qoder/factbase.md`（数字与红线）→ 本文件（怎么写）→ `.qoder/component-spec.md` 第五节（哪个组件在哪页）**。
本文件只管文风、结构、密度、链接、禁区。数字一律以 `factbase.md` 为准，**事实库里没有的数字不许写进正文**；事实库里明确"拒绝给数"的条目，正文里也不许出现具体数字。

## 一、这个站在回答什么问题

读者不是创业者，是**正在犹豫要不要创业的人**。他有一件想做的小事，手上有点钱，脑子里全是"要不要辞职""要不要找人投""股权是不是五五分"。
每一页只回答一个问题，并且在这一页的第一屏就把答案给出来。不铺垫、不讲故事讲三段才进正题。
全站的态度：**不劝进，也不劝退，只把账算清**。

## 二、页面骨架（照抄，不要发明新结构）

```markdown
---
title: "页面标题（口语，可带冒号）"
description: "一句话摘要，会进搜索结果和 og:description。40–70 字，说清这页给什么。"
---

# 页面标题

周三晚上十一点，你把那份写了三遍的计划又删了一遍…… ← 第一句必须是**具体场景**：时间点、动作、手里的东西。不许从定义开始。
（第二、三段把场景收到本页要回答的那个问题上，最多三段。）

## 本页第一个小标题（是一个判断句，不是名词）

正文段落。一段 2–4 句，一句不超过 30 字。

<ComponentName />

::: warning 这页不能替你做决定（法律/税务/融资类页面必带，标题按页面调整）
以下是公开口径下的常识整理，不构成投资、法律或税务建议。落到自己那件事上，请找执业律师 / 会计师 / 当地人社局。
:::

<div class="mp-quote">本页最需要被记住的那句话。</div>
```

- 小标题写**判断句**（"注册资本不是写得越大越好"），不写名词短语（"资本制度概述"）。听书时听众只能靠标题分段。
- `title` 与正文首个 `#` 一致。frontmatter 里不要再写 `draft`。

## 三、版式原语（已在 style.css 里，直接用，不要新写 CSS）

| 原语 | 用途 |
| --- | --- |
| `<div class="mp-quote">…</div>` | 一句可被记住的话。每页 1–2 个，别超过 3 个 |
| `.mp-stats` + `.mp-stat`（`<strong>数字</strong><span>说明</span>`） | 3–4 个硬指标并列开场 |
| `.mp-steps` + `.mp-step` | 落地流程（注册五步、离职交接、第一周该干什么） |
| `.mp-grid` + `.mp-card` | 并列的 3–6 个条目 |
| `.mp-split` | 左右对照（你以为的 vs 实际的） |
| `.mp-band` + `.mp-band-grid` + `.mp-band-card` | 分级清单（风险档、轮次、组织阶段） |
| `.mp-tags` | 标签行 |
| `::: warning` / `::: tip` / `::: info` | 免责与法律提示用 warning，可操作提示用 tip，中性补充用 info |

图表一律用注册好的组件标签（`<UnitEconomicsStack />` 等）。**缺图就用原语拼，不许改组件、不许加新组件、不许动 `style.css` / `index.ts` / `reading-order.ts` / `config.mts`。**

## 四、密度与"听"的约束（硬性）

1. **每 400–600 字必须有一个可视化**（组件或原语块）。连续正文不得超过 12 行。
2. 数字放在图里，**"所以呢"放在正文里**。图表带 `data-listen="skip"`，听书会整块跳过——所以每个要记住的数字必须在正文里以完整句子再出现一次，否则听的人拿不到。
3. 每个组件后面紧跟一句承接（"这张图里值得记住的是最后那一格"），不许把图孤立地插在那里。
4. 一页正文目标：**1200–2000 字**（`/start` `/listen` 与 `/evidence/*` 可到 2200；`/about` 800–1200）。不要为了凑字数铺陈。
5. 人民币一律写"约 X 万元"或"¥X"，不混用"米""w""个"这类黑话。

## 五、幽默怎么来

幽默来自**具体场景和准确的比喻**，不来自网络梗。允许："你以为创业是当老板，实际是给自己找了个最难伺候的员工，然后天天给他发工资"；"注册资本填一千万，就像在简历上写身高一米九——没人当场量，但迟早要填表"。
禁止：表情符号、"打工人/家人们/宝子"式口癖、谐音梗标题、把读者的窘迫当笑话。
**禁区（不许玩笑）**：劳动法与裁员段落、破产与债务、合伙人反目、创业者的心理健康与抑郁、任何"别人失败真好笑"的段落。这些写成短句 + 明确指令。

## 六、红线（违反就返工）

以 `factbase.md` 第四节为准。摘要版：

- **不承诺收益、不承诺成功率、不承诺回本周期。**"照这么做，一年内回本"是禁止句式。
- **不荐股、不荐项目、不荐基金、不荐平台、不荐服务商、不带货。** 出现任何品牌名只能是"举例说明某类做法"，且不得评价其好坏。
- **不给避税方案、不给规避劳动法的做法、不给"代持/阴阳合同/挂靠"操作指引。** 涉及税负与用工，只讲公开规则 + 让人去找专业人士。
- **不写融资谈判话术、不教包装数据。** 条款只解释"它怎么咬人"，不教"怎么骗过投资人"。
- **不劝人辞职，也不劝人别辞职。** 一律写成"如果……那你可以承受；如果……那这笔账不划算"。
- 事实库里标 **C 级**的说法只能出现在辟谣语境，且明确写成"流传说法"；标"拒绝给数"的条目**不许出现具体数字**，改成定性表述。
- 数字带单位与口径（"美国劳工统计局口径的雇主企业，第 5 年仍在报工资的比例约 50%"）。等级 B 必须带限定语。
- 每页页脚之外，还必须在正文里出现一次"这不构成投资/法律/税务建议"（`::: warning` 形式）。

## 七、链接

内链只能用 `reading-order.ts` 里已有的 **38 个路由**，写成 `/ready/money` 这样的绝对路径（不带 `.md`）。**不许造新链接**——VitePress 构建会因死链失败。
外链只用在"来源与出处"，且必须是 `factbase.md` 里已经带 URL 的那条。每页至少 2 个指向站内其它页的"接着读"链接。

## 八、每人负责的文件（不要碰别人的）

| 负责 | 文件 |
| --- | --- |
| W1 | `docs/index.md`（首页，`layout: home` + hero + features + 正文区）、`docs/start.md`、`docs/listen.md`、`docs/about.md` |
| W2 | `docs/quiz.md`、`docs/ready/self.md`、`docs/ready/money.md`、`docs/ready/first-year.md`、`docs/ready/exit-plan.md` |
| W3 | `docs/industry/how-to-choose.md`、`docs/industry/menus.md`、`docs/industry/red-ocean.md`、`docs/industry/entry.md` |
| W4 | `docs/model/unit-economics.md`、`docs/model/pricing.md`、`docs/model/cashflow.md`、`docs/model/margin.md` |
| W5 | `docs/money/need.md`、`docs/money/rounds.md`、`docs/money/terms.md`、`docs/money/cn.md` |
| W6 | `docs/structure/entity.md`、`docs/structure/equity.md`、`docs/structure/control.md`、`docs/structure/org.md` |
| W7 | `docs/people/hire.md`、`docs/people/pay.md`、`docs/people/labor.md`、`docs/people/leave.md` |
| W8 | `docs/run/metrics.md`、`docs/run/acquisition.md`、`docs/run/flywheel.md`、`docs/run/system.md` |
| W9 | `docs/myths/list.md`、`docs/myths/numbers.md`、`docs/evidence/numbers.md`、`docs/evidence/sources.md`、`docs/evidence/red-lines.md`、`docs/books/shelf.md` |

组件归属见 `component-spec.md` 第五节的表；首页 hero 里的飞轮图由 Layout 插槽自动注入，正文里**不要**写它。

## 九、交稿前自查（每页都过一遍）

- [ ] 第一句是场景，不是定义
- [ ] 每 400–600 字有一个可视化，连续正文没超 12 行
- [ ] 每个图表后面有一句承接，图里的关键数字在正文里以句子形式出现过
- [ ] 所有数字都能在 `factbase.md` 里找到，等级 B 的带了限定语，"拒绝给数"的没印具体数字
- [ ] 内链全在 38 个路由内，没有 `.md` 后缀
- [ ] 法律/税务/融资/用工页有 `::: warning`，且没有承诺、没有操作规避
- [ ] `description` 40–70 字，没有照抄标题
- [ ] 朗读友好：没有只用括号表达的信息、没有"如下图"（要说"上面这张图"，因为听的人看不见）
- [ ] 删掉了所有"值得注意的是""总而言之""在当今时代"这类空转句
