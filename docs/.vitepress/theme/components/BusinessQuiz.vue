<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

type Stage = '准备' | '赛道' | '算账' | '组织'

interface Choice {
  text: string
  /** 0 = 这一格是实的，2 = 这一格还空着 */
  score: 0 | 1 | 2
}

interface Question {
  stage: Stage
  q: string
  why: string
  choices: Choice[]
  links: string[]
}

const STAGES: Stage[] = ['准备', '赛道', '算账', '组织']
const STORAGE_KEY = 'sb-biz-quiz-v1'
const MAX = 20

// 每题 0–2 分，分越高说明这一格越空。题目本身不预测成败，只指出该先补哪里。
const QUESTIONS: Question[] = [
  {
    stage: '准备',
    q: '如果这笔启动资金全部亏光，你的生活会被撞到吗？',
    why: '房租、学费、房贷月供属于"不能亏的钱"，把它们算进启动资金，决定会被恐惧扭曲。',
    choices: [
      { text: '会撞到——房租、孩子学费或月供在里面', score: 2 },
      { text: '要省一年，但能恢复', score: 1 },
      { text: '完全不撞，生活费另留了 12 个月', score: 0 }
    ],
    links: ['/ready/money', '/ready/first-year']
  },
  {
    stage: '准备',
    q: '你现在是全职工在做，还是准备辞职去做？',
    why: '「第一年必须 all-in」是最常被说破的一条：先收到钱，再换身份，顺序反了代价最大。',
    choices: [
      { text: '已经辞职，没有退路也没有缓冲', score: 2 },
      { text: '打算这几个月内辞职', score: 1 },
      { text: '先用业余时间验证，收到钱再谈全职', score: 0 }
    ],
    links: ['/ready/self', '/myths/list']
  },
  {
    stage: '准备',
    q: '开张之前，你和合伙人谈过"怎么散伙"吗？',
    why: '分手价、回购权、竞业、债务这四条要在开工前落成书面，不是在闹翻时才想起来。',
    choices: [
      { text: '没谈过，关系很好，不需要', score: 2 },
      { text: '口头说过，没有写下来', score: 1 },
      { text: '有书面条款，四个人各留一份', score: 0 }
    ],
    links: ['/ready/exit-plan', '/structure/equity']
  },
  {
    stage: '赛道',
    q: '你的前 20 个客户，能说出具体是谁吗？',
    why: '"这类人都需要"不是客户名单。列不出名字，就还不知道要卖给谁。',
    choices: [
      { text: '说不清，只知道一个人群画像', score: 2 },
      { text: '能描述是什么样的，但没有名单', score: 1 },
      { text: '能列出具体公司、小区、店名', score: 0 }
    ],
    links: ['/industry/how-to-choose', '/industry/menus']
  },
  {
    stage: '赛道',
    q: '同行靠什么活着，你算过吗？',
    why: '红海不是不能进，是不能空手进：先算清对手的成本，再谈你凭什么不一样。',
    choices: [
      { text: '没算过，我觉得他们做得挺差', score: 2 },
      { text: '看过他们的价格，没看过成本', score: 1 },
      { text: '能说清对手的成本结构和我的差别', score: 0 }
    ],
    links: ['/industry/red-ocean', '/industry/entry']
  },
  {
    stage: '赛道',
    q: '如果这行明年不涨反跌，你这门生意还在吗？',
    why: '靠行情撑着的生意，行情一走就什么都没了。下行时靠什么撑住，要提前想。',
    choices: [
      { text: '没想过，这行现在在风口上', score: 2 },
      { text: '会受影响，但没细想怎么扛', score: 1 },
      { text: '想清楚了：复购、成本、现金各撑多少', score: 0 }
    ],
    links: ['/industry/red-ocean', '/model/cashflow']
  },
  {
    stage: '算账',
    q: '一单的账，你能写在一张纸上吗？',
    why: '售价、直接成本、获客分摊、贡献毛利——四个数说不出口，规模只会把亏本的事做得更勤快。',
    choices: [
      { text: '只会看总账，一单算不清', score: 2 },
      { text: '知道毛利率，获客成本没摊进去', score: 1 },
      { text: '四个数张口就来，还能说出定价为什么这么定', score: 0 }
    ],
    links: ['/model/unit-economics', '/model/pricing']
  },
  {
    stage: '算账',
    q: '账上的钱能撑几个月，你知道吗？',
    why: '可亏资金 ÷ 每月燃烧率 = 跑道月数。不知道这个数，所有决定都是在赌。',
    choices: [
      { text: '没算过，有进账就不慌', score: 2 },
      { text: '知道有多少钱，没算过能撑几个月', score: 1 },
      { text: '算过，而且知道毛利和净利不是一回事', score: 0 }
    ],
    links: ['/ready/money', '/model/margin']
  },
  {
    stage: '组织',
    q: '现在一起做事的人，每天在干什么你写得出来吗？',
    why: '每个岗位写不出"他负责哪个数字"，就还不是团队，只是一群人在你旁边加班。',
    choices: [
      { text: '只有我自己，或到处找临时帮忙的人', score: 2 },
      { text: '有 2–5 个人，职责靠嘴说，没写下来', score: 1 },
      { text: '每个人有一句"他负责哪个数字"', score: 0 }
    ],
    links: ['/people/hire', '/people/pay']
  },
  {
    stage: '组织',
    q: '客户明天只找你一个人，你能不在场吗？',
    why: '所有决定都过你，公司的大小就等于你的清醒时间。流程与备份人是用来换自由的。',
    choices: [
      { text: '不行，什么都得我点头', score: 2 },
      { text: '小事可以，钱和客户必须我确认', score: 1 },
      { text: '能：有流程、有备份人、有记录', score: 0 }
    ],
    links: ['/run/system', '/structure/org']
  }
]

// 分档不是判决，只是"下一步先做什么"的建议。
const TIERS = [
  {
    min: 0,
    max: 4,
    label: '地基是干的',
    text: '可以往前走。你剩下的风险在执行和算账，不在准备。别把"敢开始"当成"不用算"。'
  },
  {
    min: 5,
    max: 10,
    label: '有两三格还空着',
    text: '先补分最高的那一格，再谈投钱。空洞不会因为你努力就自己填上。'
  },
  {
    min: 11,
    max: 15,
    label: '现在投钱等于加速问题',
    text: '把钱停下来，用一个月把账和名单补齐。这个阶段最贵的错误是"边做边想"。'
  },
  {
    min: 16,
    max: 20,
    label: '先别辞职',
    text: '把这件事做成副业形状：先收到第一笔不属于熟人的钱，再谈身份、办公室和招人。'
  }
]

const answers = ref<Array<number | null>>(QUESTIONS.map(() => null))
// 服务端与首帧一律全空；恢复本地答案只在 onMounted 之后发生，避免 hydration mismatch。
const mounted = ref(false)
const restored = ref(false)

const answeredCount = computed(() => answers.value.filter((a) => a !== null).length)
const total = computed(() => answers.value.reduce<number>((s, a) => s + (a ?? 0), 0))

const stageStats = computed(() =>
  STAGES.map((stage) => {
    const qs = QUESTIONS.filter((q) => q.stage === stage)
    const got = qs.reduce((s, q) => {
      const i = QUESTIONS.indexOf(q)
      return s + (answers.value[i] ?? 0)
    }, 0)
    return { stage, got, max: qs.length * 2, pct: (got / (qs.length * 2)) * 100 }
  })
)

const weak = computed(() =>
  QUESTIONS.map((q, i) => ({ q, i, score: answers.value[i] ?? 0 }))
    .filter((x) => (answers.value[x.i] ?? null) !== null && x.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
)

const recos = computed(() => {
  const out: string[] = []
  for (const w of weak.value) {
    for (const l of w.q.links) if (!out.includes(l)) out.push(l)
  }
  return out.slice(0, 5)
})

const fallback = ['/ready/self', '/industry/how-to-choose', '/model/unit-economics']
const shownLinks = computed(() => (recos.value.length ? recos.value : fallback))

const tier = computed(() => {
  if (answeredCount.value < QUESTIONS.length) return null
  return TIERS.find((t) => total.value >= t.min && total.value <= t.max) ?? TIERS[TIERS.length - 1]
})

const TITLES: Record<string, string> = {
  '/ready/self': '你适不适合现在做这件事',
  '/ready/money': '启动资金：亏多少会伤到你',
  '/ready/first-year': '第一年真实的账',
  '/ready/exit-plan': '开张前先谈好怎么散伙',
  '/industry/how-to-choose': '选行业的三步',
  '/industry/menus': '行业菜单：不同赛道各自的账本',
  '/industry/red-ocean': '红海、蓝海与「看起来很赚钱」',
  '/industry/entry': '切入方式：副业、加盟、自创品牌',
  '/model/unit-economics': '一单的账：贡献毛利',
  '/model/pricing': '定价：贵不是问题',
  '/model/cashflow': '现金流：利润是观点，现金是事实',
  '/model/margin': '毛利、净利与「多少算好」',
  '/structure/equity': '股权分配：分多少、怎么兑现',
  '/structure/org': '组织架构：人多了怎么分组',
  '/people/hire': '招人：第一个该招的是谁',
  '/people/pay': '待遇：薪酬与社保的真实成本',
  '/run/system': '把公司变成机器：流程与授权',
  '/myths/list': '14 条最常听到的创业说法'
}

const titleOf = (link: string) => TITLES[link] ?? link

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers.value))
  } catch (e) {
    /* 隐私模式或被禁用，存不住就算了：答卷不影响读正文 */
  }
}

function pick(i: number, score: 0 | 1 | 2) {
  answers.value[i] = answers.value[i] === score ? null : score
  restored.value = false
  persist()
}

function reset() {
  answers.value = QUESTIONS.map(() => null)
  restored.value = false
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    /* 同上 */
  }
}

onMounted(() => {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch (e) {
    raw = null
  }
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        answers.value = QUESTIONS.map((_, i) => {
          const v = parsed[i]
          return v === 0 || v === 1 || v === 2 ? v : null
        })
        restored.value = answers.value.some((a) => a !== null)
      }
    } catch (e) {
      /* 存的是坏数据就当没存过 */
    }
  }
  mounted.value = true
})
</script>

<template>
  <div class="sb-business-quiz sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Founder Self-Check · 创业自评</span>
      <p class="sb-widget-sub">10 道题，四格棋盘。分高不代表你不行，只代表那一格还空着。</p>
    </div>

    <div class="sb-business-quiz-progress">
      <div class="sb-business-quiz-progress-line">
        <span class="sb-business-quiz-count">已答 {{ answeredCount }}/{{ QUESTIONS.length }}</span>
        <span class="sb-business-quiz-total">总分 {{ total }}/{{ MAX }}</span>
      </div>
      <div class="sb-business-quiz-progress-plot">
        <span class="sb-business-quiz-progress-track" aria-hidden="true">
          <span
            class="sb-business-quiz-progress-fill"
            :style="{ width: (answeredCount / QUESTIONS.length) * 100 + '%' }"
          ></span>
        </span>
        <span class="sb-business-quiz-progress-num">{{ Math.round((total / MAX) * 100) }}%</span>
      </div>
    </div>

    <ol class="sb-business-quiz-list">
      <li v-for="(q, i) in QUESTIONS" :key="q.q" class="sb-business-quiz-item">
        <p class="sb-business-quiz-meta">
          <span class="sb-business-quiz-stage">{{ q.stage }}</span>
          <span class="sb-business-quiz-no">{{ String(i + 1).padStart(2, '0') }}</span>
        </p>
        <p class="sb-business-quiz-q">{{ i + 1 }}. {{ q.q }}</p>
        <div class="sb-business-quiz-choices">
          <button
            v-for="c in q.choices"
            :key="c.text"
            type="button"
            class="sb-business-quiz-choice"
            :class="{ 'is-on': answers[i] === c.score }"
            :aria-pressed="answers[i] === c.score"
            @click="pick(i, c.score)"
          >
            {{ c.text }}
          </button>
        </div>
        <p class="sb-business-quiz-why">{{ q.why }}</p>
      </li>
    </ol>

    <div class="sb-business-quiz-board">
      <div v-for="s in stageStats" :key="s.stage" class="sb-business-quiz-row">
        <span class="sb-business-quiz-row-name">{{ s.stage }}</span>
        <span class="sb-business-quiz-track" aria-hidden="true">
          <span class="sb-business-quiz-fill" :style="{ width: s.pct + '%' }"></span>
        </span>
        <span class="sb-business-quiz-val">{{ s.got }}/{{ s.max }}</span>
      </div>
    </div>

    <div class="sb-business-quiz-result">
      <p class="sb-business-quiz-tier">
        <template v-if="tier">
          <b>{{ tier.label }}</b>（总分 {{ total }} 分）：{{ tier.text }}
        </template>
        <template v-else>
          还差 {{ QUESTIONS.length - answeredCount }} 题才给分档结论。现在这一版只按你答过的题指路。
        </template>
      </p>

      <p class="sb-business-quiz-reco-title">你该先读这几页</p>
      <ul class="sb-business-quiz-reco">
        <li v-for="l in shownLinks" :key="l">
          <a :href="withBase(l)">{{ titleOf(l) }}</a>
          <span class="sb-business-quiz-path">{{ l }}</span>
        </li>
      </ul>

      <p v-if="mounted && restored" class="sb-business-quiz-note">
        已接着上次的答案继续（存在这台设备的浏览器里，不上传）。
      </p>
    </div>

    <div v-if="mounted" class="sb-business-quiz-tools">
      <button type="button" class="sb-business-quiz-reset" @click="reset">重置答卷</button>
      <span class="sb-business-quiz-tools-hint">重做一遍大约 3 分钟，别替自己美化答案。</span>
    </div>

    <span class="sr-only">
      自评进度：共 10 题，已答 {{ answeredCount }} 题，当前总分 {{ total }} 分，满分 20 分。
      四格棋盘：准备 {{ stageStats[0].got }} 分（满 {{ stageStats[0].max }} 分），
      赛道 {{ stageStats[1].got }} 分（满 {{ stageStats[1].max }} 分），
      算账 {{ stageStats[2].got }} 分（满 {{ stageStats[2].max }} 分），
      组织 {{ stageStats[3].got }} 分（满 {{ stageStats[3].max }} 分）。
      分档区间为 0 至 4 分、5 至 10 分、11 至 15 分、16 至 20 分，分数越高说明空档越多。
      <template v-if="tier">本次结论：{{ tier.label }}。</template>
      <template v-else>题目未答满 10 题，暂不出结论。</template>
      建议先读：
      <template v-for="l in shownLinks" :key="l">{{ titleOf(l) }}；</template>
    </span>

    <p class="sb-cap">
      这 10 题按 <b>0 到 2 分</b> 计，满分 <b>20 分</b>，分数越高越说明有一格是空的：<b>0–4 分</b>
      可以往前走，<b>16–20 分</b> 建议先把这件事做成副业形状、先收到第一笔钱再谈辞职。它不是算命，
      也不会预测成败——<b>只回答下一步读哪几页</b>。答卷存在你自己浏览器的
      <b>sb-biz-quiz-v1</b> 里，不上传、不共享，换台设备就重新开始。
    </p>
  </div>
</template>

<style scoped>
.sb-business-quiz-progress {
  margin-bottom: 18px;
}

.sb-business-quiz-progress-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.sb-business-quiz-count,
.sb-business-quiz-total {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.sb-business-quiz-total {
  color: var(--faint);
}

/* 条形自己占一格，数值另占一格：宽度参照物永远是轨道本身 */
.sb-business-quiz-progress-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58px;
  align-items: center;
  gap: 10px;
}

.sb-business-quiz-progress-track,
.sb-business-quiz-track {
  display: block;
  min-width: 0;
  height: 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-2);
  overflow: hidden;
}

.sb-business-quiz-progress-fill {
  display: block;
  height: 100%;
  background: var(--accent);
  transition: width 0.3s var(--ease);
}

.sb-business-quiz-progress-num {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
  text-align: right;
}

.sb-business-quiz-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-business-quiz-item {
  padding: 15px 0 13px;
  border-top: 1px dashed var(--line-strong);
}

.sb-business-quiz-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0 0 6px;
}

.sb-business-quiz-stage {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.sb-business-quiz-no {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-business-quiz-q {
  margin: 0 0 9px;
  font-size: 14.5px;
  font-weight: 660;
  line-height: 1.55;
  color: var(--ink);
}

.sb-business-quiz-choices {
  display: grid;
  gap: 7px;
}

.sb-business-quiz-choice {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  color: var(--ink-2);
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s var(--ease), background 0.2s var(--ease), color 0.2s var(--ease);
}

.sb-business-quiz-choice:hover {
  border-color: var(--line-strong);
  background: var(--panel-3);
}

.sb-business-quiz-choice.is-on {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--ink);
  font-weight: 620;
}

.sb-business-quiz-why {
  margin: 9px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}

.sb-business-quiz-board {
  margin: 20px 0 0;
  padding: 14px 16px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
}

.sb-business-quiz-row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 46px;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
}

.sb-business-quiz-row-name {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--ink-2);
}

.sb-business-quiz-fill {
  display: block;
  height: 100%;
  background: var(--coral);
  transition: width 0.3s var(--ease);
}

.sb-business-quiz-val {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
  text-align: right;
}

.sb-business-quiz-result {
  margin-top: 16px;
  padding: 16px 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--panel-3);
}

.sb-business-quiz-tier {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--ink-2);
}

.sb-business-quiz-tier b {
  color: var(--accent);
  font-weight: 700;
}

.sb-business-quiz-reco-title {
  margin: 14px 0 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--faint);
}

.sb-business-quiz-reco {
  margin: 0;
  padding: 0 0 0 18px;
  display: grid;
  gap: 4px;
}

.sb-business-quiz-reco li {
  font-size: 13.5px;
  line-height: 1.6;
}

.sb-business-quiz-reco a {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-underline-offset: 3px;
}

.sb-business-quiz-reco a:hover {
  color: var(--ink);
}

.sb-business-quiz-path {
  margin-left: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--faint);
}

.sb-business-quiz-note {
  margin: 12px 0 0;
  font-size: 11.5px;
  color: var(--muted);
}

.sb-business-quiz-tools {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.sb-business-quiz-reset {
  padding: 7px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 12.5px;
  cursor: pointer;
  transition: border-color 0.2s var(--ease), background 0.2s var(--ease);
}

.sb-business-quiz-reset:hover {
  border-color: var(--coral);
  background: var(--coral-soft);
}

.sb-business-quiz-tools-hint {
  font-size: 11.5px;
  color: var(--muted);
}

@media (max-width: 760px) {
  .sb-business-quiz-path {
    display: none;
  }

  .sb-business-quiz-row {
    grid-template-columns: 40px minmax(0, 1fr) 42px;
    gap: 8px;
  }

  .sb-business-quiz-board,
  .sb-business-quiz-result {
    padding: 12px 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-business-quiz-progress-fill,
  .sb-business-quiz-fill,
  .sb-business-quiz-choice,
  .sb-business-quiz-reset {
    transition: none;
  }
}
</style>
