<script setup lang="ts">
type Tone = 'coral' | 'blue' | 'accent' | 'strong'

interface Line {
  pct: number
  tone: Tone
  name: string
  tier: string
  can: string
  cannot: string
}

/* 两把尺子 + 四条线。
   刻度上的 30 / 34 / 51 / 67 是创业圈常见的"四条线"口诀，不是法条原文：
   哪条线管什么事、基数按全体还是按出席表决权算，一律以现行《公司法》、登记机关口径与本公司章程为准。
   这张图真正要说的是第二把尺子——有限公司里"持股比例"与"表决权比例"经常不是同一个数。 */
const LINES: Line[] = [
  {
    pct: 30,
    tone: 'coral',
    name: '30%：常见说法里的"上市公司那条线"',
    tier: '在表决权这把尺子上，它不落进任何新的一档',
    can: '在未上市的有限公司里，30% 说的是"你手上有多少股"，不是"你能通过哪一类决议"——决议数的是表决权，而表决权在有限公司里可以由章程另行约定（条文与口径待核）。',
    cannot: '它不替你按下任何按钮：既拦不住特别决议，也推不动普通决议。很多攻略把这条线抄进创业公司的控制权清单，是抄错了语境——30% 常见于上市公司增持、要约这一类规则（以现行证券法规与交易所规则原文为准，本页不作断言）。'
  },
  {
    pct: 34,
    tone: 'blue',
    name: '34%：超过三分之一，按得下暂停键',
    tier: '防守位：一件事"过不过得了"由你决定',
    can: '一般理解里，特别决议要"三分之二以上表决权"才过得去；反过来说，只要握住超过三分之一的表决权，它就过不去。三分之一约是 33.3%，写成 34% 是留余量的常见口诀（哪些事项算这一档、基数怎么算，全部待核，以现行《公司法》与章程为准）。',
    cannot: '否决是"我不同意"，不是"我说了算"：常规事项过半数照走，你想推的东西一样得找人凑票。它保护你不被改掉根本，但推不动任何你自己的提案。'
  },
  {
    pct: 51,
    tone: 'accent',
    name: '51%：过半数，常规事项说了算',
    tier: '经营位：日常机器转得动',
    can: '一般理解里，除特别决议以外的事项走"过半数"这一档：选董事、审报告、定经营上的常规决定（哪些事项落在这一档，以现行《公司法》、登记机关口径和章程为准，本页不断言具体列举）。',
    cannot: '够不到三分之二，就碰不到根本：改章程、增减注册资本、合并、分立、解散、变更公司形式这类事项，51% 说了不算（事项列举待核）。'
  },
  {
    pct: 67,
    tone: 'strong',
    name: '67%：三分之二以上，改得动根本',
    tier: '控制位：规则本身由你写',
    can: '常见口径里，特别决议——修改章程、增加或者减少注册资本、合并、分立、解散、变更公司形式等——须代表三分之二以上表决权通过；到这条线，公司最根本的规则不用求人就能改（列举与算法待核）。',
    cannot: '"以上"是按全体表决权还是按出席会议的表决权算，章程与登记口径可能给出不同答案；而且这条线数的是表决权，不等于你分红拿几成——出资比例、分红比例都可以另行约定（待核）。'
  }
]

/* 34 与 67 是同一道闸的两面，分开写清楚，别让人以为是两条互不相干的线 */
const PAIR_NOTE =
  '同一道闸的两面：门槛只有一个——特别决议要"三分之二以上表决权"。往下数，握住超过三分之一就能让它通不过；往上数，达到三分之二就能让它通过。两个数说的是同一件事的正反面。'

const PAIRS = [
  {
    pct: '34%',
    tone: 'blue' as Tone,
    head: '反面：按得下去',
    body: '握住超过三分之一的表决权，特别决议就通不过。你拿到的是"不同意"，不是"我决定"。'
  },
  {
    pct: '67%',
    tone: 'strong' as Tone,
    head: '正面：推得动',
    body: '达到三分之二以上表决权，特别决议你自己就能通过，不必凑别人的票。'
  }
]

/* 比例之外的路：全是"事先把谁来投票写清楚"的治理安排，不是绕开法律的工具 */
const PATHS = [
  {
    how: '章程约定：表决权可以不跟出资比例走',
    say: '非上市的有限公司，章程或全体股东的约定可以让表决权、分红比例不等同于出资比例（条文号待核）——这才是"境内 AB 股"最日常的形态。章程还能给股东资格的继承开例外（有限公司，条号待核）：不写，继承人可能直接进股东会。'
  },
  {
    how: '一致行动协议',
    say: '股东之间约定朝同一方向投票，把分散的票凑成一个多数；有限公司阶段主要靠协议本身，所以违约条款与退出条款要写清（上市或挂牌另须按规定披露，口径以规则原文为准，本页不给数字）。'
  },
  {
    how: '表决权委托',
    say: '股在别人手上，票交给你投。委托的范围、期限、能否撤回决定它靠不靠得住——它是合同安排，不是法定特权。'
  },
  {
    how: '特别表决权（AB 股）',
    say: '只有股份有限公司谈"同股不同权"。境内上市口径里，特别表决权一般只在注册制板块允许，并要求上市前设置、每份股份的表决权倍数有上限、普通股占比有下限、持有人锁定（倍数上限与条文号请以现行交易所规则原文核对，本页不印具体数）。'
  },
  {
    how: '持股平台（有限合伙）',
    say: '把员工放进有限合伙当不执行事务的合伙人，执行事务的只有一个——股权分散但表决权集中在一处（合伙企业常被用作持股平台，属结构性口径描述，待核）。'
  }
]

const BANNERS = [
  { tone: 'coral' as Tone, from: 0, to: 34, say: '单独定不了事' },
  { tone: 'blue' as Tone, from: 34, to: 51, say: '能否决' },
  { tone: 'accent' as Tone, from: 51, to: 67, say: '管常规' },
  { tone: 'strong' as Tone, from: 67, to: 100, say: '改根本' }
]

/* 刻度映射：x = 40 + 比例 × 5.6，0% 落在 40、100% 落在 600，viewBox 宽 640，两侧各留 ≥40 单位边距。
   30% 与 34% 只差 22.4 个横坐标单位，所以四个数字分两层高度（30/51 低层、34/67 高层），
   竖向引线只从自己的数字下方起步，绝不穿过隔壁那一层的字。 */
const X0 = 40
const X1 = 600
const PER_PCT = (X1 - X0) / 100
const xOf = (pct: number) => X0 + pct * PER_PCT

const LANE1_TOP = 90
const LANE_H = 30
const LANE1_BOT = LANE1_TOP + LANE_H
const BRIDGE_TOP = LANE1_BOT + 4
const BRIDGE_H = 22
const LANE2_TOP = BRIDGE_TOP + BRIDGE_H + 4
const LANE2_BOT = LANE2_TOP + LANE_H
const TICK_Y = LANE2_BOT + 16
const NOTE_Y = LANE2_BOT + 34

const FLAG_Y: Record<number, number> = { 30: 44, 34: 20, 51: 44, 67: 20 }
const GRID_X = [0, 20, 40, 60, 80, 100]
const anchorOf = (g: number) => (g === 0 ? 'start' : g === 100 ? 'end' : 'middle')

const band = (from: number, to: number) => ({ x: xOf(from), w: xOf(to) - xOf(from) })
const LANE1_BANDS = BANNERS.map((b) => ({ ...b, ...band(b.from, b.to) }))
const LANE2_BANDS = BANNERS.map((b) => ({ ...b, ...band(b.from, b.to) }))

const BRIDGE_X = 216
const BRIDGE_W = 216
const stemTop = (pct: number) => FLAG_Y[pct] + 6
</script>

<template>
  <div class="sb-control-threshold sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Control Thresholds · 几条持股比例线</span>
      <p class="sb-widget-sub">尺子上画了四个刻度，但真正决定决议能不能过的，是下面那把尺子。</p>
    </div>

    <div class="sb-control-threshold-legend" aria-hidden="true">
      <span
        v-for="b in BANNERS"
        :key="b.say"
        class="sb-control-threshold-key"
        :class="'is-' + b.tone"
      >
        <i></i>{{ b.say }}
      </span>
      <span class="sb-control-threshold-key is-pair"><i></i>上条＝持股，下条＝表决权</span>
      <span class="sb-control-threshold-key">常见口径 · 待核</span>
    </div>

    <svg
      class="sb-control-threshold-svg"
      viewBox="0 0 640 222"
      role="img"
      aria-labelledby="sb-control-threshold-t"
    >
      <title id="sb-control-threshold-t">
        两条并列的刻度轴，上条量持股比例、下条量表决权比例，轴上标出 30%、34%、51%、67% 四条常见的线
      </title>

      <text class="sb-control-threshold-head" :x="X0" :y="12">持股比例线（口诀 · 非法条）</text>

      <g class="sb-control-threshold-lane1">
        <rect
          v-for="b in LANE1_BANDS"
          :key="'l1' + b.say"
          class="sb-control-threshold-band"
          :class="'is-' + b.tone"
          :x="b.x"
          :y="LANE1_TOP"
          :width="b.w"
          :height="LANE_H"
        />
      </g>
      <g>
        <rect
          v-for="b in LANE2_BANDS"
          :key="'l2' + b.say"
          class="sb-control-threshold-band"
          :class="'is-' + b.tone"
          :x="b.x"
          :y="LANE2_TOP"
          :width="b.w"
          :height="LANE_H"
        />
      </g>

      <rect class="sb-control-threshold-lane" :x="X0" :y="LANE1_TOP" :width="X1 - X0" :height="LANE_H" rx="8" />
      <rect class="sb-control-threshold-lane" :x="X0" :y="LANE2_TOP" :width="X1 - X0" :height="LANE_H" rx="8" />

      <g v-for="l in LINES" :key="'m' + l.pct" class="sb-control-threshold-marker" :class="'is-' + l.tone">
        <line
          class="sb-control-threshold-stem"
          :x1="xOf(l.pct)"
          :x2="xOf(l.pct)"
          :y1="stemTop(l.pct)"
          :y2="LANE2_BOT"
        />
        <text class="sb-control-threshold-pct" :x="xOf(l.pct)" :y="FLAG_Y[l.pct]">{{ l.pct }}%</text>
      </g>

      <text class="sb-control-threshold-lanelab" :x="X0 + 9" :y="LANE1_TOP + 19">持股比例 · 你手上有多少股</text>
      <text class="sb-control-threshold-lanelab" :x="X0 + 9" :y="LANE2_TOP + 19">表决权 · 决议数的是这个</text>
      <text class="sb-control-threshold-laneright" :x="X1 - 9" :y="LANE2_TOP + 19" text-anchor="end">能不能过 →</text>

      <rect class="sb-control-threshold-bridge" :x="BRIDGE_X" :y="BRIDGE_TOP" :width="BRIDGE_W" :height="BRIDGE_H" rx="11" />
      <text class="sb-control-threshold-bridgelab" :x="BRIDGE_X + BRIDGE_W / 2" :y="BRIDGE_TOP + 15" text-anchor="middle">表决权 ≠ 持股比例（章程可另约）</text>

      <line class="sb-control-threshold-axis" :x1="X0" :x2="X1" :y1="LANE2_BOT" :y2="LANE2_BOT" />
      <g class="sb-control-threshold-ticks">
        <line
          v-for="g in GRID_X"
          :key="'tk' + g"
          :x1="xOf(g)"
          :x2="xOf(g)"
          :y1="LANE2_BOT"
          :y2="LANE2_BOT + 5"
        />
        <text v-for="g in GRID_X" :key="'tg' + g" :x="xOf(g)" :y="TICK_Y" :text-anchor="anchorOf(g)">
          {{ g }}%
        </text>
      </g>

      <text class="sb-control-threshold-note" :x="(X0 + X1) / 2" :y="NOTE_Y" text-anchor="middle">四条线为常见口径 · 事项与算法以现行《公司法》、登记机关口径与章程为准</text>
    </svg>

    <ul class="sb-control-threshold-list">
      <li v-for="l in LINES" :key="l.pct" class="sb-control-threshold-item" :class="'is-' + l.tone">
        <div class="sb-control-threshold-titlerow">
          <span class="sb-control-threshold-num">{{ l.pct }}%</span>
          <span class="sb-control-threshold-name">{{ l.name }}</span>
        </div>
        <p class="sb-control-threshold-tier">{{ l.tier }}</p>
        <div class="sb-control-threshold-plot">
          <span class="sb-control-threshold-track" aria-hidden="true">
            <span class="sb-control-threshold-fill" :style="{ width: l.pct + '%' }"></span>
          </span>
          <span class="sb-control-threshold-val">{{ l.pct }}<em>/ 100</em></span>
        </div>
        <p class="sb-control-threshold-can"><b>能</b>{{ l.can }}</p>
        <p class="sb-control-threshold-cannot"><b>不能</b>{{ l.cannot }}</p>
      </li>
    </ul>

    <div class="sb-control-threshold-pair">
      <p class="sb-control-threshold-pairnote">{{ PAIR_NOTE }}</p>
      <ul class="sb-control-threshold-pairlist">
        <li v-for="p in PAIRS" :key="p.pct" class="sb-control-threshold-pairitem" :class="'is-' + p.tone">
          <span class="sb-control-threshold-pairpct">{{ p.pct }}</span>
          <span class="sb-control-threshold-pairhead">{{ p.head }}</span>
          <span class="sb-control-threshold-pairbody">{{ p.body }}</span>
        </li>
      </ul>
    </div>

    <div class="sb-control-threshold-paths">
      <p class="sb-control-threshold-pathtitle">比例之外的五条路：都不靠比例，靠事先写清楚</p>
      <ul class="sb-control-threshold-pathlist">
        <li v-for="p in PATHS" :key="p.how" class="sb-control-threshold-pathitem">
          <span class="sb-control-threshold-pathhow">{{ p.how }}</span>
          <span class="sb-control-threshold-pathsay">{{ p.say }}</span>
        </li>
      </ul>
      <p class="sb-control-threshold-pathwarn">
        这五条是让"谁来投票、票怎么算"事先说清楚的治理安排，要写成书面并符合现行规则；本页不讨论任何绕开法律的做法。
      </p>
    </div>

    <span class="sr-only">
      这张图有两把并列的尺子，都是从 0% 到 100%。上面那把量的是持股比例，也就是你手上有多少股；下面那把量的是表决权比例，
      也就是股东会数票时真正在算的那个数。在有限责任公司里，这两个数经常不一样：章程或者全体股东的约定，
      可以让表决权和分红比例不按出资比例走（条文号待核）。图上的四条线是创业圈常见的口诀，不是法条原文。
      从左到右第一条是 30%：在未上市的有限公司里，它在表决权这把尺子上不落进任何新的一档，它只说明你手上有多少股；
      30% 常见于上市公司增持、要约那一类规则，以现行证券法规与交易所规则为准。
      第二条是 34%：一般理解里，特别决议需要三分之二以上表决权，所以握住超过三分之一就能让它通不过；
      三分之一约是 33.3%，写 34% 是留余量的说法。它给你的是否决，不是决定。
      第三条是 51%：过半数这一档管常规事项，选董事、审报告、日常经营决定；它够不到三分之二，
      改章程、增减注册资本、合并、分立、解散、变更公司形式这些事说了不算。
      第四条是 67%：三分之二以上表决权，一般理解为特别决议这一档，能改公司最根本的规则；
      但"以上"是按全体表决权还是按出席会议的表决权算，各地登记口径与章程写法可能不同。
      34% 和 67% 说的是同一道闸的两面：门槛只有一个，超过三分之一拦得住，达到三分之二推得动。
      比例之外还有五条路：一是章程约定表决权不与出资比例挂钩；二是一致行动协议；三是表决权委托；
      四是股份有限公司的特别表决权，也就是 AB 股，境内上市口径下一般只在注册制板块允许，要求上市前设置，
      并有表决权倍数上限、普通股占比下限和持有人锁定，具体倍数与条文号需以现行交易所规则原文核对，本页不给具体数；
      五是用有限合伙作为持股平台，股权分散而表决权集中。
      所有比例与事项列举都是待核口径，以现行《公司法》、登记机关口径和你公司的章程为准；
      本站不提供任何绕开法律的做法，落到书面前请专业律师读一遍。
    </span>

    <p class="sb-cap">
      四条线记成一句话：<b>30%</b> 是上市公司那套规则里的数，别抄进自己的有限公司；<b>34%</b>（超过三分之一表决权）
      让特别决议<b>过不去</b>；<b>51%</b>（过半数）管常规事项；<b>67%</b>（三分之二以上）才改得动章程、
      增减注册资本、合并分立解散这些根本事项——而 <b>34% 与 67% 本是同一道闸的两面</b>。
      最要紧的一句不是比例：<b>有限公司里表决权可以由章程另行约定，所以持股比例不等于控制权</b>；
      章程、一致行动协议、表决权委托、特别表决权（AB 股）、有限合伙持股平台，走的都是"事先把怎么数票写清楚"这条路。
      本页比例与事项均为常见口径、<b>逐条待核</b>，以现行《公司法》与登记机关口径和你的章程为准；
      具体到某一家公司、某一年，一律以当年当地口径与专业意见为准。
      本站不教任何绕开法律的做法，签之前请律师落成书面。
    </p>
  </div>
</template>

<style scoped>
.sb-control-threshold-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-bottom: 10px;
}

.sb-control-threshold-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-control-threshold-key i {
  width: 13px;
  height: 11px;
  border-radius: 3px;
  border: 1px solid var(--line-strong);
}

.sb-control-threshold-key.is-coral i {
  border-color: var(--coral);
  background: var(--coral-soft);
}

.sb-control-threshold-key.is-blue i {
  border-color: var(--blue);
  background: var(--blue-soft);
}

.sb-control-threshold-key.is-accent i {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.sb-control-threshold-key.is-strong i {
  border-color: var(--accent);
  background: var(--accent);
}

.sb-control-threshold-key.is-pair i {
  width: 16px;
  height: 8px;
  border-radius: 4px;
  background: var(--panel-3);
}

.sb-control-threshold-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-control-threshold-head,
.sb-control-threshold-note {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  fill: var(--faint);
}

/* 上条（持股比例）压暗，让眼睛先落在"真正决定结果"的下条上 */
.sb-control-threshold-lane1 {
  opacity: 0.5;
}

.sb-control-threshold-band {
  stroke: var(--line);
  stroke-width: 1;
}

.sb-control-threshold-band.is-coral {
  fill: var(--coral-soft);
}

.sb-control-threshold-band.is-blue {
  fill: var(--blue-soft);
}

.sb-control-threshold-band.is-accent {
  fill: var(--accent-soft);
}

.sb-control-threshold-band.is-strong {
  fill: var(--accent);
  fill-opacity: 0.28;
}

.sb-control-threshold-lane {
  fill: none;
  stroke: var(--line-strong);
  stroke-width: 1.2;
}

.sb-control-threshold-lanelab {
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 700;
  fill: var(--ink);
}

.sb-control-threshold-laneright {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  fill: var(--ink-2);
}

.sb-control-threshold-bridge {
  fill: var(--panel);
  stroke: var(--line-strong);
  stroke-width: 1;
  stroke-dasharray: 4 3;
}

.sb-control-threshold-bridgelab {
  font-family: var(--font-sans);
  font-size: 10.5px;
  font-weight: 700;
  fill: var(--coral);
}

.sb-control-threshold-axis {
  stroke: var(--line-strong);
  stroke-width: 1.4;
}

.sb-control-threshold-stem {
  stroke-width: 1.6;
  stroke-dasharray: 3 3;
  transition: stroke-width 0.3s var(--ease);
}

.sb-control-threshold-marker:hover .sb-control-threshold-stem {
  stroke-width: 3;
}

.sb-control-threshold-pct {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-anchor: middle;
}

.is-coral .sb-control-threshold-stem {
  stroke: var(--coral);
}

.is-blue .sb-control-threshold-stem {
  stroke: var(--blue);
}

.is-accent .sb-control-threshold-stem,
.is-strong .sb-control-threshold-stem {
  stroke: var(--accent);
}

.is-coral .sb-control-threshold-pct {
  fill: var(--coral);
}

.is-blue .sb-control-threshold-pct {
  fill: var(--blue);
}

.is-accent .sb-control-threshold-pct,
.is-strong .sb-control-threshold-pct {
  fill: var(--accent);
}

.sb-control-threshold-ticks line {
  stroke: var(--line-strong);
  stroke-width: 1;
}

.sb-control-threshold-ticks text {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  fill: var(--faint);
}

.sb-control-threshold-list {
  display: grid;
  gap: 10px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.sb-control-threshold-item {
  display: grid;
  gap: 5px;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--panel);
  box-shadow: var(--shadow);
}

.sb-control-threshold-item.is-coral {
  border-left-color: var(--coral);
}

.sb-control-threshold-item.is-blue {
  border-left-color: var(--blue);
}

.sb-control-threshold-item.is-strong {
  background: var(--accent-soft);
}

.sb-control-threshold-titlerow {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.sb-control-threshold-num {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--ink);
}

.sb-control-threshold-name {
  font-size: 12.5px;
  font-weight: 660;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-control-threshold-tier {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

/* 百分比条落在自己的网格列里，数值单独占一列：窄屏不会被 width:% 撑破 */
.sb-control-threshold-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58px;
  align-items: center;
  gap: 10px;
  margin-top: 1px;
}

.sb-control-threshold-track {
  display: block;
  min-width: 0;
  height: 12px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  overflow: hidden;
  background: var(--panel-2);
}

.sb-control-threshold-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
  transition: width 0.3s var(--ease);
}

.is-coral .sb-control-threshold-fill {
  background: var(--coral);
  opacity: 0.6;
}

.is-blue .sb-control-threshold-fill {
  background: var(--blue);
  opacity: 0.65;
}

.sb-control-threshold-val {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  text-align: right;
  color: var(--accent);
  white-space: nowrap;
}

.is-coral .sb-control-threshold-val {
  color: var(--coral);
}

.is-blue .sb-control-threshold-val {
  color: var(--blue);
}

.sb-control-threshold-val em {
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-control-threshold-can,
.sb-control-threshold-cannot {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.68;
  color: var(--ink-2);
}

.sb-control-threshold-can b,
.sb-control-threshold-cannot b {
  display: inline-block;
  margin-right: 5px;
  padding: 1px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--panel);
  background: var(--accent);
  vertical-align: 2px;
}

.sb-control-threshold-cannot b {
  background: var(--coral);
}

.sb-control-threshold-cannot {
  color: var(--muted);
}

.sb-control-threshold-pair {
  margin-top: 14px;
  padding: 12px 13px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
}

.sb-control-threshold-pairnote {
  margin: 0 0 9px;
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--ink-2);
}

.sb-control-threshold-pairlist {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-control-threshold-pairitem {
  display: grid;
  gap: 3px;
  min-width: 0;
  padding: 10px 11px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel);
}

.sb-control-threshold-pairpct {
  font-family: var(--font-mono);
  font-size: 17px;
  font-weight: 700;
  color: var(--blue);
}

.sb-control-threshold-pairitem.is-strong .sb-control-threshold-pairpct {
  color: var(--accent);
}

.sb-control-threshold-pairhead {
  font-size: 12px;
  font-weight: 700;
  color: var(--ink);
}

.sb-control-threshold-pairbody {
  font-size: 11.5px;
  line-height: 1.65;
  color: var(--muted);
}

.sb-control-threshold-paths {
  margin-top: 14px;
  padding: 12px 13px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel);
}

.sb-control-threshold-pathtitle {
  margin: 0 0 9px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.sb-control-threshold-pathlist {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-control-threshold-pathitem {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2px;
  padding-left: 10px;
  border-left: 2px solid var(--accent-soft);
}

.sb-control-threshold-pathhow {
  font-size: 12px;
  font-weight: 680;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-control-threshold-pathsay {
  font-size: 11.5px;
  line-height: 1.65;
  color: var(--muted);
}

.sb-control-threshold-pathwarn {
  margin: 10px 0 0;
  padding-top: 9px;
  border-top: 1px dashed var(--line-strong);
  font-size: 11px;
  line-height: 1.65;
  color: var(--coral);
}

@media (max-width: 760px) {
  /* 窄屏：两把尺子只当形状看，数字与结论全部落在下面的卡片里 */
  .sb-control-threshold-legend,
  .sb-control-threshold-svg text {
    display: none;
  }

  .sb-control-threshold-plot {
    grid-template-columns: minmax(0, 1fr) 52px;
    gap: 8px;
  }

  .sb-control-threshold-track {
    height: 18px;
  }

  .sb-control-threshold-pairlist {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-control-threshold-fill,
  .sb-control-threshold-stem {
    transition: none;
  }
}
</style>
