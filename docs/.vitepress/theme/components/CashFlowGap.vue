<script setup lang="ts">
interface MonthPoint {
  m: string
  pay: number
  cash: number
}

// 草稿口径（待核）：账期 60 天、月付货款与工资；单位＝万元/月，示意推演，不是任何一家的账。
const SERIES: MonthPoint[] = [
  { m: '1月', pay: 2.6, cash: 0.3 },
  { m: '2月', pay: 2.5, cash: 1.0 },
  { m: '3月', pay: 2.4, cash: 1.6 },
  { m: '4月', pay: 2.4, cash: 2.0 },
  { m: '5月', pay: 2.5, cash: 2.2 },
  { m: '6月', pay: 2.6, cash: 2.4 },
  { m: '7月', pay: 2.7, cash: 2.6 },
  { m: '8月', pay: 2.8, cash: 2.8 },
  { m: '9月', pay: 2.9, cash: 3.0 },
  { m: '10月', pay: 3.0, cash: 3.2 },
  { m: '11月', pay: 3.1, cash: 3.4 },
  { m: '12月', pay: 3.2, cash: 3.6 }
]

const VB_W = 720
const VB_H = 320
const X0 = 56
const X1 = 690
const Y_TOP = 30
const Y_BOT = 250
const V_MAX = 5
const STEP = (X1 - X0) / (SERIES.length - 1)
const xOf = (i: number) => X0 + i * STEP
const yOf = (v: number) => Y_BOT - (v / V_MAX) * (Y_BOT - Y_TOP)

const gapOf = (p: MonthPoint) => Math.round((p.pay - p.cash) * 10) / 10
// 累计垫资：逐月把差额累起来，峰值就是"你最缺钱那天要准备的数"
const CUM: number[] = SERIES.reduce<number[]>((acc, p, i) => {
  const prev = i === 0 ? 0 : acc[i - 1]
  return [...acc, Math.round((prev + gapOf(p)) * 10) / 10]
}, [])
const peakValue = Math.max(...CUM)
const peakIndex = CUM.indexOf(peakValue)
const avgPay = SERIES.reduce((s, p) => s + p.pay, 0) / SERIES.length
const peakMonths = Math.round(peakValue / avgPay)

// 两条线第一次交叉的位置：缺口面积只填到那里，越界就会画反
const firstNegative = SERIES.findIndex((p) => gapOf(p) < 0)
const CLOSE = firstNegative < 0 ? SERIES.length - 1 : Math.max(1, firstNegative - 1)

const line = (key: 'pay' | 'cash') =>
  SERIES.map((p, i) => `${xOf(i).toFixed(1)},${yOf(p[key]).toFixed(1)}`).join(' ')

const gapArea = () => {
  const top = SERIES.slice(0, CLOSE + 1)
    .map((p, i) => `${xOf(i).toFixed(1)},${yOf(p.pay).toFixed(1)}`)
    .join(' L ')
  const bottom = SERIES.slice(0, CLOSE + 1)
    .map((p, i) => ({ x: xOf(i).toFixed(1), y: yOf(p.cash).toFixed(1) }))
    .reverse()
    .map((pt) => `${pt.x},${pt.y}`)
    .join(' L ')
  return `M ${top} L ${bottom} Z`
}

const month = (i: number) => SERIES[i].m
const gapText = (i: number) => {
  const g = gapOf(SERIES[i])
  return g > 0 ? `需垫 ${g.toFixed(1)}` : g === 0 ? '打平' : `回正 ${Math.abs(g).toFixed(1)}`
}
</script>

<template>
  <div class="sb-cash-flow-gap sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Cash Gap · 钱什么时候到你手上</span>
      <p class="sb-widget-sub">两条线之间的空地，就是你必须先垫出来的钱。它不在利润表上。</p>
    </div>

    <div class="sb-cash-flow-gap-legend" aria-hidden="true">
      <span><i class="is-in"></i>实际回款（流入）</span>
      <span><i class="is-out"></i>付款义务（货款、工资、房租）</span>
      <span><i class="is-gap"></i>中间填色＝需要的周转资金</span>
      <span class="sb-cash-flow-gap-unit">单位：万元 / 月 · 账期 60 天</span>
    </div>

    <figure class="sb-cash-flow-gap-fig">
      <svg
        class="sb-cash-flow-gap-svg"
        :viewBox="`0 0 ${VB_W} ${VB_H}`"
        role="img"
        :aria-label="`12 个月付款义务与实际回款对比图，峰值缺口约 ${peakValue} 万元，数字见下方文字说明`"
      >
        <line class="sb-cash-flow-gap-grid" :x1="X0" :y1="Y_BOT" :x2="X1" :y2="Y_BOT" />
        <line
          v-for="t in [1, 2, 3, 4, 5]"
          :key="'g' + t"
          class="sb-cash-flow-gap-grid"
          :x1="X0"
          :y1="yOf(t)"
          :x2="X1"
          :y2="yOf(t)"
        />
        <text
          v-for="t in [0, 1, 2, 3, 4, 5]"
          :key="'yt' + t"
          class="sb-cash-flow-gap-tick"
          :x="X0 - 10"
          :y="yOf(t) + 4"
          text-anchor="end"
        >
          {{ t }}
        </text>
        <text class="sb-cash-flow-gap-axis" x="20" :y="(Y_TOP + Y_BOT) / 2" text-anchor="middle" transform="rotate(-90 20 140)">
          金额（万元 / 月）
        </text>

        <path class="sb-cash-flow-gap-area" :d="gapArea()" aria-hidden="true" />

        <g v-for="(p, i) in SERIES" :key="'v' + p.m" class="sb-cash-flow-gap-vline" :class="{ 'is-even': i % 2 === 1 }">
          <line :x1="xOf(i)" :y1="Y_TOP" :x2="xOf(i)" :y2="Y_BOT" />
          <text class="sb-cash-flow-gap-tick" :x="xOf(i)" :y="Y_BOT + 22" text-anchor="middle">{{ p.m }}</text>
        </g>

        <polyline class="sb-cash-flow-gap-pay" :points="line('pay')" fill="none" />
        <polyline class="sb-cash-flow-gap-cash" :points="line('cash')" fill="none" />

        <line class="sb-cash-flow-gap-peak" :x1="xOf(peakIndex)" :y1="Y_TOP + 6" :x2="xOf(peakIndex)" :y2="yOf(SERIES[peakIndex].pay)" />
        <circle class="sb-cash-flow-gap-peak-dot" :cx="xOf(peakIndex)" :cy="yOf(SERIES[peakIndex].pay)" r="5" />
        <text class="sb-cash-flow-gap-note" :x="xOf(peakIndex) + 12" :y="Y_TOP + 18" text-anchor="start">
          {{ month(peakIndex) }}：累计要垫约 {{ peakValue.toFixed(1) }} 万（≈{{ peakMonths }} 个月开销）
        </text>
        <text class="sb-cash-flow-gap-inside" :x="xOf(1) + 10" :y="yOf(1.0)" text-anchor="start">缺口＝你先垫的钱</text>
        <text class="sb-cash-flow-gap-axis" :x="X1" :y="Y_BOT + 46" text-anchor="end">月份 →</text>
      </svg>

      <div class="sb-cash-flow-gap-table" aria-hidden="true">
        <div class="sb-cash-flow-gap-trow is-head">
          <span>月份</span><span>付款</span><span>回款</span><span>差额</span>
        </div>
        <div v-for="(p, i) in SERIES" :key="'r' + p.m" class="sb-cash-flow-gap-trow">
          <span>{{ p.m }}</span>
          <span>{{ p.pay.toFixed(1) }}</span>
          <span>{{ p.cash.toFixed(1) }}</span>
          <span :class="gapOf(p) > 0 ? 'is-gap' : 'is-ok'">{{ gapText(i) }}</span>
        </div>
      </div>

      <span class="sr-only">
        十二个月的付款义务与实际回款，单位万元每个月，账期 60 天，示意口径、待核。
        付款义务：1 月 2.6、2 月 2.5、3 月 2.4、4 月 2.4、5 月 2.5、6 月 2.6、7 月 2.7、8 月
        2.8、9 月 2.9、10 月 3.0、11 月 3.1、12 月 3.2。
        实际回款：1 月 0.3、2 月 1.0、3 月 1.6、4 月 2.0、5 月 2.2、6 月 2.4、7 月 2.6、8 月
        2.8、9 月 3.0、10 月 3.2、11 月 3.4、12 月 3.6。
        逐月差额相加后，累计需要垫的钱在第 7 个月到顶，约
        {{ peakValue.toFixed(1) }} 万元，约等于 {{ peakMonths }}
        个月的开销；到第 8 个月两条线交叉，之后回款反超付款，但年底手上仍垫着约
        4.6 万元没收回来。注意这是现金，不是利润。
      </span>
    </figure>

    <p class="sb-cap">
      前 7 个月每个月都在付款、回款却晚两个月，累计最多要自己垫 <b>约 5.6 万元</b>，约等于
      <b>2 个月的开销</b>；第 8 个月两条线才交叉。「利润是观点，现金是事实」——一门赚钱的生意，完全可以在等回款的那
      <b>60 天</b>里被自己的账期憋死（账期与金额均为示意口径，待核；税费与社保以当地当年口径为准）。
    </p>
  </div>
</template>

<style scoped>
.sb-cash-flow-gap-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-cash-flow-gap-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sb-cash-flow-gap-legend i {
  width: 14px;
  height: 9px;
  border-radius: 3px;
  border: 1px solid var(--line-strong);
}

.sb-cash-flow-gap-legend .is-in {
  background: var(--accent);
}

.sb-cash-flow-gap-legend .is-out {
  background: var(--coral);
}

.sb-cash-flow-gap-legend .is-gap {
  background: var(--coral);
  opacity: 0.2;
}

.sb-cash-flow-gap-fig {
  margin: 0;
}

.sb-cash-flow-gap-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-grid) {
  stroke: var(--line);
  stroke-width: 1;
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-vline line) {
  stroke: var(--line);
  stroke-width: 1;
  stroke-dasharray: 2 4;
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-tick) {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  fill: var(--faint);
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-axis) {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  fill: var(--muted);
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-area) {
  fill: var(--coral);
  fill-opacity: 0.18;
  stroke: none;
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-pay) {
  stroke: var(--coral);
  stroke-width: 2.5;
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-cash) {
  stroke: var(--accent);
  stroke-width: 2.5;
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-peak) {
  stroke: var(--coral);
  stroke-width: 1.5;
  stroke-dasharray: 5 4;
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-peak-dot) {
  fill: var(--coral);
  stroke: var(--panel);
  stroke-width: 2;
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-note) {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  fill: var(--ink-2);
}

.sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-inside) {
  font-family: var(--font-sans);
  font-size: 11px;
  fill: var(--ink);
}

/* 窄屏另一套读法：折线之外的数交给这张表 */
.sb-cash-flow-gap-table {
  display: none;
}

@media (max-width: 760px) {
  .sb-cash-flow-gap-legend .sb-cash-flow-gap-unit {
    flex-basis: 100%;
  }

  /* 竖线与月份太挤，只留偶数位 */
  .sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-vline.is-even line) {
    display: none;
  }

  .sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-vline.is-even .sb-cash-flow-gap-tick) {
    display: none;
  }

  .sb-cash-flow-gap-table {
    display: grid;
    gap: 2px;
    margin-top: 16px;
  }

  .sb-cash-flow-gap-trow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 56px) minmax(0, 56px) minmax(0, 84px);
    align-items: center;
    gap: 8px;
    padding: 4px 6px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.04em;
    color: var(--ink-2);
    background: var(--panel-2);
  }

  .sb-cash-flow-gap-trow.is-head {
    background: transparent;
    font-size: 9.5px;
    letter-spacing: 0.1em;
    color: var(--faint);
  }

  .sb-cash-flow-gap-trow span:last-child {
    text-align: right;
    white-space: nowrap;
  }

  .sb-cash-flow-gap-trow .is-gap {
    color: var(--coral);
  }

  .sb-cash-flow-gap-trow .is-ok {
    color: var(--accent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-cash-flow-gap-svg :deep(.sb-cash-flow-gap-peak-dot) {
    transition: none;
  }
}
</style>
