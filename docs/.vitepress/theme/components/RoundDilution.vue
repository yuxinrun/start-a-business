<script setup lang="ts">
interface Round {
  name: string
  note: string
  sold: number
}

// 示意路径（待核）：每轮出让落在通行的 10%–20% 区间内，累计到 C 轮后创始团队剩约 30%
const ROUNDS: Round[] = [
  { name: '自有资金', note: '自己的钱 + 借的', sold: 0 },
  { name: '天使', note: '第一次卖股', sold: 18 },
  { name: 'Pre-A / A', note: '要开始交数据', sold: 20 },
  { name: 'B', note: '买的是规模', sold: 18 },
  { name: 'C', note: '通常是财务投资', sold: 14 }
]

/* 坐标映射：绘图区 x 40→620、y 196(0%)→26(100%)。
   先把末端算好再写函数，保证柱子与折线都落在 viewBox(640×268) 内。 */
const X0 = 40
const X1 = 620
const Y0 = 196
const Y_TOP = 26
const Y_SPAN = Y0 - Y_TOP
const SLOT = (X1 - X0) / ROUNDS.length
const BAR_W = 50

const center = (i: number) => X0 + SLOT * i + SLOT / 2
const yOf = (pct: number) => Y0 - (pct / 100) * Y_SPAN

interface Plotted extends Round {
  left: number
  soldBefore: number
  cx: number
  barX: number
  barY: number
  barH: number
  lineY: number
  first: boolean
  anchor: 'start' | 'middle'
}

const ROWS: Plotted[] = (() => {
  let left = 100
  return ROUNDS.map((r, i) => {
    const soldBefore = 100 - left
    left = left - r.sold
    const barH = (r.sold / 100) * Y_SPAN
    // 第 1、2 格的标签会撞字，所以这两格改成左对齐
    const anchor: 'start' | 'middle' = i === 0 || i === 1 ? 'start' : 'middle'
    return {
      ...r,
      left,
      soldBefore,
      cx: center(i),
      barX: center(i) - BAR_W / 2,
      barY: Y0 - barH,
      barH,
      lineY: yOf(left),
      first: i === 0,
      anchor
    }
  })
})()

const LINE_POINTS = ROWS.map((r) => `${r.cx.toFixed(1)},${r.lineY.toFixed(1)}`).join(' ')
const GRID = [0, 25, 50, 75, 100]
const LAST = ROWS[ROWS.length - 1]
const TOTAL_SOLD = ROUNDS.reduce((a, r) => a + r.sold, 0)
</script>

<template>
  <div class="sb-round-dilution sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Dilution By Round · 每一轮卖掉多少自己</span>
      <p class="sb-widget-sub">柱子是这一轮出让的比例，折线是创始团队还剩多少——两条一起看才知道疼在哪。</p>
    </div>

    <div class="sb-round-dilution-legend" aria-hidden="true">
      <span class="sb-round-dilution-key"><i class="is-bar"></i>柱：本轮出让</span>
      <span class="sb-round-dilution-key"><i class="is-line"></i>线：创始团队剩余持股</span>
      <span class="sb-round-dilution-key">示意口径 · 比例待核</span>
    </div>

    <svg class="sb-round-dilution-svg" viewBox="0 0 640 268" role="img" aria-labelledby="sb-round-dilution-t">
      <title id="sb-round-dilution-t">五格：自有资金、天使、Pre-A 与 A、B、C。柱子表示本轮出让比例，折线表示创始团队剩余持股</title>

      <g class="sb-round-dilution-grid">
        <line v-for="g in GRID" :key="'g' + g" :x1="X0" :x2="X1" :y1="yOf(g)" :y2="yOf(g)" />
      </g>
      <g class="sb-round-dilution-axis">
        <text v-for="g in GRID" :key="'t' + g" :x="X0 - 8" :y="yOf(g) + 4" class="sb-round-dilution-tick">{{ g }}%</text>
        <line :x1="X0" :x2="X1" :y1="Y0" :y2="Y0" class="sb-round-dilution-base" />
      </g>

      <g v-for="r in ROWS" :key="r.name" class="sb-round-dilution-col">
        <rect
          v-if="r.sold > 0"
          class="sb-round-dilution-bar"
          :x="r.barX"
          :y="r.barY"
          :width="BAR_W"
          :height="r.barH"
          rx="4"
        />
        <rect v-else class="sb-round-dilution-ghost" :x="r.barX" :y="Y0 - 6" :width="BAR_W" :height="6" rx="3" />
        <text v-if="r.sold > 0" class="sb-round-dilution-barval" :x="r.cx" :y="r.barY - 8" text-anchor="middle">
          −{{ r.sold }}%
        </text>
        <text v-else class="sb-round-dilution-zero" :x="r.cx" :y="Y0 - 16" :text-anchor="r.anchor">未出让</text>
        <text class="sb-round-dilution-xname" :x="r.cx" :y="Y0 + 24" :text-anchor="r.anchor">{{ r.name }}</text>
        <text class="sb-round-dilution-xnote" :x="r.cx" :y="Y0 + 42" :text-anchor="r.anchor">{{ r.note }}</text>
      </g>

      <polyline class="sb-round-dilution-line" :points="LINE_POINTS" />
      <g v-for="r in ROWS" :key="'p' + r.name" class="sb-round-dilution-pt">
        <circle class="sb-round-dilution-dot" :cx="r.cx" :cy="r.lineY" r="5" />
        <text class="sb-round-dilution-dotval" :x="r.cx" :y="r.lineY - 14" :text-anchor="r.anchor">{{ r.left }}%</text>
      </g>
    </svg>

    <span class="sr-only">
      这条示意路径一共五格。自有资金：出让 0%，创始团队持股 100%；天使：出让 18%，剩 82%；
      Pre-A 与 A：出让 20%，剩 62%；B：出让 18%，剩 44%；C 轮：出让 14%，剩 30%。
      四轮累计出让 70%，创始团队从 100% 一路降到 30%。窄屏时这张图换成五段整条，
      每一段拆成三部分：以前卖掉的、本轮卖掉的、创始团队还拿着的——天使那格以前卖掉 0%，Pre-A 那格 18%，
      B 那格 38%，C 那格 56%。每轮 14% 到 20% 取自通行区间 10% 到 20%，
      到 C 轮后创始团队常见落在 20% 到 35%，均为示意、待核，行业与轮次差别很大。
    </span>

    <figure class="sb-round-dilution-fig">
      <div v-for="r in ROWS" :key="'row' + r.name" class="sb-round-dilution-row">
        <div class="sb-round-dilution-rmeta">
          <span class="sb-round-dilution-rname">{{ r.name }}</span>
          <span class="sb-round-dilution-rsold">本轮 −{{ r.sold }}%</span>
        </div>
        <div class="sb-round-dilution-plot">
          <div class="sb-round-dilution-track">
            <span
              v-if="r.soldBefore > 0"
              class="sb-round-dilution-seg is-before"
              :style="{ width: r.soldBefore + '%' }"
            >
              <span class="sb-round-dilution-seg-label">以前卖掉 {{ r.soldBefore }}%</span>
            </span>
            <span v-if="r.sold > 0" class="sb-round-dilution-seg is-this" :style="{ width: r.sold + '%' }">
              <span class="sb-round-dilution-seg-label">本轮 {{ r.sold }}%</span>
            </span>
            <span class="sb-round-dilution-seg is-left" :style="{ width: r.left + '%' }">
              <span class="sb-round-dilution-seg-label">创始团队 {{ r.left }}%</span>
            </span>
          </div>
          <span class="sb-round-dilution-keep">
            {{ r.left }}%
            <em>剩</em>
          </span>
        </div>
      </div>
    </figure>

    <p class="sb-cap">
      按这条示意路径，四轮共出让 <b>{{ TOTAL_SOLD }}%</b>，创始团队从 <b>100%</b> 降到
      <b>{{ LAST.left }}%</b>（每轮 <b>14%–20%</b>，通行区间 <b>10%–20%</b>，均为示意、待核）。
      但稀释本身不是坏事：<b>用便宜的钱，换不该你做的事</b>才是融资的目的。真正容易被漏掉的是第二个数字——
      每轮的代价不只是百分比，还有跟着一起进来的条款（清算优先、回购、董事会席位）。
      条款以当年当地口径与专业意见为准，签约前请律师读一遍，这笔钱不要省。
    </p>
  </div>
</template>

<style scoped>
.sb-round-dilution-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-bottom: 10px;
}

.sb-round-dilution-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-round-dilution-key i {
  width: 13px;
  height: 11px;
  border-radius: 3px;
}

.sb-round-dilution-key i.is-bar {
  background: var(--coral);
}

.sb-round-dilution-key i.is-line {
  width: 16px;
  height: 2px;
  border-radius: 0;
  background: var(--accent);
}

.sb-round-dilution-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-round-dilution-grid line {
  stroke: var(--line);
  stroke-width: 1;
}

.sb-round-dilution-base {
  stroke: var(--line-strong);
  stroke-width: 1.2;
}

.sb-round-dilution-tick,
.sb-round-dilution-zero {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  fill: var(--faint);
}

.sb-round-dilution-tick {
  text-anchor: end;
}

.sb-round-dilution-bar {
  fill: var(--coral);
  opacity: 0.9;
  transition: opacity 0.3s var(--ease);
}

.sb-round-dilution-col:hover .sb-round-dilution-bar {
  opacity: 1;
}

.sb-round-dilution-ghost {
  fill: none;
  stroke: var(--line-strong);
  stroke-width: 1;
  stroke-dasharray: 3 3;
}

.sb-round-dilution-barval {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  fill: var(--coral);
}

.sb-round-dilution-xname {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  fill: var(--ink-2);
}

.sb-round-dilution-xnote {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--faint);
}

.sb-round-dilution-line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sb-round-dilution-dot {
  fill: var(--panel);
  stroke: var(--accent);
  stroke-width: 2.4;
}

.sb-round-dilution-dotval {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  fill: var(--accent);
}

/* 下面这套纵列百分比条是窄屏的读法：桌面隐藏，≤760px 接管全部数字 */
.sb-round-dilution-fig {
  display: none;
  margin: 0;
}

.sb-round-dilution-row {
  margin-bottom: 12px;
}

.sb-round-dilution-rmeta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 5px;
}

.sb-round-dilution-rname {
  font-size: 13px;
  font-weight: 660;
  color: var(--ink);
}

.sb-round-dilution-rsold {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--coral);
}

.sb-round-dilution-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58px;
  align-items: center;
  gap: 10px;
}

.sb-round-dilution-track {
  display: flex;
  min-width: 0;
  height: 34px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--panel-2);
}

.sb-round-dilution-seg {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  padding-left: 7px;
  border-right: 1px solid var(--panel);
  transition: width 0.3s var(--ease);
}

.sb-round-dilution-seg:last-child {
  border-right: none;
}

.sb-round-dilution-seg.is-before {
  background: var(--blue);
  opacity: 0.45;
}

.sb-round-dilution-seg.is-this {
  background: var(--coral);
}

.sb-round-dilution-seg.is-left {
  background: var(--accent);
}

.sb-round-dilution-seg-label {
  font-family: var(--font-mono);
  font-size: 9.5px;
  line-height: 1.15;
  letter-spacing: 0.04em;
  color: var(--ink-2);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sb-round-dilution-keep {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  white-space: nowrap;
}

.sb-round-dilution-keep em {
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.1em;
  color: var(--faint);
}

@media (max-width: 760px) {
  /* 窄屏不缩字：SVG 整张换成纵列百分比条，图例与段内文字退出布局 */
  .sb-round-dilution-legend,
  .sb-round-dilution-svg,
  .sb-round-dilution-seg-label {
    display: none;
  }

  .sb-round-dilution-fig {
    display: block;
  }

  .sb-round-dilution-plot {
    grid-template-columns: minmax(0, 1fr) 52px;
    gap: 8px;
  }

  .sb-round-dilution-track {
    height: 38px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-round-dilution-seg,
  .sb-round-dilution-bar {
    transition: none;
  }
}
</style>
