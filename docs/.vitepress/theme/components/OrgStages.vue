<script setup lang="ts">
type Tone = 'lead' | 'team' | 'staff'
type AddKind = 'people' | 'struct' | 'cut'

interface Box {
  x: number
  y: number
  w: number
  h: number
  tone: Tone
  label?: string
}

interface Link {
  x1: number
  y1: number
  x2: number
  y2: number
}

interface Stage {
  size: string
  en: string
  shape: string
  layers: string
  desc: string
  mistake: string
  mistakeSay: string
  addTitle: string
  addSay: string
  addKind: AddKind
  boxes: Box[]
  links: Link[]
  band?: { x: number; y: number; w: number; h: number; label: string }
}

// 三档人数（10 / 50 / 150）是本站画"形状"用的示意刻度，不是统计结论：
// 一手研究里没有验证过"到多少人必须分层"这种阈值（.qoder/facts-intl.md 第 160 行的红线），
// 所以图上不写"150 人天花板"，只用每档的形状 + 该档最典型的错来说话。
const STAGES: Stage[] = [
  {
    size: '10 人',
    en: 'Flat',
    shape: '一个人加一双手',
    layers: '中间层 0 层 · 沟通靠喊话',
    desc: '没有部门，只有"现在谁有空"。创始人是首席销售，也是最贵的客服。消息从头部到尾巴一趟走到底，不用转手。',
    mistake: '过早设部门',
    mistakeSay: '给三个人封"总监"，头衔先于职责。招人变成排座次，钱花在名字上，活还是那几个人干。',
    addTitle: '加人',
    addSay: '结构先别动。再买一双手，把你从唯一会干的那件事上换下来；等某类事天天出乱子，再为它设岗。',
    addKind: 'people',
    boxes: [
      { x: 88, y: 8, w: 64, h: 22, tone: 'lead', label: '创始人' },
      { x: 8, y: 92, w: 32, h: 20, tone: 'staff' },
      { x: 46, y: 92, w: 32, h: 20, tone: 'staff' },
      { x: 84, y: 92, w: 32, h: 20, tone: 'staff' },
      { x: 122, y: 92, w: 32, h: 20, tone: 'staff' },
      { x: 160, y: 92, w: 32, h: 20, tone: 'staff' },
      { x: 198, y: 92, w: 32, h: 20, tone: 'staff' }
    ],
    links: [
      { x1: 120, y1: 30, x2: 24, y2: 92 },
      { x1: 120, y1: 30, x2: 62, y2: 92 },
      { x1: 120, y1: 30, x2: 100, y2: 92 },
      { x1: 120, y1: 30, x2: 138, y2: 92 },
      { x1: 120, y1: 30, x2: 176, y2: 92 },
      { x1: 120, y1: 30, x2: 214, y2: 92 }
    ]
  },
  {
    size: '50 人',
    en: 'Functional',
    shape: '按职能切几组，中间多一层',
    layers: '中间层 1 层 · 沟通靠转手',
    desc: '按功能切成几组，中间垫进一层负责人。这层的价值是把话接住再传下去；代价是转手会走形——你听到的已经是第三手。',
    mistake: '把"我说过了"当成沟通机制',
    mistakeSay: '你以为全员都懂了，实际只有一屋子人点头。失真从这一档开始，不是到 150 人才开始。',
    addTitle: '加结构',
    addSay: '同一件事固定三个渠道：书面写一遍、周会讲一遍、一对一对齐一遍。少一个渠道，就多一批"我以为"。',
    addKind: 'struct',
    boxes: [
      { x: 92, y: 6, w: 56, h: 20, tone: 'lead', label: '创始人' },
      { x: 12, y: 46, w: 52, h: 20, tone: 'team', label: '负责人' },
      { x: 94, y: 46, w: 52, h: 20, tone: 'team', label: '负责人' },
      { x: 176, y: 46, w: 52, h: 20, tone: 'team', label: '负责人' },
      { x: 5, y: 92, w: 32, h: 18, tone: 'staff' },
      { x: 39, y: 92, w: 32, h: 18, tone: 'staff' },
      { x: 87, y: 92, w: 32, h: 18, tone: 'staff' },
      { x: 121, y: 92, w: 32, h: 18, tone: 'staff' },
      { x: 169, y: 92, w: 32, h: 18, tone: 'staff' },
      { x: 203, y: 92, w: 32, h: 18, tone: 'staff' }
    ],
    links: [
      { x1: 120, y1: 26, x2: 38, y2: 46 },
      { x1: 120, y1: 26, x2: 120, y2: 46 },
      { x1: 120, y1: 26, x2: 202, y2: 46 },
      { x1: 38, y1: 66, x2: 21, y2: 92 },
      { x1: 38, y1: 66, x2: 55, y2: 92 },
      { x1: 120, y1: 66, x2: 103, y2: 92 },
      { x1: 120, y1: 66, x2: 137, y2: 92 },
      { x1: 202, y1: 66, x2: 185, y2: 92 },
      { x1: 202, y1: 66, x2: 219, y2: 92 }
    ]
  },
  {
    size: '150 人',
    en: 'Business line',
    shape: '几条业务线，上面一层中台',
    layers: '中间层 2 层 · 沟通靠流程',
    desc: '切成几条能独立算账的业务线，公共职能垫在上面。喊话已经传不到最后一排，改靠流程、例会、写得下来的文档和数据。',
    mistake: '没有 SOP',
    mistakeSay: '每件事都要你重新拍一次板，于是公司越大你越像瓶颈：你休假一周，事就停一周。',
    addTitle: '写文档，删会',
    addSay: '重复过三次的事就写成 1 页纸：触发条件、负责人、例外怎么走。写完没人读的先删，别拿会议数量当管理力度。',
    addKind: 'cut',
    boxes: [
      { x: 88, y: 4, w: 64, h: 18, tone: 'lead', label: '经营层' },
      { x: 12, y: 38, w: 52, h: 20, tone: 'team', label: '业务线 A' },
      { x: 94, y: 38, w: 52, h: 20, tone: 'team', label: '业务线 B' },
      { x: 176, y: 38, w: 52, h: 20, tone: 'team', label: '业务线 C' },
      { x: 5, y: 70, w: 32, h: 16, tone: 'staff' },
      { x: 39, y: 70, w: 32, h: 16, tone: 'staff' },
      { x: 87, y: 70, w: 32, h: 16, tone: 'staff' },
      { x: 121, y: 70, w: 32, h: 16, tone: 'staff' },
      { x: 169, y: 70, w: 32, h: 16, tone: 'staff' },
      { x: 203, y: 70, w: 32, h: 16, tone: 'staff' }
    ],
    links: [
      { x1: 120, y1: 22, x2: 38, y2: 38 },
      { x1: 120, y1: 22, x2: 120, y2: 38 },
      { x1: 120, y1: 22, x2: 202, y2: 38 },
      { x1: 38, y1: 58, x2: 21, y2: 70 },
      { x1: 38, y1: 58, x2: 55, y2: 70 },
      { x1: 120, y1: 58, x2: 103, y2: 70 },
      { x1: 120, y1: 58, x2: 137, y2: 70 },
      { x1: 202, y1: 58, x2: 185, y2: 70 },
      { x1: 202, y1: 58, x2: 219, y2: 70 },
      { x1: 38, y1: 86, x2: 38, y2: 98 },
      { x1: 120, y1: 86, x2: 120, y2: 98 },
      { x1: 202, y1: 86, x2: 202, y2: 98 }
    ],
    band: { x: 6, y: 98, w: 228, h: 16, label: '流程 · 例会 · 文档' }
  }
]

const LEGEND = [
  { key: 'lead', text: '创始人 / 经营层' },
  { key: 'team', text: '中间那一层' },
  { key: 'staff', text: '干活的格子（画的是位置，不是人头）' },
  { key: 'band', text: '流程、例会、文档' },
  { key: 'mistake', text: '该档最典型的错误' }
]

// 判断线：每一档先问"缺的是人还是结构"。
const SPINE = [
  { size: '10 人档', ans: '加人', kind: 'people' as AddKind },
  { size: '50 人档', ans: '加结构', kind: 'struct' as AddKind },
  { size: '150 人档', ans: '加文档、删会', kind: 'cut' as AddKind }
]

interface Signal {
  title: string
  tone: AddKind
  items: string[]
}

const SIGNALS: Signal[] = [
  {
    title: '该加人的信号',
    tone: 'people',
    items: [
      '活在你手里排队，客户开始等；同一批单靠加班还顶得住。',
      '你亲自带的人已经能独立收尾，你出门三天交付不断。',
      '动作：再买一双手，形状不动，头衔先欠着。'
    ]
  },
  {
    title: '该加结构的信号',
    tone: 'struct',
    items: [
      '说过三遍的事，三个组做出三种版本；跨组的事没人接。',
      '你开始靠"谁嗓门大"决定优先级，而不是靠谁负责。',
      '动作：加一层负责人，并把同一件事铺成三个渠道（书面、周会、一对一）。'
    ]
  },
  {
    title: '两个都别加的信号',
    tone: 'cut',
    items: [
      '开会有人补作业，文档没人读；每条决定都要重新问你一次。',
      '再加一个人，只是把你的瓶颈复制一遍，工资还多一份。',
      '动作：先把重复的事写成 1 页纸的流程，再砍一层没人用的会。'
    ]
  }
]

interface Bar {
  label: string
  num: string
  pct: number
  tone: 'accent' | 'coral' | 'blue'
}

// Gallup 美国管理者口径（.qoder/facts-intl.md I-51，标 A 可核）。
// 它是"一个人同时干两件事时自然形成的规模"，不是"1 人管 8～10 人才科学"（同文件红线）。
const BARS: Bar[] = [
  { label: '除带人外仍承担具体业务的管理者', num: '97%', pct: 97, tone: 'accent' },
  { label: '这批人花在"自己干活"上的中位时间', num: '40%', pct: 40, tone: 'coral' },
  { label: '自己干活超 40% 的那批人里，直接下属不足 5 人', num: '近一半', pct: 50, tone: 'blue' },
  { label: '同口径下，直接下属不足 10 人', num: '约 3/4', pct: 75, tone: 'blue' }
]

// Greiner 危机序列（I-62，B 需限定）：描述性框架、历史案例归纳，没有可验证的人数量级阈值。
const CRISES = ['创业期 → 领导危机', '集体化期 → 自主危机', '授权期 → 控制危机', '制度化期 → 官僚危机']
</script>

<template>
  <div class="sb-org-stages sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Org Shape · 10 人、50 人、150 人该怎么分组</span>
      <p class="sb-widget-sub">人数一过线，喊话就不管用了。三张形状图，各配一个最典型的错，最后一条判断线。</p>
    </div>

    <p class="sb-org-stages-note">
      先把话说在前面：10、50、150 是本站画形状用的三档<b>示意刻度</b>，不是统计结论——事实表里查不到
      "到多少人必须分层"这种阈值的一手依据，所以这张图不喊"150 人天花板"。真正能查到的，是下面那组管理幅度的数：
      带人和干活，一直是同一个人在扛。
    </p>

    <div class="sb-org-stages-legend" aria-hidden="true">
      <span v-for="l in LEGEND" :key="l.key" class="sb-org-stages-key">
        <i :class="'is-' + l.key"></i>{{ l.text }}
      </span>
    </div>

    <figure class="sb-org-stages-grid">
      <div v-for="s in STAGES" :key="s.size" class="sb-org-stages-panel">
        <div class="sb-org-stages-top">
          <span class="sb-org-stages-size">{{ s.size }}</span>
          <span class="sb-org-stages-en">{{ s.en }}</span>
        </div>
        <p class="sb-org-stages-shape">{{ s.shape }}</p>
        <p class="sb-org-stages-layers">{{ s.layers }}</p>

        <svg class="sb-org-stages-svg" viewBox="0 0 240 124" aria-hidden="true" focusable="false">
          <g class="sb-org-stages-links">
            <line v-for="(k, ki) in s.links" :key="'k' + ki" :x1="k.x1" :y1="k.y1" :x2="k.x2" :y2="k.y2" />
          </g>
          <g v-for="(b, bi) in s.boxes" :key="'b' + bi" class="sb-org-stages-node" :class="'is-' + b.tone">
            <rect :x="b.x" :y="b.y" :width="b.w" :height="b.h" rx="4" />
            <text v-if="b.label" :x="b.x + b.w / 2" :y="b.y + b.h / 2 + 3">{{ b.label }}</text>
          </g>
          <g v-if="s.band" class="sb-org-stages-node is-band">
            <rect :x="s.band.x" :y="s.band.y" :width="s.band.w" :height="s.band.h" rx="8" />
            <text :x="s.band.x + s.band.w / 2" :y="s.band.y + s.band.h / 2 + 3">{{ s.band.label }}</text>
          </g>
        </svg>

        <p class="sb-org-stages-desc">{{ s.desc }}</p>

        <div class="sb-org-stages-mistake">
          <span class="sb-org-stages-tag">这个阶段最典型的错误</span>
          <p class="sb-org-stages-mistake-name">{{ s.mistake }}</p>
          <p class="sb-org-stages-mistake-say">{{ s.mistakeSay }}</p>
        </div>

        <div class="sb-org-stages-add" :class="'is-' + s.addKind">
          <span class="sb-org-stages-tag">这一格该加什么：{{ s.addTitle }}</span>
          <p class="sb-org-stages-add-text">{{ s.addSay }}</p>
        </div>
      </div>

      <span class="sr-only">
        三个阶段各配一张形状图，方格画的是位置不是人头。十人档：中间层 0 层，顶上"创始人"一个方框，
        直接连到下面并排的六个方框，沟通靠喊话；这个阶段最典型的错误是过早设部门；该加的是人。
        五十人档：中间层 1 层，顶上创始人，中间三个"负责人"方框，每个负责人下面再挂两个方框，
        沟通靠转手；最典型的错误是把"我说过了"当成沟通机制；该加的是结构——同一件事走书面、周会、
        一对一三个渠道。一百五十人档：中间层 2 层，顶上"经营层"，下面三条业务线 A、B、C 各自往下挂一排方框，
        最底下一条蓝色虚线横带写着"流程 · 例会 · 文档"，沟通靠流程；最典型的错误是没有 SOP；
        该加的是文档、该删的是没用的会。10、50、150 这三个数只是画形状用的示意刻度，
        不是研究结论，本站不说"150 人天花板"。
      </span>
    </figure>

    <p class="sb-org-stages-block-title">贯穿三阶段的判断线：这个阶段该加的是人，还是结构</p>
    <div class="sb-org-stages-spine" aria-hidden="true">
      <span v-for="(p, i) in SPINE" :key="p.size" class="sb-org-stages-hop">
        <span class="sb-org-stages-stop" :class="'is-' + p.kind">
          <em>{{ p.size }}</em>
          <b>{{ p.ans }}</b>
        </span>
        <span v-if="i < SPINE.length - 1" class="sb-org-stages-arrow">→</span>
      </span>
    </div>

    <div class="sb-org-stages-signals">
      <div v-for="g in SIGNALS" :key="g.title" class="sb-org-stages-signal" :class="'is-' + g.tone">
        <p class="sb-org-stages-signal-title">{{ g.title }}</p>
        <ul class="sb-org-stages-signal-list">
          <li v-for="it in g.items" :key="it">{{ it }}</li>
        </ul>
      </div>
    </div>

    <p class="sb-org-stages-block-title">带人的幅度：这几条能查到的数</p>
    <div class="sb-org-stages-bars">
      <div v-for="b in BARS" :key="b.label" class="sb-org-stages-bar">
        <p class="sb-org-stages-bar-label">{{ b.label }}</p>
        <div class="sb-org-stages-bar-plot">
          <span class="sb-org-stages-track">
            <span class="sb-org-stages-fill" :class="'is-' + b.tone" :style="{ width: b.pct + '%' }"></span>
          </span>
          <span class="sb-org-stages-bar-num">{{ b.num }}</span>
        </div>
      </div>
    </div>
    <p class="sb-org-stages-src">
      口径：Gallup 美国管理者样本，"97% 的管理者除带人外还背着具体业务、中位 40% 时间做自己那份活"——
      事实表里标 <b>A 可核</b>。但它只说明"一个人兼两件事时自然形成的规模"，
      <b>不是</b>"1 人管 8 到 10 人才科学"。
    </p>
    <p class="sb-org-stages-src">
      另一个方向：<b>每位管理者的平均直接下属数从 2024 年的 10.9 人升到 2025 年的 12.1 人</b>
      （Gallup 经 BTS 二手转述，事实表标 <b>B 需限定</b>，原页待回抓）。幅度悄悄变大，
      最先被砍掉的通常是"你亲手带人"那部分——这是由上面两条推出来的说法，不是因果实验。
    </p>
    <p class="sb-org-stages-src">
      还有一条常被拿来做决定的数：团队敬业度的差异里约 <b>70%</b> 能算到直接管理者身上
      （Gallup 用自家 Q12 做的方差分解，标 <b>A 可核</b>；它是"解释了多少方差"，
      不等于"换个经理就能涨 70%"，别当因果承诺用）。
    </p>
    <p class="sb-org-stages-src">
      "一对一"这一格的做法出自《格鲁夫给经理人的第一课》：私密、由下属主导议程、一次 30 到 60 分钟。
      这本书在事实表里标 <b>B</b>（内部逻辑偏 A，加实践证词），<b>不是研究</b>，
      而且 1983 年的层级组织与终身雇佣假设要打折看——能留下的只有"定期、有议程、有人记"这三件。
    </p>

    <p class="sb-org-stages-block-title">没有人数阈值，那就看撞上哪种危机</p>
    <div class="sb-org-stages-crises" aria-hidden="true">
      <span v-for="c in CRISES" :key="c" class="sb-org-stages-crisis">{{ c }}</span>
    </div>
    <p class="sb-org-stages-src">
      葛雷纳（HBR，1972／1998）的危机序列：每个平稳期都以一种特定危机收尾，解掉它才进入下一段。
      事实表标 <b>B 需限定</b>——它是历史案例归纳的描述性框架，<b>没有可验证的人数量级阈值</b>，
      所以本站用"你撞上哪种危机"来判断该加人还是加结构，而不是用人数。
      另一句要提前打的折：钱和优惠确实按人数划线，但那是税法的尺——中国口径的小型微利企业含
      "从业人数不超过 <b>300 人</b>"（含劳务派遣、按全年季度平均值算，标 <b>A 可核</b>，
      且税法口径与统计划型口径不同），它跟你的组织该分几层没有关系。
    </p>

    <span class="sr-only">
      贯穿三阶段的判断线：十人档加人，五十人档加结构，一百五十人档加文档、删没用的会；
      对应三组信号——交付排队、你亲自带的人已经能独立收尾，就加人；
      说过三遍的事三个组做出三种版本、跨组的事没人接，就加结构；
      开会有人补作业、文档没人读、每条决定都要重新问你，就两样都别加，先写流程再删会。
      管理幅度的四条数，都是 Gallup 美国管理者口径：除带人外仍承担具体业务的管理者占 97%；
      这批人花在自己干活上的中位时间是 40%；在自己干活时间超过 40% 的那批人里，
      直接下属不足 5 人的接近一半，不足 10 人的约四分之三。这四条是 A 可核，
      但它只说明一个人兼两件事时自然形成的规模，不等于 1 人管 8 到 10 人才科学。
      平均每位管理者的直接下属数，从 2024 年的 10.9 人升到 2025 年的 12.1 人，
      这条是 Gallup 经 BTS 二手转述，标 B 需限定，原始页面待回抓；管理幅度变大，
      最先被牺牲的是亲手带人这件事，这是推论不是因果实验。团队敬业度差异里约 70%
      能算到直接管理者身上，这是 Gallup 用自家 Q12 做的方差分解，标 A 可核，
      它是解释方差，不是"换个经理就能涨 70%"。一对一的做法取自《格鲁夫给经理人的第一课》，
      私密、由下属主导议程、30 到 60 分钟，这本书的等级是 B 加实践证词，1983 年的层级组织与
      终身雇佣假设要打折看。人数阈值这一条事实表里查不到一手依据，所以看危机序列：创业期收尾于领导危机，
      集体化期收尾于自主危机，授权期收尾于控制危机，制度化期收尾于官僚危机，
      出自葛雷纳（HBR 1972／1998），标 B 需限定，是描述性框架。补充一条：
      中国税法口径的小型微利企业包含"从业人数不超过 300 人"，含劳务派遣、按全年季度平均值计算，
      标 A 可核，且税法口径与统计划型口径不同，这个人数线决定的是税与优惠，不是组织该分几层。
    </span>

    <p class="sb-cap">
      三档各有各的错：<b>10 人</b>最容易<b>过早设部门</b>，头衔先于职责；<b>50 人</b>最容易
      <b>把"我说过了"当沟通机制</b>，中间多一层，信息就从这层开始失真；<b>150 人</b>最容易
      <b>没有 SOP</b>，于是创始人自己变成瓶颈。判断线只有一句：<b>交付排队就加人，消息走形就加结构，
      事事要你重批就先写文档、删会</b>。至于 <b>10／50／150</b> 这三个数，它们是画形状用的示意刻度，
      不是里程碑——真正能查到的只有 Gallup 那组数（<b>97%</b> 的管理者自己还背着具体业务、
      中位 <b>40%</b> 的时间还在干自己那份活，标 A 可核；平均直接下属 <b>10.9 人涨到 12.1 人</b>，
      这条经 BTS 转述、标 B 需限定）。什么时候该换形状，看你撞上的是哪种危机，别数工牌。
      这一页唯一沾税务的数是<b>小型微利企业 300 人</b>那条人数线，它决定的是税与优惠、不是组织形状，
      而且认定条件不止人数一项——<b>以当年当地口径与专业意见为准</b>，本站不给任何节税安排。
    </p>
  </div>
</template>

<style scoped>
.sb-org-stages-note {
  margin: 0 0 14px;
  padding: 10px 12px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  font-size: 11.5px;
  line-height: 1.65;
  color: var(--muted);
}

.sb-org-stages-note b {
  color: var(--ink-2);
  font-weight: 680;
}

.sb-org-stages-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-bottom: 12px;
}

.sb-org-stages-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-org-stages-key i {
  width: 13px;
  height: 10px;
  border-radius: 3px;
  border: 1px solid var(--line-strong);
}

.sb-org-stages-key i.is-lead {
  border-color: var(--accent);
  background: var(--accent);
}

.sb-org-stages-key i.is-team {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.sb-org-stages-key i.is-staff {
  border-color: var(--line-strong);
  background: var(--panel-2);
}

.sb-org-stages-key i.is-band {
  border: 1px dashed var(--blue);
  background: var(--blue-soft);
}

.sb-org-stages-key i.is-mistake {
  border-color: var(--coral);
  background: var(--coral-soft);
}

.sb-org-stages-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.sb-org-stages-panel {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 12px 12px 13px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel);
  box-shadow: var(--shadow);
  transition: border-color 0.3s var(--ease);
}

.sb-org-stages-panel:hover {
  border-color: var(--line-strong);
}

.sb-org-stages-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.sb-org-stages-size {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--accent);
}

.sb-org-stages-en {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--faint);
}

.sb-org-stages-shape {
  margin: 0;
  font-size: 13px;
  font-weight: 680;
  line-height: 1.4;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-org-stages-layers {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  line-height: 1.5;
  color: var(--faint);
  overflow-wrap: anywhere;
}

.sb-org-stages-svg {
  display: block;
  width: 100%;
  height: auto;
  margin: 2px 0;
}

.sb-org-stages-links line {
  stroke: var(--line-strong);
  stroke-width: 1.2;
}

.sb-org-stages-node rect {
  stroke-width: 1.2;
}

.sb-org-stages-node.is-lead rect {
  fill: var(--accent);
  stroke: var(--accent);
}

.sb-org-stages-node.is-team rect {
  fill: var(--accent-soft);
  stroke: var(--accent);
}

.sb-org-stages-node.is-staff rect {
  fill: var(--panel-2);
  stroke: var(--line-strong);
}

/* 流程带：蓝色虚线，跟"层级"区分开 */
.sb-org-stages-node.is-band rect {
  fill: var(--blue-soft);
  stroke: var(--blue);
  stroke-dasharray: 5 4;
}

.sb-org-stages-node text {
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.04em;
  fill: var(--ink-2);
  text-anchor: middle;
}

.sb-org-stages-node.is-lead text {
  fill: var(--panel);
}

.sb-org-stages-node.is-band text {
  fill: var(--blue);
}

.sb-org-stages-desc {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.65;
  color: var(--muted);
}

.sb-org-stages-tag {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  line-height: 1.5;
}

.sb-org-stages-mistake {
  display: grid;
  gap: 3px;
  padding: 9px 10px;
  border: 1px solid var(--coral);
  border-radius: 8px;
  background: var(--coral-soft);
}

.sb-org-stages-mistake .sb-org-stages-tag {
  color: var(--coral);
}

.sb-org-stages-mistake-name {
  margin: 0;
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-org-stages-mistake-say {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
  color: var(--ink-2);
}

.sb-org-stages-add {
  display: grid;
  gap: 3px;
  padding: 9px 10px;
  border: 1px dashed var(--line-strong);
  border-radius: 8px;
  background: var(--panel-2);
}

.sb-org-stages-add.is-people {
  border-color: var(--accent);
}

.sb-org-stages-add.is-people .sb-org-stages-tag {
  color: var(--accent);
}

.sb-org-stages-add.is-struct {
  border-color: var(--blue);
}

.sb-org-stages-add.is-struct .sb-org-stages-tag {
  color: var(--blue);
}

.sb-org-stages-add.is-cut .sb-org-stages-tag {
  color: var(--ink-2);
}

.sb-org-stages-add-text {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
  color: var(--ink-2);
}

.sb-org-stages-block-title {
  margin: 20px 0 8px;
  padding-top: 16px;
  border-top: 1px dashed var(--line-strong);
  font-size: 13px;
  font-weight: 660;
  color: var(--ink);
}

.sb-org-stages-spine {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 6px;
  margin-bottom: 12px;
}

.sb-org-stages-hop {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.sb-org-stages-stop {
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
  padding: 7px 11px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--panel-2);
}

.sb-org-stages-stop em {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-style: normal;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-org-stages-stop b {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}

.sb-org-stages-stop.is-people {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.sb-org-stages-stop.is-people b {
  color: var(--accent);
}

.sb-org-stages-stop.is-struct {
  border-color: var(--blue);
  background: var(--blue-soft);
}

.sb-org-stages-stop.is-struct b {
  color: var(--blue);
}

.sb-org-stages-stop.is-cut b {
  color: var(--ink-2);
}

.sb-org-stages-arrow {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--faint);
}

.sb-org-stages-signals {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.sb-org-stages-signal {
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel);
}

.sb-org-stages-signal.is-people {
  border-left-color: var(--accent);
}

.sb-org-stages-signal.is-struct {
  border-left-color: var(--blue);
}

.sb-org-stages-signal.is-cut {
  border-left-color: var(--coral);
}

.sb-org-stages-signal-title {
  margin: 0 0 6px;
  font-size: 12.5px;
  font-weight: 680;
  line-height: 1.4;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-org-stages-signal-list {
  margin: 0;
  padding-left: 15px;
  display: grid;
  gap: 5px;
}

.sb-org-stages-signal-list li {
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

/* 百分比条落在自己的网格轨里，数值单独一列：窄屏不会溢出 */
.sb-org-stages-bar {
  display: grid;
  gap: 4px;
  padding: 8px 0;
  border-top: 1px solid var(--line);
}

.sb-org-stages-bar:first-child {
  border-top: none;
}

.sb-org-stages-bar-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  line-height: 1.5;
  color: var(--faint);
  overflow-wrap: anywhere;
}

.sb-org-stages-bar-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58px;
  align-items: center;
  gap: 8px;
}

.sb-org-stages-track {
  display: block;
  min-width: 0;
  height: 11px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-2);
  overflow: hidden;
}

.sb-org-stages-fill {
  display: block;
  height: 100%;
  transition: width 0.3s var(--ease);
}

.sb-org-stages-fill.is-accent {
  background: var(--accent);
}

.sb-org-stages-fill.is-coral {
  background: var(--coral);
}

.sb-org-stages-fill.is-blue {
  background: var(--blue);
}

.sb-org-stages-bar-num {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--ink-2);
  text-align: right;
  white-space: nowrap;
}

.sb-org-stages-src {
  margin: 8px 0 0;
  font-size: 11.5px;
  line-height: 1.65;
  color: var(--muted);
}

.sb-org-stages-src b {
  color: var(--ink-2);
  font-weight: 680;
}

.sb-org-stages-crises {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
}

.sb-org-stages-crisis {
  padding: 5px 9px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.04em;
  line-height: 1.4;
  color: var(--muted);
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .sb-org-stages-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .sb-org-stages-signals {
    grid-template-columns: minmax(0, 1fr);
  }

  .sb-org-stages-svg {
    max-width: 260px;
  }

  /* 次要装饰文字窄屏收起；每个阶段的"错误"和"该加什么"全部留在场上 */
  .sb-org-stages-en,
  .sb-org-stages-legend {
    display: none;
  }

  .sb-org-stages-desc,
  .sb-org-stages-mistake-say,
  .sb-org-stages-add-text {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-org-stages-panel,
  .sb-org-stages-fill {
    transition: none;
  }
}
</style>
