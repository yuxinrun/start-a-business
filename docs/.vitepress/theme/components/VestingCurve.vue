<script setup lang="ts">
// 绘图区：x 48→612（0–48 个月），y 196（0%）→22（100%）；"离开就是 0"单独放在 228 这条道上。
const X0 = 48
const X1 = 612
const Y0 = 196
const Y_TOP = 22
const Y_SPAN = Y0 - Y_TOP
const ZERO_LANE = 228
const X_LAB = Y0 + 16
const ZERO_LAB = ZERO_LANE + 16

const TOTAL_MONTHS = 48
const CLIFF_MONTH = 12
const CLIFF_PCT = 25

const xOf = (m: number) => X0 + (m / TOTAL_MONTHS) * (X1 - X0)
const yOf = (pct: number) => Y0 - (pct / 100) * Y_SPAN

// 4 年按 36 期逐月兑现（第 13 个月起到第 48 个月），每月约 2.08 个百分点
const PER_MONTH = (100 - CLIFF_PCT) / (TOTAL_MONTHS - CLIFF_MONTH)

const stepPath = (): string => {
  const parts = [`M ${xOf(0).toFixed(1)} ${Y0}`, `L ${xOf(CLIFF_MONTH).toFixed(1)} ${Y0}`]
  parts.push(`L ${xOf(CLIFF_MONTH).toFixed(1)} ${yOf(CLIFF_PCT).toFixed(1)}`)
  for (let m = CLIFF_MONTH + 1; m <= TOTAL_MONTHS; m++) {
    const prev = CLIFF_PCT + (m - CLIFF_MONTH - 1) * PER_MONTH
    const now = CLIFF_PCT + (m - CLIFF_MONTH) * PER_MONTH
    parts.push(`L ${xOf(m).toFixed(1)} ${yOf(prev).toFixed(1)}`)
    parts.push(`L ${xOf(m).toFixed(1)} ${yOf(now).toFixed(1)}`)
  }
  return parts.join(' ')
}

const STEP_D = stepPath()
const ZERO_D = `M ${xOf(0).toFixed(1)} ${ZERO_LANE} L ${xOf(TOTAL_MONTHS).toFixed(1)} ${ZERO_LANE}`
const GRID = [0, 25, 50, 75, 100]

// 里程碑表：窄屏时这张表就是全部信息，SVG 只当形状看
const MARKS = [
  { at: '第 1–11 个月', pct: 0, bad: true, say: '任何一个月走，兑现都是 0' },
  { at: '满 12 个月（cliff 到点）', pct: 25, bad: false, say: '一次性兑现四分之一' },
  { at: '满 24 个月', pct: 50, bad: false, say: '一半落袋' },
  { at: '满 36 个月', pct: 75, bad: false, say: '再撑一年' },
  { at: '满 48 个月', pct: 100, bad: false, say: '全部兑现，但不等于已到手' }
]
</script>

<template>
  <div class="sb-vesting-curve sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Vesting Curve · 股权怎么给才不后悔</span>
      <p class="sb-widget-sub">四年、按月兑现、第一年是个坎。折线讲的是"待得久才拿得全"。</p>
    </div>

    <svg class="sb-vesting-curve-svg" viewBox="0 0 640 256" role="img" aria-labelledby="sb-vesting-curve-t">
      <title id="sb-vesting-curve-t">四年按月兑现曲线：第一年为 cliff，第 12 个月末跳到 25%，之后按月台阶式上升；另一条零线表示第 1 年内离开一股不兑现</title>

      <rect class="sb-vesting-curve-cliffzone" :x="X0" :y="Y_TOP" :width="xOf(CLIFF_MONTH) - X0" :height="Y0 - Y_TOP" />
      <g class="sb-vesting-curve-grid">
        <line v-for="g in GRID" :key="'l' + g" :x1="X0" :x2="X1" :y1="yOf(g)" :y2="yOf(g)" />
      </g>
      <text class="sb-vesting-curve-clifftag" :x="xOf(6)" :y="Y0 - 8">cliff 区</text>

      <g class="sb-vesting-curve-ylab">
        <text v-for="g in GRID" :key="'t' + g" :x="X0 - 9" :y="yOf(g) + 4">{{ g }}%</text>
      </g>

      <path class="sb-vesting-curve-step" :d="STEP_D" />
      <path class="sb-vesting-curve-zero" :d="ZERO_D" />

      <circle class="sb-vesting-curve-mark" :cx="xOf(CLIFF_MONTH)" :cy="yOf(CLIFF_PCT)" r="5" />
      <text class="sb-vesting-curve-markval" :x="xOf(CLIFF_MONTH) + 11" :y="yOf(CLIFF_PCT) + 4">第 12 个月 25%</text>
      <circle class="sb-vesting-curve-mark" :cx="xOf(48)" :cy="yOf(100)" r="5" />
      <text class="sb-vesting-curve-markval" :x="xOf(44)" :y="yOf(100) - 12">满 4 年 100%</text>

      <text class="sb-vesting-curve-xlab" :x="X0" :y="X_LAB">第 0 月</text>
      <text class="sb-vesting-curve-xlab" :x="xOf(12)" :y="X_LAB" text-anchor="middle">第 12 月</text>
      <text class="sb-vesting-curve-xlab" :x="xOf(24)" :y="X_LAB" text-anchor="middle">第 24 月</text>
      <text class="sb-vesting-curve-xlab" :x="xOf(36)" :y="X_LAB" text-anchor="middle">第 36 月</text>
      <text class="sb-vesting-curve-xlab" :x="xOf(48)" :y="X_LAB" text-anchor="end">第 48 月</text>

      <text class="sb-vesting-curve-zerolab" :x="xOf(0)" :y="ZERO_LAB">第 1 年内离开 = 0 股（这条零线全程都是 0）</text>
    </svg>

    <figure class="sb-vesting-curve-fig">
      <div v-for="m in MARKS" :key="m.at" class="sb-vesting-curve-row">
        <div class="sb-vesting-curve-meta">
          <span class="sb-vesting-curve-at" :class="m.bad ? 'is-bad' : ''">{{ m.at }}</span>
          <span class="sb-vesting-curve-say">{{ m.say }}</span>
        </div>
        <div class="sb-vesting-curve-plot">
          <div class="sb-vesting-curve-track">
            <span
              class="sb-vesting-curve-fill"
              :class="m.bad ? 'is-bad' : ''"
              :style="{ width: m.pct + '%' }"
            ></span>
          </div>
          <span class="sb-vesting-curve-val" :class="m.bad ? 'is-bad' : ''">{{ m.pct }}%</span>
        </div>
      </div>
      <span class="sr-only">
        这张图两条线。第一条是在职兑现：第 0 到第 11 个月一直是 0；到第 12 个月末一次性兑现 25%，
        之后按月兑现，第 13 个月到第 48 个月共 36 期，每期约 2.08 个百分点，也就是满 24 个月到 50%、
        满 36 个月到 75%、满 48 个月到 100%。第二条是第 1 年内离开的结果：0%，而且往后一直是 0，
        因为 cliff（一年门槛）之前一股都不兑现。图上的月数与比例是最常见的结构示意，
        具体条款惯例、离职时的回购价格与计算方式待核，以当年当地口径与专业意见为准。
      </span>
    </figure>

    <p class="sb-cap">
      最常见的结构是 <b>4 年 + 1 年 cliff</b>：满 <b>12 个月</b>才一次兑现 <b>25%</b>，之后分 <b>36 期</b> 按月给，
      每月约 <b>2.08%</b>（待核：这只是常见示意，不是法定结构）。第 1 年内走的人拿到 <b>0</b>——
      这条线不是惩罚，是保护：保护留下的人，也保护<b>刚被给了股的那个人自己</b>。
      两句要紧的：兑现不等于到手，离职时的<b>回购价</b>才是重点（条款惯例待核）；
      股权与协议的写法以当年当地口径与专业意见为准，请律师落成书面。
    </p>
  </div>
</template>

<style scoped>
.sb-vesting-curve-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-vesting-curve-cliffzone {
  fill: var(--coral-soft);
  stroke: var(--coral);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.sb-vesting-curve-grid line {
  stroke: var(--line);
  stroke-width: 1;
}

.sb-vesting-curve-ylab text,
.sb-vesting-curve-xlab {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  fill: var(--faint);
}

.sb-vesting-curve-ylab text {
  text-anchor: end;
}

.sb-vesting-curve-clifftag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  fill: var(--coral);
  text-anchor: middle;
}

.sb-vesting-curve-step {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.6;
  stroke-linejoin: round;
  stroke-linecap: butt;
}

.sb-vesting-curve-zero {
  fill: none;
  stroke: var(--coral);
  stroke-width: 2.6;
  stroke-dasharray: 6 5;
}

.sb-vesting-curve-mark {
  fill: var(--panel);
  stroke: var(--accent);
  stroke-width: 2.6;
}

.sb-vesting-curve-markval {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  fill: var(--accent);
}

.sb-vesting-curve-zerolab {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  fill: var(--coral);
}

.sb-vesting-curve-fig {
  margin: 12px 0 0;
}

.sb-vesting-curve-row {
  margin-bottom: 11px;
}

.sb-vesting-curve-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}

.sb-vesting-curve-at {
  font-size: 12.5px;
  font-weight: 660;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-vesting-curve-at.is-bad {
  color: var(--coral);
}

.sb-vesting-curve-say {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
  text-align: right;
}

.sb-vesting-curve-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px;
  align-items: center;
  gap: 10px;
}

.sb-vesting-curve-track {
  min-width: 0;
  height: 16px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  overflow: hidden;
  background: var(--panel-2);
}

.sb-vesting-curve-fill {
  display: block;
  height: 100%;
  background: var(--accent);
  transition: width 0.3s var(--ease);
}

.sb-vesting-curve-fill.is-bad {
  background: var(--coral);
  opacity: 0.3;
}

.sb-vesting-curve-val {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  text-align: right;
  color: var(--accent);
  white-space: nowrap;
}

.sb-vesting-curve-val.is-bad {
  color: var(--coral);
}

@media (max-width: 760px) {
  /* 窄屏：SVG 里的字会小到读不清，只保留曲线形状，数字全部交给下面的里程碑表 */
  .sb-vesting-curve-svg text,
  .sb-vesting-curve-say {
    display: none;
  }

  .sb-vesting-curve-plot {
    grid-template-columns: minmax(0, 1fr) 44px;
    gap: 8px;
  }

  .sb-vesting-curve-track {
    height: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-vesting-curve-fill {
    transition: none;
  }
}
</style>
