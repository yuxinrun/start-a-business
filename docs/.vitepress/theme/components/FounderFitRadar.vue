<script setup lang="ts">
// /ready/self 的六维自评雷达。分数是 0–5 的示意值（待核），
// 目的是把"你缺的那一角"说出口，不是给人打分定命。

interface Dim {
  key: string
  name: string
  a: number
  b: number
  hint: string
}

const DIMS: Dim[] = [
  { key: 'cash', name: '现金流承受力', a: 4, b: 2, hint: '半年没进账，你还站得住吗' },
  { key: 'feel', name: '行业手感', a: 5, b: 2, hint: '这行的坑你踩过的有多少' },
  { key: 'sell', name: '能卖得出去', a: 4, b: 1, hint: '有没有人因为你开口就付过钱' },
  { key: 'boring', name: '忍得了无聊', a: 4, b: 3, hint: '重复第三遍还想把活干完吗' },
  { key: 'people', name: '会用人', a: 3, b: 2, hint: '交办的事能长成什么样' },
  { key: 'ego', name: '能承认错误', a: 3, b: 4, hint: '错了会不会当场改口径' }
]

const MAX = 5
const CX = 170
const CY = 155
const R = 88
const STEP = 360 / DIMS.length

const polar = (r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

const round = (n: number) => Math.round(n * 100) / 100

/** 每个维度的轴角度：从正上方开始，顺时针均分 */
const AXES = DIMS.map((d, i) => {
  const deg = -90 + i * STEP
  const outer = polar(R, deg)
  const label = polar(R + 26, deg)
  return {
    ...d,
    deg,
    x2: round(outer.x),
    y2: round(outer.y),
    lx: round(label.x),
    ly: round(label.y),
    anchor: i === 0 || i === 3 ? 'middle' : Math.cos((deg * Math.PI) / 180) > 0.2 ? 'start' : 'end'
  }
})

/** 由数据算多边形顶点，全部锁在 viewBox 内（最大半径 R，中心固定） */
const polyPoints = (pick: (d: Dim) => number) =>
  AXES.map((a) => {
    const p = polar((pick(a) / MAX) * R, a.deg)
    return `${round(p.x)},${round(p.y)}`
  }).join(' ')

const POINTS_A = polyPoints((d) => d.a)
const POINTS_B = polyPoints((d) => d.b)
const GRID_LEVELS = [1, 2, 3, 4, 5].map((lv) =>
  AXES.map((a) => {
    const p = polar((lv / MAX) * R, a.deg)
    return `${round(p.x)},${round(p.y)}`
  }).join(' ')
)

const DOTS_A = AXES.map((a) => {
  const p = polar((a.a / MAX) * R, a.deg)
  return { key: a.key, x: round(p.x), y: round(p.y) }
})
const DOTS_B = AXES.map((a) => {
  const p = polar((a.b / MAX) * R, a.deg)
  return { key: a.key, x: round(p.x), y: round(p.y) }
})

const lowestB = AXES.reduce((min, d) => (d.b < min.b ? d : min), AXES[0])
const LOWEST_B_DOT = DOTS_B.find((d) => d.key === lowestB.key)!
const sum = (pick: (d: Dim) => number) => DIMS.reduce((acc, d) => acc + pick(d), 0)
const TOTAL_A = sum((d) => d.a)
const TOTAL_B = sum((d) => d.b)
const MIN_A = DIMS.reduce((m, d) => Math.min(m, d.a), MAX)
</script>

<template>
  <div class="sb-founder-fit-radar sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Founder Fit · 我适不适合现在做这件事</span>
      <p class="sb-widget-sub">两个轮廓叠在一张图上：不是比谁分高，是看缺的那一角在哪一边。</p>
    </div>

    <figure class="sb-founder-fit-radar-fig">
      <div class="sb-founder-fit-radar-plot">
        <svg
          class="sb-founder-fit-radar-svg"
          viewBox="0 0 340 310"
          role="presentation"
          aria-hidden="true"
          focusable="false"
        >
          <polygon
            v-for="(g, i) in GRID_LEVELS"
            :key="`grid-${i}`"
            class="sb-founder-fit-radar-grid"
            :class="{ 'is-outer': i === GRID_LEVELS.length - 1 }"
            :points="g"
          />
          <line
            v-for="a in AXES"
            :key="`axis-${a.key}`"
            class="sb-founder-fit-radar-spoke"
            :x1="CX"
            :y1="CY"
            :x2="a.x2"
            :y2="a.y2"
          />

          <polygon class="sb-founder-fit-radar-area is-b" :points="POINTS_B" />
          <polygon class="sb-founder-fit-radar-area is-a" :points="POINTS_A" />

          <circle v-for="d in DOTS_A" :key="`dot-a-${d.key}`" class="sb-founder-fit-radar-dot is-a" :cx="d.x" :cy="d.y" r="3.4" />
          <circle v-for="d in DOTS_B" :key="`dot-b-${d.key}`" class="sb-founder-fit-radar-dot is-b" :cx="d.x" :cy="d.y" r="3" />

          <line
            class="sb-founder-fit-radar-miss"
            :x1="CX"
            :y1="CY"
            :x2="lowestB.x2"
            :y2="lowestB.y2"
          />
          <circle
            class="sb-founder-fit-radar-miss-dot"
            :cx="LOWEST_B_DOT.x"
            :cy="LOWEST_B_DOT.y"
            r="9"
          />

          <text v-for="a in AXES" :key="`label-${a.key}`" class="sb-founder-fit-radar-label" :x="a.lx" :y="a.ly + 4" :text-anchor="a.anchor">
            {{ a.name }}
          </text>
        </svg>
      </div>

      <div class="sb-founder-fit-radar-side">
        <p class="sb-founder-fit-radar-legend" aria-hidden="true">
          <span class="sb-founder-fit-radar-key is-a"><i></i>准备度 A：已在这行 5 年、家里有缓冲</span>
          <span class="sb-founder-fit-radar-key is-b"><i></i>准备度 B：技术强、没销售过、只有 6 个月存款</span>
        </p>

        <div class="sb-founder-fit-radar-rows">
          <div v-for="a in AXES" :key="`row-${a.key}`" class="sb-founder-fit-radar-row">
            <span class="sb-founder-fit-radar-name">{{ a.name }}</span>
            <span class="sb-founder-fit-radar-nums">{{ a.a }} / {{ a.b }}</span>
            <div class="sb-founder-fit-radar-track">
              <span class="sb-founder-fit-radar-meters">
                <i class="is-a" :style="{ width: (a.a / MAX) * 100 + '%' }"></i>
                <i class="is-b" :style="{ width: (a.b / MAX) * 100 + '%' }"></i>
              </span>
            </div>
            <span class="sb-founder-fit-radar-hint">{{ a.hint }}</span>
          </div>
        </div>

        <p class="sb-founder-fit-radar-note">
          B 最凹的一角是<b>{{ lowestB.name }}</b>（{{ lowestB.b }} 分）——图上那一根珊瑚色的轴。
        </p>
      </div>

      <span class="sr-only">
        六个维度上的示意分数，满分 5 分，顺序是「准备度 A 对 准备度 B」：现金流承受力
        {{ DIMS[0].a }} 对 {{ DIMS[0].b }}；行业手感 {{ DIMS[1].a }} 对 {{ DIMS[1].b }}；能卖得出去
        {{ DIMS[2].a }} 对 {{ DIMS[2].b }}；忍得了无聊 {{ DIMS[3].a }} 对 {{ DIMS[3].b }}；会用人
        {{ DIMS[4].a }} 对 {{ DIMS[4].b }}；能承认错误 {{ DIMS[5].a }} 对 {{ DIMS[5].b }}。A
        是"已经在这行做了 5 年、家里有缓冲"，六项合计 {{ TOTAL_A }} 分，最低的一项也有
        {{ MIN_A }} 分；B 是"技术强、没做销售、只有 6 个月存款"，合计 {{ TOTAL_B }}
        分，最低的是「{{ lowestB.name }}」只有 {{ lowestB.b }} 分。这些数字是示意口径，不是测评结果，
        也别拿它当能不能创业的判断。
      </span>
    </figure>

    <p class="sb-cap">
      A 六项最低也有 <b>{{ MIN_A }} 分</b>（<b>会用人</b>、<b>能承认错误</b>），B 的
      <b>能卖得出去只有 {{ lowestB.b }} 分</b>——合计 <b>{{ TOTAL_A }} 对 {{ TOTAL_B }}</b>，
      差在角上不在努力上。雷达不是算命，它只把"你缺的那一角"说出口：
      <b>缺角可以用合伙人补</b>，不能用"我很努力"补。
    </p>
  </div>
</template>

<style scoped>
.sb-founder-fit-radar-fig {
  margin: 0;
}

.sb-founder-fit-radar-plot {
  min-width: 0;
  max-width: 380px;
  margin-inline: auto;
}

.sb-founder-fit-radar-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-founder-fit-radar-grid {
  fill: none;
  stroke: var(--line);
  stroke-width: 1;
}

.sb-founder-fit-radar-grid.is-outer {
  stroke: var(--line-strong);
}

.sb-founder-fit-radar-spoke {
  stroke: var(--line);
  stroke-width: 1;
}

.sb-founder-fit-radar-area {
  stroke-linejoin: round;
}

.sb-founder-fit-radar-area.is-a {
  fill: var(--accent-soft);
  stroke: var(--accent);
  stroke-width: 2;
}

.sb-founder-fit-radar-area.is-b {
  fill: var(--blue-soft);
  stroke: var(--blue);
  stroke-width: 1.8;
  stroke-dasharray: 6 4;
}

.sb-founder-fit-radar-dot.is-a {
  fill: var(--accent);
}

.sb-founder-fit-radar-dot.is-b {
  fill: var(--blue);
}

.sb-founder-fit-radar-miss {
  stroke: var(--coral);
  stroke-width: 1.4;
  stroke-dasharray: 3 4;
}

.sb-founder-fit-radar-miss-dot {
  fill: none;
  stroke: var(--coral);
  stroke-width: 1.6;
}

.sb-founder-fit-radar-label {
  font-family: var(--font-sans);
  font-size: 11px;
  fill: var(--muted);
}

.sb-founder-fit-radar-side {
  margin-top: 16px;
}

.sb-founder-fit-radar-legend {
  display: grid;
  gap: 5px;
  margin: 0 0 12px;
}

.sb-founder-fit-radar-key {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: 0.06em;
  color: var(--faint);
  overflow-wrap: anywhere;
}

.sb-founder-fit-radar-key i {
  flex: none;
  width: 16px;
  height: 8px;
  border: 1px solid var(--accent);
  background: var(--accent-soft);
}

.sb-founder-fit-radar-key.is-b i {
  border-style: dashed;
  border-color: var(--blue);
  background: var(--blue-soft);
}

/* 分数条放在自己的轨道里，数值单独一列：窄屏不会把条挤出容器 */
.sb-founder-fit-radar-rows {
  display: grid;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px dashed var(--line-strong);
}

.sb-founder-fit-radar-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 46px;
  gap: 4px 10px;
  align-items: center;
}

.sb-founder-fit-radar-track {
  grid-column: 1;
  grid-row: 2;
  min-width: 0;
}

.sb-founder-fit-radar-meters {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.sb-founder-fit-radar-meters i {
  display: block;
  height: 7px;
  min-width: 3px;
  border-radius: 4px;
  background: var(--accent);
  transition: width 0.3s var(--ease);
}

.sb-founder-fit-radar-meters i.is-b {
  background: var(--blue);
  opacity: 0.72;
  height: 5px;
}

.sb-founder-fit-radar-nums {
  grid-column: 2;
  grid-row: 1;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  color: var(--ink-2);
  text-align: right;
  white-space: nowrap;
}

.sb-founder-fit-radar-name {
  grid-column: 1;
  grid-row: 1;
  font-size: 12.5px;
  font-weight: 660;
  color: var(--ink);
}

.sb-founder-fit-radar-hint {
  grid-column: 1 / -1;
  grid-row: 3;
  font-size: 11px;
  line-height: 1.55;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-founder-fit-radar-note {
  margin: 12px 0 0;
  padding: 10px 12px;
  border: 1px dashed var(--coral);
  border-radius: var(--radius-sm);
  background: var(--coral-soft);
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-2);
}

.sb-founder-fit-radar-note b {
  color: var(--coral);
}

@media (max-width: 760px) {
  .sb-founder-fit-radar-plot {
    max-width: 320px;
  }

  .sb-founder-fit-radar-label {
    font-size: 12px;
  }

  .sb-founder-fit-radar-row {
    grid-template-columns: minmax(0, 1fr) 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-founder-fit-radar-meters i {
    transition: none;
  }
}
</style>
