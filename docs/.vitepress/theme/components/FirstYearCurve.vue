<script setup lang="ts">
// /ready/first-year 的第一年现金折线。有负数，所以零线和负数区必须画出来。
// 数值是示意口径（待核）：讲的是形状，不是任何一家店的真实账。

/** 0 = 开工那天，1–12 = 第 1 到第 12 个月的月末现金余额（万元） */
const BALANCE = [20, 14.2, 9.4, 5.1, 1.6, -1.4, -3.2, -2, -0.3, 2.2, 5.4, 8.9, 12.6]

const VB_W = 470
const VB_H = 300
const LEFT = 46
const RIGHT = 454
const TOP = 26
const BOTTOM = 196
const Y_MAX = 22
const Y_MIN = -8
const TICKS = [20, 10, 0, -5]

const round = (n: number) => Math.round(n * 100) / 100
const xOf = (i: number) => round(LEFT + (i * (RIGHT - LEFT)) / (BALANCE.length - 1))
const yOf = (v: number) => round(TOP + ((Y_MAX - v) * (BOTTOM - TOP)) / (Y_MAX - Y_MIN))

const POINTS = BALANCE.map((v, i) => ({ i, v, x: xOf(i), y: yOf(v), major: i === 0 || i % 3 === 0 }))
const LINE = POINTS.map((p) => `${p.x},${p.y}`).join(' ')
const ZERO_Y = yOf(0)

const TROUGH = POINTS.reduce((min, p) => (p.v < min.v ? p : min), POINTS[0])
/** 谷底之后第一个回到零线及以上的月份 */
const TURN = POINTS.find((p) => p.i > TROUGH.i && p.v >= 0) ?? TROUGH

/** 零线以下的面积：端点用线性插值算出真正的穿零点，边界才不会竖着切一刀 */
const GAP_AREA = (() => {
  const verts: string[] = []
  const crossAt = (a: { x: number; v: number }, b: { x: number; v: number }) =>
    round(a.x + ((b.x - a.x) * a.v) / (a.v - b.v))
  for (let i = 0; i < POINTS.length; i += 1) {
    const p = POINTS[i]
    const prev = i > 0 ? POINTS[i - 1] : null
    if (prev && prev.v >= 0 && p.v < 0) verts.push(`${crossAt(prev, p)},${ZERO_Y}`)
    if (p.v < 0) verts.push(`${p.x},${p.y}`)
    if (prev && prev.v < 0 && p.v >= 0) verts.push(`${crossAt(prev, p)},${ZERO_Y}`)
  }
  return verts.length >= 3 ? verts.join(' ') : ''
})()

const labelOf = (i: number) => (i === 0 ? '开工' : String(i))
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
</script>

<template>
  <div class="sb-first-year-curve sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">First Year Cash · 第一年最缺钱在第几个月</span>
      <p class="sb-widget-sub">十二个月的现金余额连成一条线，凹下去的那截就是你要提前备好的钱。</p>
    </div>

    <figure class="sb-first-year-curve-fig">
      <div class="sb-first-year-curve-plot">
        <svg
          class="sb-first-year-curve-svg"
          :viewBox="`0 0 ${VB_W} ${VB_H}`"
          role="presentation"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id="sb-first-year-curve-below-zero">
              <rect :x="LEFT" :y="ZERO_Y" :width="RIGHT - LEFT" :height="BOTTOM - ZERO_Y" />
            </clipPath>
          </defs>

          <rect
            class="sb-first-year-curve-band"
            :x="LEFT"
            :y="ZERO_Y"
            :width="RIGHT - LEFT"
            :height="BOTTOM - ZERO_Y"
          />

          <line
            v-for="t in TICKS"
            :key="`grid-${t}`"
            class="sb-first-year-curve-grid"
            :class="{ 'is-zero': t === 0 }"
            :x1="LEFT"
            :y1="yOf(t)"
            :x2="RIGHT"
            :y2="yOf(t)"
          />
          <text
            v-for="t in TICKS"
            :key="`tick-${t}`"
            class="sb-first-year-curve-tick"
            :x="LEFT - 6"
            :y="yOf(t) + 3.5"
          >
            {{ fmt(t) }}
          </text>
          <text class="sb-first-year-curve-unit" :x="LEFT - 6" :y="TOP - 10">万元</text>

          <polygon class="sb-first-year-curve-gap" :points="GAP_AREA" />

          <polyline class="sb-first-year-curve-line" :points="LINE" />
          <polyline class="sb-first-year-curve-line is-under" :points="LINE" clip-path="url(#sb-first-year-curve-below-zero)" />

          <circle
            v-for="p in POINTS"
            :key="`dot-${p.i}`"
            class="sb-first-year-curve-dot"
            :cx="p.x"
            :cy="p.y"
            r="2.8"
          />

          <line
            class="sb-first-year-curve-stem"
            :x1="TROUGH.x"
            :y1="TROUGH.y"
            :x2="TROUGH.x"
            :y2="BOTTOM"
          />
          <circle class="sb-first-year-curve-trough" :cx="TROUGH.x" :cy="TROUGH.y" r="5" />
          <text class="sb-first-year-curve-trough-label" :x="TROUGH.x + 12" :y="TROUGH.y + 13">
            谷底：第 {{ TROUGH.i }} 个月
          </text>
          <text class="sb-first-year-curve-trough-value" :x="TROUGH.x + 12" :y="TROUGH.y + 26">
            账上 {{ fmt(TROUGH.v) }} 万
          </text>

          <circle class="sb-first-year-curve-turn" :cx="TURN.x" :cy="TURN.y" r="4" />
          <text class="sb-first-year-curve-turn-label" :x="TURN.x" :y="TURN.y - 10">
            第 {{ TURN.i }} 个月回正
          </text>

          <text class="sb-first-year-curve-band-label" :x="RIGHT - 2" :y="ZERO_Y + 12">
            零线以下 = 你在垫钱或欠钱
          </text>

          <text
            v-for="p in POINTS"
            :key="`x-${p.i}`"
            class="sb-first-year-curve-x"
            :class="{ 'is-minor': !p.major }"
            :x="p.x"
            :y="BOTTOM + 20"
          >
            {{ labelOf(p.i) }}
          </text>
          <text class="sb-first-year-curve-x-unit" :x="RIGHT" :y="BOTTOM + 38">月份</text>
        </svg>
      </div>

      <p class="sb-first-year-curve-callout">
        谷底这一格是全图最贵的地方：<b>借钱续命</b>还是<b>先收缩</b>，两种都能活，也两种都能把后面两年搭进去。
        决定之前先回答一句——收缩哪一条线，你一年后不后悔。
      </p>

      <span class="sr-only">
        十二个月的现金余额，单位万元，从开工那天起依次是：20、14.2、9.4、5.1、1.6、负 1.4、
        负 3.2（第 6 个月，谷底）、负 2、负 0.3、2.2（第 9 个月回到零线以上）、5.4、8.9、
        12.6。前三个月每月大约少 5 万，是最陡的一段；第 5 到第 8 个月在零线以下，最长的一次
        需要垫 {{ fmt(-TROUGH.v) }} 万。这些是示意数字，你自己的账要按自己的合同和工资表重算。
      </span>
    </figure>

    <p class="sb-cap">
      账上从 <b>20 万</b> 起，头三个月最陡（每月约 <b>5 万</b>），第 <b>6 个月</b> 跌到
      <b>负 3.2 万</b>，第 <b>9 个月</b> 才回到 <b>2.2 万</b>，年底 <b>12.6 万</b>。
      中间有 <b>4 个月</b> 你在往下垫钱——那是要提前备好的额度，不是到时候再想办法。
      还有一句：<b>这是现金余额，不是利润</b>，两个数完全可以符号相反。
    </p>
  </div>
</template>

<style scoped>
.sb-first-year-curve-fig {
  margin: 0;
}

.sb-first-year-curve-plot {
  min-width: 0;
}

.sb-first-year-curve-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-first-year-curve-band {
  fill: var(--coral-soft);
  opacity: 0.7;
}

.sb-first-year-curve-grid {
  stroke: var(--line);
  stroke-width: 1;
}

.sb-first-year-curve-grid.is-zero {
  stroke: var(--line-strong);
  stroke-width: 1.6;
}

.sb-first-year-curve-tick {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  fill: var(--faint);
  text-anchor: end;
}

.sb-first-year-curve-unit {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  fill: var(--faint);
  text-anchor: end;
}

.sb-first-year-curve-gap {
  fill: var(--coral);
  opacity: 0.14;
}

.sb-first-year-curve-line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.4;
  stroke-linejoin: round;
  stroke-linecap: round;
}

/* 零线以下的那一段换成语义色，缺口不用靠读者自己数格子 */
.sb-first-year-curve-line.is-under {
  stroke: var(--coral);
  stroke-width: 2.6;
}

.sb-first-year-curve-dot {
  fill: var(--panel);
  stroke: var(--accent);
  stroke-width: 1.6;
}

.sb-first-year-curve-stem {
  stroke: var(--coral);
  stroke-width: 1;
  stroke-dasharray: 3 4;
}

.sb-first-year-curve-trough {
  fill: var(--coral);
}

.sb-first-year-curve-trough-label {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  fill: var(--coral);
}

.sb-first-year-curve-trough-value {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  fill: var(--coral);
}

.sb-first-year-curve-turn {
  fill: var(--accent);
}

.sb-first-year-curve-turn-label {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  fill: var(--accent);
  text-anchor: middle;
}

.sb-first-year-curve-band-label {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  fill: var(--coral);
  text-anchor: end;
  opacity: 0.85;
}

.sb-first-year-curve-x {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  fill: var(--faint);
  text-anchor: middle;
}

.sb-first-year-curve-x-unit {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  fill: var(--faint);
  text-anchor: end;
}

.sb-first-year-curve-callout {
  margin: 12px 0 0;
  padding: 10px 12px;
  border: 1px dashed var(--coral);
  border-radius: var(--radius-sm);
  background: var(--coral-soft);
  font-size: 12px;
  line-height: 1.65;
  color: var(--ink-2);
}

.sb-first-year-curve-callout b {
  color: var(--coral);
}

@media (max-width: 760px) {
  /* 窄屏只留每三个月一个刻度，字反而放大——缩小的字等于没写 */
  .sb-first-year-curve-x.is-minor {
    display: none;
  }

  .sb-first-year-curve-x {
    font-size: 12px;
  }

  .sb-first-year-curve-tick {
    font-size: 11px;
  }

  .sb-first-year-curve-trough-label,
  .sb-first-year-curve-band-label {
    display: none;
  }

  .sb-first-year-curve-trough-value {
    font-size: 12px;
  }

  .sb-first-year-curve-turn-label {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-first-year-curve-line,
  .sb-first-year-curve-dot {
    transition: none;
  }
}
</style>
