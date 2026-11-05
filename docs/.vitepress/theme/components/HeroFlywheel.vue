<script setup lang="ts">
// 首页 Hero 用的飞轮：只负责"看起来在转"。
// 讲解版是 FlywheelDiagram.vue，那份才有能读的节点文字。
// 纯几何计算，不碰 window / Math.random / Date，服务端与客户端渲染一致。

const COUNT = 5
const CX = 170
const CY = 170
const R = 100
const STEP = 360 / COUNT

const polar = (r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

const round = (n: number) => Math.round(n * 100) / 100

/** 顺时针画一段弧（起点角度小于终点角度） */
const arcPath = (r: number, from: number, to: number) => {
  const a = polar(r, from)
  const b = polar(r, to)
  return `M ${round(a.x)} ${round(a.y)} A ${r} ${r} 0 0 1 ${round(b.x)} ${round(b.y)}`
}

/** 弧终点处的箭头：沿切线方向指出"下一环在哪" */
const headPath = (deg: number) => {
  const rad = (deg * Math.PI) / 180
  const px = CX + R * Math.cos(rad)
  const py = CY + R * Math.sin(rad)
  const tx = -Math.sin(rad)
  const ty = Math.cos(rad)
  const nx = Math.cos(rad)
  const ny = Math.sin(rad)
  const tip = { x: px + tx * 13, y: py + ty * 13 }
  const left = { x: px - tx * 2 + nx * 7, y: py - ty * 2 + ny * 7 }
  const right = { x: px - tx * 2 - nx * 7, y: py - ty * 2 - ny * 7 }
  return `M ${round(tip.x)} ${round(tip.y)} L ${round(left.x)} ${round(left.y)} L ${round(right.x)} ${round(right.y)} Z`
}

const NODES = Array.from({ length: COUNT }, (_, i) => {
  const deg = -90 + i * STEP
  const p = polar(R, deg)
  return { id: i + 1, x: round(p.x), y: round(p.y) }
})

const ARCS = NODES.map((_, i) => {
  const from = -90 + i * STEP + 20
  const to = -90 + (i + 1) * STEP - 20
  return { id: i, d: arcPath(R, from, to), head: headPath(to) }
})

const LABELS = ['老客户不用重新买', '口碑替你先说话', '省下的钱投回交付', '每一环都得有人推']
</script>

<template>
  <div class="sb-hero-flywheel sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Growth Flywheel · 增长飞轮</span>
      <p class="sb-widget-sub">它不是个装饰图案：它说的是"这家公司靠什么自己转起来"。</p>
    </div>

    <figure class="sb-hero-flywheel-fig">
      <svg
        class="sb-hero-flywheel-svg"
        viewBox="0 0 340 340"
        role="presentation"
        aria-hidden="true"
        focusable="false"
      >
        <g class="sb-hero-flywheel-rotor">
          <circle class="sb-hero-flywheel-orbit" :cx="CX" :cy="CY" :r="R" />
          <path v-for="a in ARCS" :key="`arc-${a.id}`" class="sb-hero-flywheel-arc" :d="a.d" />
          <path v-for="a in ARCS" :key="`head-${a.id}`" class="sb-hero-flywheel-head" :d="a.head" />
        </g>

        <g v-for="n in NODES" :key="`node-${n.id}`">
          <circle class="sb-hero-flywheel-node" :cx="n.x" :cy="n.y" r="19" />
          <text class="sb-hero-flywheel-num" :x="n.x" :y="n.y + 4">{{ n.id }}</text>
        </g>

        <circle class="sb-hero-flywheel-pulse" :cx="CX" :cy="CY" r="46" />
        <circle class="sb-hero-flywheel-core" :cx="CX" :cy="CY" r="7" />
        <text class="sb-hero-flywheel-center" :x="CX" :y="CY - 22">转起来</text>
        <text class="sb-hero-flywheel-center-sub" :x="CX" :y="CY + 30">推哪一格</text>
      </svg>

      <span class="sr-only">
        飞轮示意：五个节点首尾相接成环，顺序是「更好的交付」→「更多老客户」→
        「更低的获客成本」→「更多能投回的钱」→ 回到「更好的交付」。
        环上有五段箭头，箭头方向表示前一环把后一环推高；中心那一点是创始人手上那一推。
        这张图不承诺它自己会转，每一环都需要人推。
      </span>
    </figure>

    <div class="sb-hero-flywheel-labels">
      <p v-for="(l, i) in LABELS" :key="l" class="sb-hero-flywheel-label">
        <span class="sb-hero-flywheel-idx">{{ i + 1 }}</span>{{ l }}
      </p>
    </div>

    <p class="sb-cap">
      环上有 <b>5</b> 格：<b>交付</b>换来<b>老客户</b>，老客户把<b>获客成本</b>压下来，省下的钱
      <b>投回交付</b>，然后再绕回第一格。飞轮最不浪漫的地方就在这儿：它<b>不会自己转</b>——
      哪一格没人推，整环当场停下。
    </p>
  </div>
</template>

<style scoped>
.sb-hero-flywheel {
  max-width: 420px;
  margin-inline: auto;
}

.sb-hero-flywheel-fig {
  margin: 0;
}

.sb-hero-flywheel-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-hero-flywheel-orbit {
  fill: none;
  stroke: var(--line);
  stroke-width: 1;
  stroke-dasharray: 3 7;
}

.sb-hero-flywheel-arc {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.4;
  stroke-linecap: round;
  opacity: 0.55;
}

.sb-hero-flywheel-head {
  fill: var(--accent);
  opacity: 0.75;
}

/* 只有环在转，节点与数字保持正立，读起来不乱 */
.sb-hero-flywheel-rotor {
  transform-box: view-box;
  transform-origin: center;
  animation: sb-hero-flywheel-spin 30s linear infinite;
}

@keyframes sb-hero-flywheel-spin {
  to {
    transform: rotate(360deg);
  }
}

.sb-hero-flywheel-node {
  fill: var(--panel-2);
  stroke: var(--accent);
  stroke-width: 1.6;
}

.sb-hero-flywheel-num {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  fill: var(--ink-2);
  text-anchor: middle;
}

.sb-hero-flywheel-center {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  fill: var(--ink);
  text-anchor: middle;
}

.sb-hero-flywheel-center-sub {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  fill: var(--faint);
  text-anchor: middle;
}

.sb-hero-flywheel-pulse {
  fill: var(--accent-soft);
  stroke: var(--line);
  stroke-width: 1;
  transform-box: view-box;
  transform-origin: center;
  animation: sb-hero-flywheel-breathe 4.5s var(--ease) infinite;
}

.sb-hero-flywheel-core {
  fill: var(--accent);
}

@keyframes sb-hero-flywheel-breathe {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.92);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

.sb-hero-flywheel-labels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 12px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed var(--line-strong);
}

.sb-hero-flywheel-label {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

.sb-hero-flywheel-idx {
  flex: none;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--faint);
}

@media (max-width: 760px) {
  /* 窄屏仍是正方形：viewBox 保证，字号跟着缩，不做等比压扁的横条 */
  .sb-hero-flywheel-labels {
    gap: 5px 10px;
  }

  .sb-hero-flywheel-label {
    font-size: 11.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-hero-flywheel-rotor,
  .sb-hero-flywheel-pulse {
    animation: none;
  }
}
</style>
